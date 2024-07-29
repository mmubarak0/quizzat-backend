const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller')
const { newUserValidation, userValidation } = require('../middlewares/validation');

// Auth routes
router.post('/register', newUserValidation, authController.register);
router.post('/login', userValidation, authController.login);
// router.post('/refresh', authController.refresh);
// router.post('/logout', authController.logout);

module.exports = router;
