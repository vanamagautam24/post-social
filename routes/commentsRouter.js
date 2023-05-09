const express = require('express');
const commentsController = require('../controllers/commentsController');
const router = express.Router();

router.post('/', commentsController.createComment);
router.get('/', commentsController.getComments);
router.get('/:id', commentsController.getCommentById);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);
router.delete('/', commentsController.deleteAllComments);

module.exports = router;
