const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const taskController = require("../controllers/task.controller");

router.post("/", auth, taskController.createTask);
router.put("/:id", auth, taskController.updateTask);
router.delete("/:id", auth, taskController.deleteTask);

module.exports = router;
