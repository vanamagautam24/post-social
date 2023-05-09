const express = require('express');
const messagesController = require('../controllers/messagesController');
const router = express.Router();

router.post('/', messagesController.createMessage);
router.get('/', messagesController.getMessages);
router.get('/:id', messagesController.getMessageById);
router.put('/:id', messagesController.updateMessage);
router.delete('/:id', messagesController.deleteMessage);
router.delete('/', messagesController.deleteAllMessages);

module.exports = router;
