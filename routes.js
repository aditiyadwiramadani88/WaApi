const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

router.post('/api/user', userController.createUser);
router.get('/api/user', userController.getAllUsers);
router.put('/api/user/:id', userController.updateUser);
router.get('/api/user/:id', userController.getUserById);
router.delete('/api/user/:id', userController.deleteUser);
router.post('/api/login', userController.loginUser);

module.exports = router;
