const db = require('../config/db'); // ta config MySQL

async function createNotification(destinataire_id, message) {
    const sql = `INSERT INTO notifications (destinataire_id, message) VALUES (?, ?)`;
    await db.query(sql, [destinataire_id, message]);
}

module.exports = { createNotification };

async function getAdminsAndManagers() {
    const sql = `SELECT id FROM utilisateurs WHERE role IN ('admin', 'manager')`;
    const [rows] = await db.query(sql);
    return rows.map(row => row.id);
}

module.exports = { createNotification, getAdminsAndManagers };

async function notifyNewEmployee(nom, prenom) {
    const admins = await getAdminsAndManagers();
    const message = `Nouvel employé ajouté : ${nom} ${prenom}`;

    for (const adminId of admins) {
        await createNotification(adminId, message);
    }
}

module.exports = { createNotification, getAdminsAndManagers, notifyNewEmployee };
