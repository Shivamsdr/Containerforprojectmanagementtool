const Project = require("../models/project.model");
const Task = require("../models/task.model");

// GET /api/projects
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [{ owner: req.user.id }, { members: req.user.id }],
        })
            .populate("owner", "name email")
            .populate("members", "name email")
            .sort({ updatedAt: -1 });

        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /api/projects
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) return res.status(400).json({ msg: "Project name is required" });

        const newProject = new Project({
            name,
            description,
            owner: req.user.id,
            members: [req.user.id] // Owner is also a member
        });

        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!project) return res.status(404).json({ msg: "Project not found" });

        // Access check
        const isMember = project.members.some(member => member._id.toString() === req.user.id);
        const isOwner = project.owner._id.toString() === req.user.id;

        if (!isMember && !isOwner) {
            return res.status(403).json({ msg: "Access denied" });
        }

        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// POST /api/projects/:id/members
exports.addMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        // Authorization: Only owner can add members
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Access denied. Only owner can add members." });
        }

        // Validate User exists
        const User = require("../models/User");
        const userToAdd = await User.findById(userId);
        if (!userToAdd) return res.status(404).json({ msg: "User to add not found" });

        // Check if already member
        if (project.members.includes(userId)) {
            return res.status(400).json({ msg: "User is already a member" });
        }

        // Add member
        project.members.push(userId);
        await project.save();

        // Populate for response
        await project.populate("members", "name email");

        // Emit socket event
        const io = req.app.get("io");
        io.to(projectId).emit("memberAdded", {
            project: projectId,
            member: {
                _id: userToAdd._id,
                name: userToAdd.name,
                email: userToAdd.email
            }
        });

        res.json(project.members);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
    try {
        const { name, description } = req.body;
        const projectId = req.params.id;

        if (!name || name.trim() === "") {
            return res.status(400).json({ msg: "Project name is required" });
        }

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        // Authorization: Only owner can update
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Access denied. Only owner can update project." });
        }

        project.name = name;
        project.description = description;

        await project.save();
        await project.populate("owner", "name email");
        await project.populate("members", "name email");

        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ msg: "Project not found" });

        // Authorization: Only owner can delete
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Access denied. Only owner can delete project." });
        }

        // Delete project
        await project.deleteOne();

        // Cascade delete tasks
        await Task.deleteMany({ project: projectId });

        // Emit socket event
        const io = req.app.get("io");
        io.to(projectId).emit("projectDeleted", projectId);

        res.json({ msg: "Project deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
