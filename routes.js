const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const { authAdminMiddleware, authMiddleware } = require('./middleware/authMiddleware');
const { showDevices, createDevice, updatedDevice, findById, deleteDevice, scanQrCode, getQrCode } = require('./controllers/deviceController');
const { sendMessage, sendMessageMedia } = require('./controllers/messageController');

router.post('/api/login', userController.loginUser);

router.post('/api/user', authAdminMiddleware, userController.createUser);
router.get('/api/user', authAdminMiddleware, userController.getAllUsers);
router.put('/api/user/:id', authAdminMiddleware, userController.updateUser);
router.get('/api/user/:id', authAdminMiddleware, userController.getUserById);
router.delete('/api/user/:id', authAdminMiddleware, userController.deleteUser);


router.get('/api/device', authMiddleware, showDevices);
router.post('/api/device', authMiddleware, createDevice);
router.put('/api/device/:id', authMiddleware, updatedDevice);
router.get('/api/device/:id', authMiddleware, findById);
router.delete('/api/device/:id', authMiddleware, deleteDevice);
router.post('/api/qr/:id', authMiddleware, scanQrCode);
router.get('/api/qr/:id', authMiddleware, getQrCode);

router.post('/api/message/:id', authMiddleware, sendMessage)
router.post('/api/media/:id', authMiddleware, sendMessageMedia)


module.exports = router;
