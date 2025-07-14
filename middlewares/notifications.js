const Notification = require('../models/notificationModel');

module.exports = async (req, res, next) => {
    try {
        if (req.session.user) {
            const notifications = await Notification.getByUserId(req.session.user.id);
            const nbNotifications = await Notification.countUnread(req.session.user.id);

            res.locals.notifications = notifications;
            res.locals.nbNotifications = nbNotifications;
        } else {
            res.locals.notifications = [];
            res.locals.nbNotifications = 0;
        }

        next();
    } catch (error) {
        console.error('Erreur middleware notifications:', error);
        next();
    }
};
