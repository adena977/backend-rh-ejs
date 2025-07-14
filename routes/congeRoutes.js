// 📁 routes/congeRoutes.js
const express = require('express');
const router = express.Router();
const congeController = require('../controllers/congeController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);

// Liste pour admin/manager
router.get('/', requireRole('admin', 'manager'), congeController.index);

// Ajouter un congé (admin uniquement)
router.get('/ajouter', requireRole('admin'), congeController.showAddForm);
router.post('/ajouter', requireRole('admin'), congeController.store);

// Modifier un congé (admin uniquement)
router.get('/modifier/:id', requireRole('admin'), congeController.showEditForm);
router.post('/modifier/:id', requireRole('admin'), congeController.update);

// Supprimer un congé (admin uniquement)
router.post('/supprimer/:id', requireRole('admin'), congeController.destroy);

// Mes congés (pour les employés connectés)
router.get('/mes-conges', requireRole('employe'), congeController.myLeaves);
// routes/congeRoutes.js (ajoute ceci)
router.get('/demande', requireRole('employe'), congeController.showRequestForm);
router.post('/demande', requireRole('employe'), congeController.submitRequest);


module.exports = router;
