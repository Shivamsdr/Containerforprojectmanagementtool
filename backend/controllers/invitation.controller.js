const Invitation = require("../models/Invitation");
const Project = require("../models/project.model");
const sendEmail = require("../utils/sendEmail");

// POST /api/projects/:id/invitations - create invitation (project owner only)
exports.createInvitation = async (req, res) => {
  try {
    const { userId: inviteeId } = req.body;
    const projectId = req.params.id;
    const inviterId = req.user._id || req.user.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.owner.toString() !== inviterId.toString()) {
      return res.status(403).json({ msg: "Only the project owner can invite members." });
    }
    if (project.members.some((m) => m.toString() === inviteeId)) {
      return res.status(400).json({ msg: "User is already a member." });
    }

    let invitation = await Invitation.findOne({ project: projectId, invitee: inviteeId, status: "pending" });
    if (invitation) return res.status(400).json({ msg: "Invitation already sent." });

    invitation = await Invitation.create({
      project: projectId,
      inviter: inviterId,
      invitee: inviteeId,
      status: "pending",
    });
    await invitation.populate("inviter", "name email");
    await invitation.populate("project", "name");
    await invitation.populate("invitee", "name email");

    const io = req.app.get("io");
    io.to("user:" + inviteeId.toString()).emit("invitationReceived", {
      invitation: invitation.toObject(),
    });

    sendEmail({
      to: invitation.invitee.email,
      subject: "Project Invitation",
      text: `You have been invited to join project ${invitation.project.name} by ${invitation.inviter.name}.`,
    }).catch((error) => {
      console.error("Email sending failed:", error);
    });

    res.status(201).json(invitation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/invitations - list my pending invitations
exports.getMyInvitations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const invitations = await Invitation.find({ invitee: userId, status: "pending" })
      .populate("project", "name")
      .populate("inviter", "name email")
      .sort({ createdAt: -1 });
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/invitations/:id/accept - accept invitation and join project
exports.acceptInvitation = async (req, res) => {
  try {
    const invitationId = req.params.id;
    const userId = req.user._id || req.user.id;

    const invitation = await Invitation.findById(invitationId)
      .populate("project");
    if (!invitation) return res.status(404).json({ msg: "Invitation not found" });
    if (invitation.status !== "pending") {
      return res.status(400).json({ msg: "Invitation is no longer pending." });
    }
    if (invitation.invitee.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "You can only accept your own invitations." });
    }

    const projectId = invitation.project._id || invitation.project;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });
    if (project.members.some((m) => m.toString() === userId.toString())) {
      invitation.status = "accepted";
      await invitation.save();
      return res.json({ msg: "Already a member.", project });
    }

    project.members.push(userId);
    await project.save();
    invitation.status = "accepted";
    await invitation.save();

    const io = req.app.get("io");
    io.to(project._id.toString()).emit("memberAdded", { project: project._id, member: req.user });

    res.json({ msg: "Invitation accepted.", project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/invitations/:id/decline - decline invitation
exports.declineInvitation = async (req, res) => {
  try {
    const invitationId = req.params.id;
    const userId = req.user._id || req.user.id;

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) return res.status(404).json({ msg: "Invitation not found" });
    if (invitation.status !== "pending") {
      return res.status(400).json({ msg: "Invitation is no longer pending." });
    }
    if (invitation.invitee.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "You can only decline your own invitations." });
    }

    invitation.status = "declined";
    await invitation.save();
    res.json({ msg: "Invitation declined." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
