const express = require('express');
const followersController = require('../controllers/followersController');
const router = express.Router();

router.post('/', followersController.createFollower);
router.get('/', followersController.getFollowers);
router.get('/:id', followersController.getFollowerById);
router.delete('/:id', followersController.deleteFollower);
router.post('/:follower_id/:followee_id', followersController.followUser);
router.delete('/:follower_id/:followee_id', followersController.unfollowUser);
router.delete('/', followersController.deleteAllFollowers);

module.exports = router;
