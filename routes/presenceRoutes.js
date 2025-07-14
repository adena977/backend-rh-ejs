// routes/presenceRoutes.js
const express = require('express');
const router  = express.Router();
const presenceController = require('../controllers/presenceController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

// Toutes les routes nécessitent d'être connecté
router.use(isAuthenticated);

/** Liste des présences – visible admin et manager */
router.get('/', requireRole('admin', 'manager'), presenceController.index);

/** Ajout */
router.get('/ajouter', requireRole('admin', 'manager'), presenceController.showAddForm);
router.post('/', requireRole('admin', 'manager'), presenceController.store);

/** Modification */
router.get('/modifier/:id', requireRole('admin', 'manager'), presenceController.showEditForm);
router.post('/modifier/:id', requireRole('admin', 'manager'), presenceController.update);

/** Suppression */
router.post('/supprimer/:id', requireRole('admin'), presenceController.destroy);

// Scan de présence (accessible à tous les utilisateurs connectés)
router.get('/scan', presenceController.showScanForm);
router.post('/scan', presenceController.processScan);


module.exports = router;
