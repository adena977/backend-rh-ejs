const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);

// Liste
router.get('/', requireRole('admin', 'manager'), serviceController.index);

// Ajouter
router.get('/ajouter', requireRole('admin'), serviceController.showAddForm);
router.post('/ajouter', requireRole('admin'), serviceController.store);

// Modifier
router.get('/modifier/:id', requireRole('admin'), serviceController.showEditForm);
router.post('/modifier/:id', requireRole('admin'), serviceController.update);

// Supprimer
router.post('/supprimer/:id', requireRole('admin'), serviceController.destroy);

module.exports = router;
