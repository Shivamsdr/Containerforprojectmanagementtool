const User = require("../models/User");

// Helper to escape regex special characters
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// GET /api/users/search?q=query
exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.length < 2) {
            return res.status(400).json({ message: "Search query must be at least 2 characters long" });
        }

        const regex = new RegExp(escapeRegex(q), 'gi');

        const currentUserId = req.user._id || req.user.id;
        const users = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                {
                    $or: [
                        { name: regex },
                        { email: regex }
                    ]
                }
            ]
        })
            .select("_id name email")
            .limit(10);

        res.json({ users });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
