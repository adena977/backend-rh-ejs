const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);

// Liste globale (admin & manager)
router.get('/', requireRole('admin', 'manager'), evaluationController.index);

// Ajout
router.get('/ajouter', requireRole('admin', 'manager'), evaluationController.showAddForm);
router.post('/ajouter', requireRole('admin', 'manager'), evaluationController.store);

// Modification
router.get('/modifier/:id', requireRole('admin', 'manager'), evaluationController.showEditForm);
router.post('/modifier/:id', requireRole('admin', 'manager'), evaluationController.update);

// Suppression
router.post('/supprimer/:id', requireRole('admin'), evaluationController.destroy);

// Employé connecté : ses évaluations personnelles
router.get('/mes', requireRole('employe'), evaluationController.myEvaluations);

module.exports = router;
