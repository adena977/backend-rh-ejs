const db = require('../config/db');

// Récupérer toutes les évaluations (admin/manager)
exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT e.*, emp.nom AS employe_nom, emp.prenom AS employe_prenom, u.username AS evaluateur_username
    FROM evaluations e
    JOIN employes emp ON e.employe_id = emp.id
    LEFT JOIN utilisateurs u ON e.evaluateur_id = u.id
    ORDER BY e.date DESC
  `);
  return rows;
};

// Récupérer les évaluations d’un employé (profil employé)
exports.getByEmployeId = async (employeId) => {
  const [rows] = await db.query(`
    SELECT e.*, u.username AS evaluateur_username
    FROM evaluations e
    LEFT JOIN utilisateurs u ON e.evaluateur_id = u.id
    WHERE e.employe_id = ?
    ORDER BY e.date DESC
  `, [employeId]);
  return rows;
};

// Récupérer une seule évaluation
exports.getById = async (id) => {
  const [rows] = await db.query(`SELECT * FROM evaluations WHERE id = ?`, [id]);
  return rows[0];
};

// Ajouter une évaluation
exports.create = async (data) => {
  const [result] = await db.query(`
    INSERT INTO evaluations (employe_id, date, note, commentaire, evaluateur_id)
    VALUES (?, ?, ?, ?, ?)
  `, [data.employe_id, data.date, data.note, data.commentaire, data.evaluateur_id]);
  return result.insertId;
};

// Mettre à jour
exports.update = async (id, data) => {
  const [result] = await db.query(`
    UPDATE evaluations SET employe_id = ?, date = ?, note = ?, commentaire = ?, evaluateur_id = ?
    WHERE id = ?
  `, [data.employe_id, data.date, data.note, data.commentaire, data.evaluateur_id, id]);
  return result;
};

// Supprimer
exports.delete = async (id) => {
  const [result] = await db.query(`DELETE FROM evaluations WHERE id = ?`, [id]);
  return result;
};
