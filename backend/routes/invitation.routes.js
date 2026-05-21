const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const invitationController = require("../controllers/invitation.controller");

router.get("/", auth, invitationController.getMyInvitations);
router.post("/:id/accept", auth, invitationController.acceptInvitation);
router.post("/:id/decline", auth, invitationController.declineInvitation);

module.exports = router;
