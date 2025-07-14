const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');

// Marquer tout comme lu
router.post('/marquer-comme-lu', async (req, res) => {
    try {
        if (!req.session.user) return res.status(401).json({ success: false });
        await Notification.markAllAsRead(req.session.user.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
