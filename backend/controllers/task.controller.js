const Task = require("../models/task.model");
const Project = require("../models/project.model");

// GET /api/projects/:projectId/tasks
exports.getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        // allow access check
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        const isMember = project.members.includes(req.user.id) || project.owner.toString() === req.user.id;
        if (!isMember) return res.status(403).json({ msg: "Access denied" });

        const tasks = await Task.find({ project: projectId })
            .populate("assignee", "name email")
            .sort({ order: 1 }); // Sort by order for display

        // Group by status
        const groupedTasks = {
            todo: tasks.filter(t => t.status === "todo"),
            "in-progress": tasks.filter(t => t.status === "in-progress"),
            review: tasks.filter(t => t.status === "review"),
            done: tasks.filter(t => t.status === "done")
        };

        res.json(groupedTasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/tasks
exports.createTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, project, assignee } = req.body;

        // Verify project access
        const projectDoc = await Project.findById(project);
        if (!projectDoc) return res.status(404).json({ msg: "Project not found" });

        const isMember = projectDoc.members.includes(req.user.id) || projectDoc.owner.toString() === req.user.id;
        if (!isMember) return res.status(403).json({ msg: "Access denied" });

        // Get highest order for the column to append
        const lastTask = await Task.findOne({ project, status: status || "todo" }).sort({ order: -1 });
        const order = lastTask ? lastTask.order + 1 : 0;

        const newTask = new Task({
            title,
            description,
            status,
            priority,
            dueDate: dueDate === "" ? null : dueDate,
            project,
            assignee,
            createdBy: req.user.id,
            order
        });

        const task = await newTask.save();
        // Populate assignee for frontend
        await task.populate("assignee", "name email");

        // Emit event
        const io = req.app.get("io");
        io.to(project).emit("taskCreated", task);

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res) => {
    try {
        const { title, description, status, priority, dueDate, assignee, newOrder, subtasks } = req.body;

        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        // Access check logic:
        // 1. Project Owner can update EVERYTHING.
        // 2. Assignee can ONLY update 'status' and 'subtasks'.

        const project = await Project.findById(task.project);
        const isOwner = project.owner.toString() === req.user.id;
        const isAssignee = task.assignee?.toString() === req.user.id;

        if (!isOwner && !isAssignee) {
            return res.status(403).json({ msg: "Access denied. Only project owners or assignees can edit this task." });
        }

        // If not owner but is assignee, verify they are only trying to update status or subtasks
        if (!isOwner && isAssignee) {
            const updates = Object.keys(req.body);
            const allowedAssigneeUpdates = ['status', 'subtasks', 'newOrder'];
            const isTryingToUpdateRestricted = updates.some(key => !allowedAssigneeUpdates.includes(key));

            if (isTryingToUpdateRestricted) {
                return res.status(403).json({ msg: "Assignees can only update status and subtasks." });
            }
        }

        const oldStatus = task.status;
        const oldOrder = task.order;
        let taskMoved = false;

        // Fields update
        if (isOwner) {
            if (title) task.title = title;
            if (description !== undefined) task.description = description;
            if (priority) task.priority = priority;
            if (dueDate !== undefined) task.dueDate = dueDate === "" ? null : dueDate;
            if (assignee !== undefined) task.assignee = assignee;
        }

        if (subtasks) task.subtasks = subtasks;

        // 1. Status Change (Move to another column)
        if (status && status !== oldStatus) {
            taskMoved = true;

            // A. Remove from old column -> Close Gap
            await Task.updateMany(
                { project: task.project, status: oldStatus, order: { $gt: oldOrder } },
                { $inc: { order: -1 } }
            );

            // B. Add to new column -> Open Space (if valid newOrder provided)
            task.status = status;

            if (newOrder !== undefined) {
                await Task.updateMany(
                    { project: task.project, status: status, order: { $gte: newOrder } },
                    { $inc: { order: 1 } }
                );
                task.order = newOrder;
            } else {
                // Append to end if no order specified
                const lastTask = await Task.findOne({ project: task.project, status }).sort({ order: -1 });
                task.order = lastTask ? lastTask.order + 1 : 0;
            }

            // 2. Reorder in Same Column
        } else if (newOrder !== undefined && newOrder !== oldOrder) {
            taskMoved = true;

            if (newOrder > oldOrder) {
                // Moving Down: decrement intermediate items
                await Task.updateMany(
                    {
                        project: task.project,
                        status: task.status,
                        order: { $gt: oldOrder, $lte: newOrder }
                    },
                    { $inc: { order: -1 } }
                );
            } else {
                // Moving Up: increment intermediate items
                await Task.updateMany(
                    {
                        project: task.project,
                        status: task.status,
                        order: { $gte: newOrder, $lt: oldOrder }
                    },
                    { $inc: { order: 1 } }
                );
            }
            task.order = newOrder;
        }

        await task.save();
        await task.populate("assignee", "name email");

        // Emit events via Socket.io
        const io = req.app.get("io");
        if (taskMoved) {
            io.to(task.project.toString()).emit("taskMoved", task);
        } else {
            io.to(task.project.toString()).emit("taskUpdated", task);
        }

        res.json(task);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: "Task not found" });

        const project = await Project.findById(task.project);

        const isProjectOwner = project.owner.toString() === req.user.id;

        if (!isProjectOwner) {
            return res.status(403).json({ msg: "Access denied. Only project owners can delete tasks." });
        }

        const projectId = task.project.toString();
        await task.deleteOne();

        // Emit event
        const io = req.app.get("io");
        io.to(projectId).emit("taskDeleted", req.params.id);

        res.json({ msg: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
