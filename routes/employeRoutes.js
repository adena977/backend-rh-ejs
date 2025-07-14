const express = require('express');
const router = express.Router();
const employeController = require('../controllers/employeController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');
const upload = require('../middlewares/multerConfig');

// Toutes les routes ici sont protégées
router.use(isAuthenticated);

// Accessible uniquement aux admin et managers
router.get('/', requireRole('admin', 'manager'), employeController.index);
router.get('/ajouter', requireRole('admin'), employeController.showAddForm);

router.post(
  '/ajouter',
  requireRole('admin'),
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'contrat', maxCount: 1 }
  ]),
  employeController.store
);

router.get('/modifier/:id', requireRole('admin'), employeController.showEditForm);
router.post(
  '/modifier/:id',
  requireRole('admin'),
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'contrat', maxCount: 1 }
  ]),
  employeController.update
);
router.post('/supprimer/:id', requireRole('admin'), employeController.destroy);

router.get('/detaille/:id', requireRole('admin', 'manager'), employeController.showDetails);


// Affiche le profil de l'employé connecté
router.get('/profil', requireRole('employe'), employeController.showOwnProfile);

// Mise à jour du profil (ex : téléphone, photo)
router.post(
  '/profil',
  requireRole('employe'),
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  employeController.updateOwnProfile
);

router.get('/export/csv', requireRole('admin', 'manager'), employeController.exportCSV);


module.exports = router;
