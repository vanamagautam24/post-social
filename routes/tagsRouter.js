const express = require('express');
const tagsController = require('../controllers/tagsController');
const router = express.Router();

router.post('/', tagsController.createTag);
router.get('/', tagsController.getTags);
router.get('/:id', tagsController.getTagById);
router.delete('/:id', tagsController.deleteTag);
router.delete('/', tagsController.deleteAllTags);

module.exports = router;
