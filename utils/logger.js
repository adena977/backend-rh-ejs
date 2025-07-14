const Log = require('../models/logModel');

exports.logAction = async (req, action, table, elementId) => {
    if (!req.session.user) return;
    await Log.create({
        utilisateur_id: req.session.user.id,
        action,
        table_modifiee: table,
        id_element: elementId
    });
};
