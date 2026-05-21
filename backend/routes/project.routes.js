const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const projectController = require("../controllers/project.controller");
const taskController = require("../controllers/task.controller");
const invitationController = require("../controllers/invitation.controller");

router.get("/", auth, projectController.getProjects);
router.post("/", auth, projectController.createProject);
router.get("/:projectId/tasks", auth, taskController.getTasksByProject);
router.get("/:id", auth, projectController.getProjectById);
router.put("/:id", auth, projectController.updateProject);
router.delete("/:id", auth, projectController.deleteProject);
router.post("/:id/members", auth, projectController.addMember);
router.post("/:id/invitations", auth, invitationController.createInvitation);

module.exports = router;
