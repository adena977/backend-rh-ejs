const express = require('express');
const router = express.Router();
const fichePaieController = require('../controllers/fichePaieController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);

// Liste
router.get('/', requireRole('admin', 'manager'), fichePaieController.index);

// Ajout
router.get('/ajouter', requireRole('admin'), fichePaieController.showAddForm);
router.post('/ajouter', requireRole('admin'), fichePaieController.store);

// Modification
router.get('/modifier/:id', requireRole('admin'), fichePaieController.showEditForm);
router.post('/modifier/:id', requireRole('admin'), fichePaieController.update);

// Suppression
router.post('/supprimer/:id', requireRole('admin'), fichePaieController.destroy);

// Pour les employés : voir leurs fiches
router.get('/mes-fiches', requireRole('employe'), fichePaieController.mesFiches);


module.exports = router;
