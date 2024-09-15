const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const { authAdminMiddleware, authMiddleware } = require('./middleware/authMiddleware');

router.post('/api/login', userController.loginUser);

router.post('/api/user', authAdminMiddleware, userController.createUser);
router.get('/api/user', authAdminMiddleware, userController.getAllUsers);
router.put('/api/user/:id', authAdminMiddleware, userController.updateUser);
router.get('/api/user/:id', authAdminMiddleware, userController.getUserById);
router.delete('/api/user/:id', authAdminMiddleware, userController.deleteUser);


module.exports = router;
