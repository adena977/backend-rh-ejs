
// 📁 models/formationModel.js
const db = require('../config/db');

exports.getAll = async () => {
    const [rows] = await db.query('SELECT * FROM formations ORDER BY date_debut DESC');
    return rows;
};

exports.getById = async (id) => {
    const [rows] = await db.query('SELECT * FROM formations WHERE id = ?', [id]);
    return rows[0];
};

exports.create = async (data) => {
    const { titre, date_debut, date_fin, formateur } = data;
    await db.query('INSERT INTO formations (titre, date_debut, date_fin, formateur) VALUES (?, ?, ?, ?)', [titre, date_debut, date_fin, formateur]);
};

exports.update = async (id, data) => {
    const { titre, date_debut, date_fin, formateur } = data;
    await db.query('UPDATE formations SET titre = ?, date_debut = ?, date_fin = ?, formateur = ? WHERE id = ?', [titre, date_debut, date_fin, formateur, id]);
};

exports.delete = async (id) => {
    await db.query('DELETE FROM formations WHERE id = ?', [id]);
};

exports.getInscriptions = async (formationId) => {
    const [rows] = await db.query(`
    SELECT ef.*, e.nom, e.prenom
    FROM employe_formation ef
    JOIN employes e ON ef.employe_id = e.id
    WHERE ef.formation_id = ?
  `, [formationId]);
    return rows;
};

exports.inscrireEmploye = async (formationId, employeId, statut) => {
    await db.query('INSERT INTO employe_formation (formation_id, employe_id, statut) VALUES (?, ?, ?)', [formationId, employeId, statut]);
};

exports.desinscrireEmploye = async (formationId, employeId) => {
    await db.query('DELETE FROM employe_formation WHERE formation_id = ? AND employe_id = ?', [formationId, employeId]);
};
exports.mettreAJourStatut = async (formation_id, employe_id, statut) => {
    const [result] = await db.query(
        `UPDATE employe_formation 
     SET statut = ? 
     WHERE formation_id = ? AND employe_id = ?`,
        [statut, formation_id, employe_id]
    );
    return result;
};