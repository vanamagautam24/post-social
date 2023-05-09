const express = require('express');
const postImagesController = require('../controllers/postImagesController');
const router = express.Router();

router.post('/', postImagesController.createPostImage);
router.get('/', postImagesController.getPostImages);
router.get('/:id', postImagesController.getPostImageById);
router.delete('/:id', postImagesController.deletePostImage);
router.delete('/', postImagesController.deleteAllPostImages);

module.exports = router;
