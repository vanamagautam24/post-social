const express = require('express');
const likesController = require('../controllers/likesController');
const router = express.Router();

router.post('/', likesController.createLike);
router.get('/', likesController.getLikes);
router.get('/:id', likesController.getLikeById);
router.delete('/:id', likesController.deleteLike);
router.delete('/:post_id/:user_id', likesController.removeLike);
router.delete('/', likesController.deleteAllLikes);

module.exports = router;
