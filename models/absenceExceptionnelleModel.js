// 📁 models/absenceExceptionnelleModel.js
const db = require('../config/db');

exports.getAll = async () => {
    const [rows] = await db.query(`
    SELECT a.*, e.nom, e.prenom
    FROM absences_exceptionnelles a
    JOIN employes e ON a.employe_id = e.id
    ORDER BY a.date_debut DESC
  `);
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM absences_exceptionnelles WHERE id = ?', [id]);
    return rows[0];
};

exports.getByEmployeId = async (employeId) => {
    const [rows] = await db.query('SELECT * FROM absences_exceptionnelles WHERE employe_id = ? ORDER BY date_debut DESC', [employeId]);
    return rows;
};

exports.create = async (data) => {
    const sql = `INSERT INTO absences_exceptionnelles (employe_id, date_debut, date_fin, motif, statut) VALUES (?, ?, ?, ?, ?)`;
    const values = [data.employe_id, data.date_debut, data.date_fin, data.motif, data.statut || 'en attente'];
    await db.query(sql, values);
};

exports.update = async (id, data) => {
    const sql = `UPDATE absences_exceptionnelles SET employe_id = ?, date_debut = ?, date_fin = ?, motif = ?, statut = ? WHERE id = ?`;
    const values = [data.employe_id, data.date_debut, data.date_fin, data.motif, data.statut || 'en attente', id];
    await db.query(sql, values);
};

exports.delete = async (id) => {
    await db.query('DELETE FROM absences_exceptionnelles WHERE id = ?', [id]);
};
