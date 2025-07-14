const db = require('../config/db');

// Obtenir tous les employés
exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT e.*, s.nom AS service 
    FROM employes e
    LEFT JOIN services s ON e.service_id = s.id
  `);
  return rows;
};
exports.getDetailsById = async (id) => {
  const [rows] = await db.query(`
    SELECT e.*, s.nom AS service 
    FROM employes e 
    LEFT JOIN services s ON e.service_id = s.id
    WHERE e.id = ?
  `, [id]);

  return rows[0]; // retourne l'objet employé
};



// Génère un code du type EMP001, EMP002, etc.
async function genererCodeEmploye() {
  const [rows] = await db.query(`SELECT COUNT(*) AS count FROM employes`);
  const count = rows[0].count + 1;
  const code = `EMP${String(count).padStart(3, '0')}`;
  return code;
}
exports.create = async (data) => {
  const code_employe = await genererCodeEmploye();

  const sql = `
    INSERT INTO employes 
    (code_employe, nom, prenom, email, telephone, poste, service_id, date_embauche, salaire_base, photo, cv, contrat, statut)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    code_employe,
    data.nom, data.prenom, data.email, data.telephone, data.poste, data.service_id,
    data.date_embauche, data.salaire_base, data.photo, data.cv, data.contrat, data.statut
  ];

  const [result] = await db.query(sql, values);
  return result.insertId; // ✅ très important pour les logs
};



// Trouver un employé par ID


exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM employes WHERE id = ?', [id]);
  return rows[0]; // ⬅️ on retourne bien l'objet employé
};


exports.getById1 = async (id) => {
  const [rows] = await db.query(
    'SELECT id, nom, prenom, salaire_base FROM employes WHERE id = ?',
    [id]
  );
  return rows[0];
};

// Mettre à jour un employé
exports.update = async (id, data) => {
  const sql = `UPDATE employes SET 
    nom = ?, prenom = ?, email = ?, telephone = ?, poste = ?, 
    service_id = ?, date_embauche = ?, salaire_base = ?, 
    photo = ?, cv = ?, contrat = ?, statut = ?
    WHERE id = ?`;
  const values = [
    data.nom, data.prenom, data.email, data.telephone, data.poste, data.service_id,
    data.date_embauche, data.salaire_base, data.photo, data.cv, data.contrat, data.statut, id
  ];
  const [result] = await db.query(sql, values);
  return result;
};

// Supprimer un employé
exports.delete = async (id) => {
  const [result] = await db.query('DELETE FROM employes WHERE id = ?', [id]);
  return result;
};

// Récupérer l'employé lié à l'utilisateur (via utilisateur.employe_id)
exports.getByUserId = async (userId) => {
  const sql = `
    SELECT e.*, s.nom AS service 
    FROM employes e
    LEFT JOIN services s ON e.service_id = s.id
    JOIN utilisateurs u ON u.employe_id = e.id
    WHERE u.id = ?`;
  const [rows] = await db.query(sql, [userId]);
  return rows[0];
};

// Liste paginée avec recherche
exports.getPaginatedList = async (search, limit, offset) => {
  const sql = `
    SELECT e.*, s.nom AS service
    FROM employes e
    LEFT JOIN services s ON e.service_id = s.id
    WHERE e.nom LIKE ? OR e.prenom LIKE ? OR e.email LIKE ?
    ORDER BY e.nom ASC
    LIMIT ? OFFSET ?
  `;
  const values = [`%${search}%`, `%${search}%`, `%${search}%`, limit, offset];
  const [rows] = await db.query(sql, values);
  return rows;
};

// Nombre total d'employés (avec ou sans filtre)
exports.count = async (search) => {
  const sql = `
    SELECT COUNT(*) AS total
    FROM employes
    WHERE nom LIKE ? OR prenom LIKE ? OR email LIKE ?
  `;
  const values = [`%${search}%`, `%${search}%`, `%${search}%`];
  const [[{ total }]] = await db.query(sql, values);
  return total;
};
// models/employeModel.js
exports.countByService = async () => {
  const sql = `
    SELECT s.nom AS service, COUNT(e.id) AS total
    FROM services s
    LEFT JOIN employes e ON e.service_id = s.id
    GROUP BY s.id
  `;
  return await db.query(sql);
};
exports.findByCode = async (code_employe) => {
  const [rows] = await db.query('SELECT * FROM employes WHERE code_employe = ?', [code_employe]);
  return rows[0];
};
