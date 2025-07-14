const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
// 🔧 Crée le dossier pour les documents s'il n'existe pas
const fs = require('fs');
const notificationMiddleware = require('./middlewares/notifications');


// Import des routes
const dashboardRoutes = require('./routes/dashboardRoutes');
const employeRoutes = require('./routes/employeRoutes');
const authRoutes = require('./routes/authRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const paieRoutes = require('./routes/paieRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const documentRoutes = require('./routes/documentRoutes');
const congeRoutes = require('./routes/congeRoutes');
const absenceExceptionnelleRoutes = require('./routes/absenceExceptionnelleRoutes');
const formationRoutes = require('./routes/formationRoutes');
const logRoutes = require('./routes/logRoutes');
const mouvementRoutes = require('./routes/mouvementRoutes');


dotenv.config();
const uploadPath = path.join(__dirname, 'public', 'uploads', 'documents');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log('✅ Dossier "public/uploads/documents" créé automatiquement');
}


const app = express();

// Middleware pour parser les données POST (formulaires et JSON)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Dossier pour servir les fichiers uploadés (ex : photos, CV...)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Dossier pour servir les fichiers statiques (CSS, JS, images publiques)
app.use(express.static(path.join(__dirname, 'public')));

// Configuration session pour flash messages & auth
app.use(session({
  secret: process.env.SESSION_SECRET || 'monsecret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Middleware pour rendre l'utilisateur connecté accessible dans toutes les vues
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.page = null; // valeur par défaut pour éviter "page is not defined"
  res.locals.title = '';
  next();
});



// Middleware méthode override pour PUT et DELETE via query param _method
app.use(methodOverride('_method'));

// Configuration moteur de vues EJS + Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'layout'); // fichier views/layout.ejs par défaut

// Route d'accueil simple : redirige vers dashboard si connecté, sinon vers login
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});
app.use(notificationMiddleware);
// Routes principales
app.use('/dashboard', dashboardRoutes);
app.use('/employes', employeRoutes);
app.use('/', authRoutes);
app.use('/presences', presenceRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/fiche_paie', paieRoutes);
app.use('/evaluations', evaluationRoutes);
app.use('/services', serviceRoutes);
app.use('/documents', documentRoutes);
app.use('/conges', congeRoutes);
app.use('/absences', absenceExceptionnelleRoutes);
app.use('/formations', formationRoutes);
app.use('/logs', logRoutes);
app.use('/mouvements_rh', mouvementRoutes);



// Catch-all pour les routes non trouvées
app.use((req, res, next) => {
  res.status(404).render('error', {
    message: 'Page non trouvée',
    error: null
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur attrapée par le middleware :', err);

  res.status(500).render('error', {
    message: 'Erreur serveur',
    error: err
  });
});

module.exports = app;
