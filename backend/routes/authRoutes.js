const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');

router.get('/check-auth', verifyToken, authController.checkAuth)

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

router.post('/verify-email', authController.verifyOTP)

router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)

module.exports = router;