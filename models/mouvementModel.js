const db = require('../config/db');

// Obtenir tous les mouvements
exports.getAll = async () => {
    const [rows] = await db.query(`
    SELECT m.*, e.nom, e.prenom
    FROM mouvements_rh m
    LEFT JOIN employes e ON m.employe_id = e.id
    ORDER BY m.date DESC
  `);
    return rows;
};

// Obtenir un mouvement par ID
exports.getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM mouvements_rh WHERE id = ?', [id]);
    return rows[0];
};

// Créer un nouveau mouvement
exports.create = async (data) => {
    const sql = `
    INSERT INTO mouvements_rh (employe_id, date, type, description)
    VALUES (?, ?, ?, ?)
  `;
    const values = [data.employe_id, data.date, data.type, data.description];
    const [result] = await db.query(sql, values);
    return result.insertId;
};

// Mettre à jour un mouvement
exports.update = async (id, data) => {
    const sql = `
    UPDATE mouvements_rh
    SET employe_id = ?, date = ?, type = ?, description = ?
    WHERE id = ?
  `;
    const values = [data.employe_id, data.date, data.type, data.description, id];
    await db.query(sql, values);
};

// Supprimer un mouvement
exports.delete = async (id) => {
    await db.query('DELETE FROM mouvements_rh WHERE id = ?', [id]);
};
