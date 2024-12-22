const express = require('express');
const userController = require('../controllers/userController')

const router = express.Router();

router.post('/users', userController.createUser)
router.get('/users', userController.getAllUsers)
router.get('/users/:id', userController.getUserById)

module.exports = router;