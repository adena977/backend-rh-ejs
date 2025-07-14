const Log = require('../models/logModel');

exports.index = async (req, res) => {
    const logs = await Log.getAll();
    res.render('logs/index', {
        title: 'Historique des actions',
        page: 'logs',
        logs
    });
};
