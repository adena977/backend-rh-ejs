// 📁 models/documentRhModel.js
const db = require('../config/db');

exports.getAll = async () => {
    const [rows] = await db.query(`
    SELECT d.*, e.nom, e.prenom
    FROM documents_rh d
    LEFT JOIN employes e ON d.employe_id = e.id
    ORDER BY d.date_upload DESC
  `);
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM documents_rh WHERE id = ?', [id]);
    return rows[0];
};

exports.create = async (data) => {
    const sql = `INSERT INTO documents_rh (employe_id, type, titre, fichier_url) VALUES (?, ?, ?, ?)`;
    const values = [data.employe_id, data.type, data.titre, data.fichier_url];
    await db.query(sql, values);
};

exports.update = async (id, data) => {
    const sql = `UPDATE documents_rh SET employe_id = ?, type = ?, titre = ?, fichier_url = ? WHERE id = ?`;
    const values = [data.employe_id, data.type, data.titre, data.fichier_url, id];
    await db.query(sql, values);
};

exports.delete = async (id) => {
    await db.query('DELETE FROM documents_rh WHERE id = ?', [id]);
};
