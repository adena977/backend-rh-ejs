// 📁 routes/formationRoutes.js
const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);

// Liste des formations
router.get('/', requireRole('admin', 'manager'), formationController.index);

// Ajout
router.get('/ajouter', requireRole('admin'), formationController.showAddForm);
router.post('/ajouter', requireRole('admin'), formationController.store);

// Modifier
router.get('/modifier/:id', requireRole('admin'), formationController.showEditForm);
router.post('/modifier/:id', requireRole('admin'), formationController.update);

// Supprimer
router.post('/supprimer/:id', requireRole('admin'), formationController.destroy);

// Inscriptions des employés
router.get('/:id/inscriptions', requireRole('admin', 'manager'), formationController.showInscriptions);
router.post('/:id/inscriptions', requireRole('admin', 'manager'), formationController.addInscription);
router.post('/:id/desinscrire/:employeId', requireRole('admin'), formationController.removeInscription);
router.post('/:id/modifier-statut', requireRole('admin', 'manager'), formationController.updateInscriptionStatut);

module.exports = router;


