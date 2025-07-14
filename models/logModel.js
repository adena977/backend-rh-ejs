const db = require('../config/db');

exports.create = async (data) => {
  const sql = `INSERT INTO logs (utilisateur_id, action, table_modifiee, id_element) VALUES (?, ?, ?, ?)`;
  const values = [data.utilisateur_id, data.action, data.table_modifiee, data.id_element];
  await db.query(sql, values);
};

exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT l.*, u.username AS utilisateur_nom
    FROM logs l
    LEFT JOIN utilisateurs u ON l.utilisateur_id = u.id
    ORDER BY l.date_action DESC
  `);
  return rows;
};
