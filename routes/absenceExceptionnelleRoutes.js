// 📁 routes/absenceExceptionnelleRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/absenceExceptionnelleController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);

// Liste des absences exceptionnelles (admin/manager)
router.get('/', requireRole('admin', 'manager'), controller.index);

// Ajouter une absence
router.get('/ajouter', requireRole('admin'), controller.showAddForm);
router.post('/ajouter', requireRole('admin'), controller.store);

// Modifier une absence
router.get('/modifier/:id', requireRole('admin'), controller.showEditForm);
router.post('/modifier/:id', requireRole('admin'), controller.update);

// Supprimer une absence
router.post('/supprimer/:id', requireRole('admin'), controller.destroy);

// Mes absences pour un employé
router.get('/mes-absences', requireRole('employe'), controller.myAbsences);

module.exports = router;