const express = require('express');
const loginController = require('../controllers/loginController');
const router = express.Router();

router.post('/', loginController.login);
router.post('/register', loginController.register);

module.exports = router;
