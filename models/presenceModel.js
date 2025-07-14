// models/presenceModel.js
const db = require('../config/db');

/** Récupérer toutes les présences avec le nom/prénom de l’employé */
exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT p.*, e.nom, e.prenom
    FROM presences p
    JOIN employes e ON e.id = p.employe_id
    ORDER BY p.date DESC, p.heure_arrivee
  `);
  return rows;
};

/** Créer une nouvelle présence */
exports.create = async (data) => {
  const sql = `
    INSERT INTO presences
      (employe_id, date, heure_arrivee, heure_depart, statut)
    VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    data.employe_id,
    data.date,
    data.heure_arrivee || null,
    data.heure_depart  || null,
    data.statut        || 'présent'
  ];
  const [result] = await db.query(sql, values);
  return result;
};

/** Trouver une présence par ID */
exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM presences WHERE id = ?', [id]);
  return rows[0];
};

/** Mettre à jour une présence */
exports.update = async (id, data) => {
  const sql = `
    UPDATE presences SET
      employe_id = ?,
      date        = ?,
      heure_arrivee = ?,
      heure_depart  = ?,
      statut        = ?
    WHERE id = ?
  `;
  const values = [
    data.employe_id,
    data.date,
    data.heure_arrivee || null,
    data.heure_depart  || null,
    data.statut,
    id
  ];
  const [result] = await db.query(sql, values);
  return result;
};

/** Supprimer une présence */
exports.delete = async (id) => {
  const [result] = await db.query('DELETE FROM presences WHERE id = ?', [id]);
  return result;
};
exports.findByDateAndEmploye = async (date, employe_id) => {
  const [rows] = await db.query('SELECT * FROM presences WHERE date = ? AND employe_id = ?', [date, employe_id]);
  return rows[0];
};

exports.create = async ({ employe_id, date, heure_arrivee }) => {
  return db.query('INSERT INTO presences (employe_id, date, heure_arrivee) VALUES (?, ?, ?)', [employe_id, date, heure_arrivee]);
};
exports.updateDeparture = async (id, heure_depart) => {
  return db.query('UPDATE presences SET heure_depart = ? WHERE id = ?', [heure_depart, id]);
};
