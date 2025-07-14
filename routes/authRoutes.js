const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Affiche le formulaire de login
router.get('/login', authController.showLogin);

// Traite le login
router.post('/login', authController.login);

// Déconnecte l'utilisateur
router.get('/logout', authController.logout);

module.exports = router;
