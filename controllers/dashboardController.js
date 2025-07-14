const db = require('../config/db');
const Employe = require('../models/employeModel');

exports.index = async (req, res, next) => {
  try {
    // Données pour le graphique (nombre d'employés par service)
    const result = await Employe.countByService();
    const chartLabels = result.map(r => r.nom);
    const chartData = result.map(r => r.total);
    // Exemple simple, tu peux récupérer ça depuis ta base de données
    const annonces = [
      { id: 1, titre: "Réunion RH ce vendredi", description: "Salle de conférence à 10h.", date: "2025-07-18" },
      { id: 2, titre: "Campagne de vaccination", description: "Vaccins disponibles au centre médical.", date: "2025-07-20" },
      { id: 3, titre: "Congés d'été", description: "Pensez à valider vos congés avant fin juillet.", date: "2025-07-22" },
    ];


    // Statistiques globales
    const [[{ total: totalEmployes }]] = await db.query('SELECT COUNT(*) as total FROM employes');
    const [[{ total: totalUtilisateurs }]] = await db.query('SELECT COUNT(*) as total FROM utilisateurs');
    const [[{ total: nouveauxUtilisateurs }]] = await db.query(`
      SELECT COUNT(*) as total 
      FROM utilisateurs 
      WHERE MONTH(created_at) = MONTH(NOW()) AND YEAR(created_at) = YEAR(NOW())
    `);
    const [[{ total: pendingLeaves }]] = await db.query("SELECT COUNT(*) AS total FROM conges WHERE statut = 'En attente'");
    const [[{ total: acceptedLeaves }]] = await db.query("SELECT COUNT(*) AS total FROM conges WHERE statut = 'Validé'");
    const [logs] = await db.query(`
  SELECT action, date_action FROM logs ORDER BY date_action DESC LIMIT 6
`);
    const [rows] = await db.query(`
    SELECT e.id, e.nom, e.prenom, e.email, e.date_embauche, e.photo, s.nom AS service, e.poste 
    FROM employes e 
    LEFT JOIN services s ON s.id = e.service_id 
    ORDER BY e.date_embauche DESC LIMIT 5
  `);

    // Rendu de la page
    res.render('dashboard', {
      title: 'Tableau de bord RH',
      page: 'dashboard',
      chartLabels,
      chartData,
      totalEmployes,
      totalUtilisateurs,
      nouveauxUtilisateurs,
      pendingLeaves,
      acceptedLeaves,
      annonces, logs, derniersEmployes: rows
    });
  } catch (err) {
    next(err);
  }
};
exports.dashboardEmploye = async (req, res, next) => {
  try {
    const employeId = req.session.user.employe_id; // si tu stockes l'ID dans la session

    // Récupération des infos de l'employé connecté
    const [employeRows] = await db.query(`
      SELECT e.nom, e.prenom, e.photo, s.nom AS service, e.poste, e.date_embauche
      FROM employes e
      LEFT JOIN services s ON s.id = e.service_id
      WHERE e.id = ?
    `, [employeId]);

    const employe = employeRows[0];

    // Récupération de ses congés
    const [conges] = await db.query(`
      SELECT type, date_debut, date_fin, statut
      FROM conges
      WHERE employe_id = ?
      ORDER BY date_debut DESC
      LIMIT 5
    `, [employeId]);

    // Annonces générales
    const annonces = [
      { id: 1, titre: "Réunion RH vendredi", description: "10h, salle conférence", date: "2025-07-18" },
      { id: 2, titre: "Campagne de vaccination", description: "Disponible au centre médical", date: "2025-07-20" },
    ];

    res.render('dashboard-employe', {
      title: 'Mon espace RH',
      page: 'dashboard',
      employe,
      conges,
      annonces
    });
  } catch (err) {
    next(err);
  }
};
