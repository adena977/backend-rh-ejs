// routes/utilisateurRoutes.js
const express = require('express');
const router  = express.Router();
const utilisateurController = require('../controllers/utilisateurController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

// Toutes les routes ⇒ authentifiées
router.use(isAuthenticated);

// Liste (admin + manager)
router.get('/',          requireRole('admin', 'manager'), utilisateurController.index);

// Ajout
router.get('/ajouter',   requireRole('admin'),            utilisateurController.showAddForm);
router.post('/ajouter',  requireRole('admin'),            utilisateurController.store);

// Modification
router.get('/modifier/:id',  requireRole('admin'),            utilisateurController.showEditForm);
router.post('/modifier/:id', requireRole('admin'),            utilisateurController.update);

// Suppression
router.post('/supprimer/:id', requireRole('admin'),           utilisateurController.destroy);

module.exports = router;
