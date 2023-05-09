const express = require('express');
const postTagsController = require('../controllers/postTagsController');
const router = express.Router();

router.post('/', postTagsController.createPostTag);
router.get('/', postTagsController.getPostTags);
router.get('/:id', postTagsController.getPostTagById);
router.delete('/:id', postTagsController.deletePostTag);
router.delete('/', postTagsController.deleteAllPostTags);

module.exports = router;
