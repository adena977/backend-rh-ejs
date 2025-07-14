// 📁 routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');
const multer = require('multer');
const path = require('path');

// Configurer le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/documents');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.use(isAuthenticated);

router.get('/', requireRole('admin', 'manager'), documentController.index);
router.get('/ajouter', requireRole('admin'), documentController.showAddForm);
router.post('/ajouter', requireRole('admin'), upload.single('fichier'), documentController.store);
router.get('/modifier/:id', requireRole('admin'), documentController.showEditForm);
router.post('/modifier/:id', requireRole('admin'), upload.single('fichier'), documentController.update);
router.post('/supprimer/:id', requireRole('admin'), documentController.destroy);

module.exports = router;

