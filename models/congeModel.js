// 📁 models/congeModel.js
const db = require('../config/db');

exports.getAll = async () => {
    const [rows] = await db.query(`
    SELECT c.*, e.nom, e.prenom
    FROM conges c
    JOIN employes e ON c.employe_id = e.id
    ORDER BY c.date_debut DESC
  `);
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM conges WHERE id = ?', [id]);
    return rows[0];
};

exports.getByEmployeId = async (employeId) => {
    const [rows] = await db.query('SELECT * FROM conges WHERE employe_id = ? ORDER BY date_debut DESC', [employeId]);
    return rows;
};

exports.create = async (data) => {
    const sql = `INSERT INTO conges (employe_id, date_debut, date_fin, type, motif, statut) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [data.employe_id, data.date_debut, data.date_fin, data.type, data.motif, data.statut || 'en attente'];
    await db.query(sql, values);
};

exports.update = async (id, data) => {
    const sql = `UPDATE conges SET employe_id = ?, date_debut = ?, date_fin = ?, type = ?, motif = ?, statut = ? WHERE id = ?`;
    const values = [data.employe_id, data.date_debut, data.date_fin, data.type, data.motif, data.statut || 'en attente', id];
    await db.query(sql, values);
};

exports.delete = async (id) => {
    await db.query('DELETE FROM conges WHERE id = ?', [id]);
};
