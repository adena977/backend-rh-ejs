const db = require('../db');

async function testDB() {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('✅ Connexion réussie à MySQL ! Résultat :', rows[0].result);
    process.exit();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error.message);
    process.exit(1);
  }
}

testDB();
