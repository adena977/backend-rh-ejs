const express = require('express');
const router = express.Router();
const mouvementController = require('../controllers/mouvementController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);

// Liste
router.get('/', requireRole('admin', 'manager'), mouvementController.index);

// Ajouter
router.get('/ajouter', requireRole('admin'), mouvementController.showAddForm);
router.post('/ajouter', requireRole('admin'), mouvementController.store);

// Modifier
router.get('/modifier/:id', requireRole('admin'), mouvementController.showEditForm);
router.post('/modifier/:id', requireRole('admin'), mouvementController.update);

// Supprimer
router.post('/supprimer/:id', requireRole('admin'), mouvementController.destroy);

module.exports = router;
