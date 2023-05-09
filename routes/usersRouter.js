// routes/usersRouter.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);
router.delete('/', usersController.deleteAllUsers);
router.get('/profile/:username', usersController.getUserProfile);
router.get('/:username/posts', usersController.getFollowedPosts);
router.get('/:username/notifications', usersController.getUserNotifications);
router.get('/:username/messages', usersController.getUserMessages);

module.exports = router;
