const express = require('express');
const router = express.Router();
const {
    isAuthenticated,
    onlyAdmin,
    onlyEmploye
} = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardController');

// Dashboard RH pour les administrateurs
router.get('/', isAuthenticated, onlyAdmin, dashboardController.index);

// Dashboard RH simplifié pour les employés
router.get('/employe', isAuthenticated, onlyEmploye, dashboardController.dashboardEmploye);

module.exports = router;
