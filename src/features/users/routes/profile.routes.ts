import { Router } from 'express';
import {
    getOwnProfile,
    getProfile,
    updateProfile,
} from '../controllers/profile.controller';
import { validateUserId } from '../middlewares/user.middleware';

const router = Router();

// based on req.user
router.put('/', updateProfile); // update profile
router.put('/profilePicture'); // update profile picture
router.get('/', getOwnProfile); // get own user profile

router.get('/:userId', validateUserId, getProfile); // get user's profile

router.post('/:userId/follow'); // follow userId
router.delete('/:userId/follow'); // unfollow userId
router.get('/:userId/followers'); // get list of userId's followers
router.get('/:userId/followings'); // get list of userId's followers

export default router;
