const db = require('../config/db');

// Récupérer les 5 dernières notifications d’un utilisateur
exports.getByUserId = async (userId) => {
    const [rows] = await db.query(`
    SELECT * FROM notifications
    WHERE destinataire_id = ?
    ORDER BY date_envoi DESC
    LIMIT 5
  `, [userId]);
    return rows;
};

// Compter les notifications non lues
exports.countUnread = async (userId) => {
    const [rows] = await db.query(`
    SELECT COUNT(*) AS total FROM notifications
    WHERE destinataire_id = ? AND lue = FALSE
  `, [userId]);
    return rows[0].total;
};

// Marquer toutes les notifications comme lues
exports.markAllAsRead = async (userId) => {
    await db.query(`
    UPDATE notifications SET lue = TRUE
    WHERE destinataire_id = ?
  `, [userId]);
};
exports.create = async (destinataire_id, message) => {
    const sql = `INSERT INTO notifications (destinataire_id, message) VALUES (?, ?)`;
    const [result] = await db.query(sql, [destinataire_id, message]);
    return result.insertId;
};