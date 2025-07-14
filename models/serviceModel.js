const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM services ORDER BY nom ASC');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query('INSERT INTO services (nom, description) VALUES (?, ?)', [
    data.nom,
    data.description,
  ]);
  return result;
};

exports.update = async (id, data) => {
  const [result] = await db.query('UPDATE services SET nom = ?, description = ? WHERE id = ?', [
    data.nom,
    data.description,
    id,
  ]);
  return result;
};

exports.delete = async (id) => {
  const [result] = await db.query('DELETE FROM services WHERE id = ?', [id]);
  return result;
};
