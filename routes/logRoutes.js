const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { isAuthenticated } = require('../middlewares/auth');
const requireRole = require('../middlewares/role');

router.use(isAuthenticated);
router.get('/', requireRole('admin', 'manager'), logController.index);

module.exports = router;
