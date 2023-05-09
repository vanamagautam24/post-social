const express = require('express');
const notificationsController = require('../controllers/notificationsController');
const router = express.Router();

router.post('/', notificationsController.createNotification);
router.get('/', notificationsController.getNotifications);
router.get('/:id', notificationsController.getNotificationById);
router.put('/:id', notificationsController.updateNotification);
router.delete('/:id', notificationsController.deleteNotification);
router.delete('/', notificationsController.deleteAllNotifications);
router.get('/user/:id', notificationsController.getUserNotifications);

module.exports = router;
