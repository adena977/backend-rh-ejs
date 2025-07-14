const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT fp.*, e.nom, e.prenom
    FROM fiche_paie fp
    JOIN employes e ON fp.employe_id = e.id
    ORDER BY fp.annee DESC, fp.mois DESC
  `);
  return rows.map(row => ({
    ...row,
    salaire_brut: parseFloat(row.salaire_brut),
    heures_sup: parseFloat(row.heures_sup),
    prime: parseFloat(row.prime),
    retenue: parseFloat(row.retenue),
    salaire_net: parseFloat(row.salaire_net)
  }));
};

exports.getById = async (id) => {
  const [rows] = await db.query(`
    SELECT * FROM fiche_paie WHERE id = ?
  `, [id]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.query(`
    INSERT INTO fiche_paie (employe_id, mois, annee, salaire_brut, heures_sup, prime, retenue, salaire_net)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    data.employe_id,
    data.mois,
    data.annee,
    data.salaire_brut,
    data.heures_sup,
    data.prime,
    data.retenue,
    data.salaire_net
  ]);
  return result;
};


exports.update = async (id, data) => {
  await db.query(`
    UPDATE fiche_paie SET
      employe_id = ?, mois = ?, annee = ?, salaire_brut = ?, heures_sup = ?, prime = ?, retenue = ?, salaire_net = ?
    WHERE id = ?
  `, [
    data.employe_id, data.mois, data.annee, data.salaire_brut,
    data.heures_sup, data.prime, data.retenue, data.salaire_net,
    id
  ]);
};

exports.updatePdfUrl = async (id, pdf_url) => {
  await db.query('UPDATE fiche_paie SET pdf_url = ? WHERE id = ?', [pdf_url, id]);
};

exports.delete = async (id) => {
  await db.query('DELETE FROM fiche_paie WHERE id = ?', [id]);
};

exports.getByEmployeId = async (employeId) => {
  const [rows] = await db.query(`
    SELECT fp.*, e.nom, e.prenom
    FROM fiche_paie fp
    JOIN employes e ON fp.employe_id = e.id
    WHERE fp.employe_id = ?
    ORDER BY fp.annee DESC, fp.mois DESC
  `, [employeId]);
 
  return rows.map(row => ({
  ...row,
  salaire_brut: parseFloat(row.salaire_brut),
  heures_sup: parseFloat(row.heures_sup),
  prime: parseFloat(row.prime),
  retenue: parseFloat(row.retenue),
  salaire_net: parseFloat(row.salaire_net)
}));

};
