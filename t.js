// fichier temporaire createAdmin.js
const bcrypt = require('bcryptjs');
const db = require('./config/db');

(async () => {
  const hash = await bcrypt.hash('1234', 10);
  await db.query(
    `INSERT INTO utilisateurs (username, mot_de_passe, role) VALUES (?, ?, ?)`,
    ['ali1', hash, 'admin']
  );
  console.log('Admin ajouté');
  process.exit();
})();
