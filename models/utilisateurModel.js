// models/utilisateurModel.js
const db     = require('../config/db');
const bcrypt = require('bcryptjs');

/* ────────────────────────────────────── *
 *      Méthodes utilitaires internes     *
 * ────────────────────────────────────── */

// hachage du mot de passe
async function hashPassword(plainPwd) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPwd, salt);
}

/* ────────────────────────────────────── *
 *            Méthodes exportées          *
 * ────────────────────────────────────── */

// Liste complète
exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT u.*, e.nom, e.prenom, e.code_employe
    FROM utilisateurs u
    LEFT JOIN employes e ON e.id = u.employe_id
    ORDER BY u.id DESC`);
  return rows;
};

// Détails par ID
exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM utilisateurs WHERE id = ?', [id]);
  return rows[0];
};

// Chercher par username
exports.findByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM utilisateurs WHERE username = ?', [username]);
  return rows[0];
};

// Création
exports.create = async (data) => {
  const hashed = await hashPassword(data.mot_de_passe);

  const sql = `
    INSERT INTO utilisateurs
      (username, mot_de_passe, role, employe_id)
    VALUES (?,?,?,?)`;

  const vals = [data.username, hashed, data.role, data.employe_id || null];
  const [result] = await db.query(sql, vals);
  return result;
};

// Mise à jour (avec mot de passe optionnel)
exports.update = async (id, data) => {
  let sql   = 'UPDATE utilisateurs SET username = ?, role = ?, employe_id = ?';
  const arr = [data.username, data.role, data.employe_id || null];

  if (data.mot_de_passe) {
    const hashed = await hashPassword(data.mot_de_passe);
    sql += ', mot_de_passe = ?';
    arr.push(hashed);
  }
  sql += ' WHERE id = ?';
  arr.push(id);

  const [result] = await db.query(sql, arr);
  return result;
};

// Suppression
exports.delete = async (id) => {
  const [res] = await db.query('DELETE FROM utilisateurs WHERE id = ?', [id]);
  return res;
};
exports.updateProfile = async (id, data) => {
  const sql = `UPDATE utilisateurs SET telephone = ?, photo = ? WHERE id = ?`;
  const values = [data.telephone, data.photo, id];
  const [result] = await db.query(sql, values);
  return result;
};

exports.getEvaluateurs = async () => {
  const [rows] = await db.query(
    `SELECT id, username, role FROM utilisateurs WHERE role IN ('admin', 'manager')`
  );
  return rows;
};
