import { Router } from 'express';
import { upload } from '../../../config/multer';

import {
    getOwnProfile,
    getProfile,
    updateProfile,
} from '../controllers/profile.controller';
import {
    follow,
    unfollow,
    getFollowing,
    getFollowers,
    getUserFollowing,
    getUserFollowers,
} from '../controllers/follow.controller';
import { validateUserId } from '../middlewares/user.middleware';

const router = Router();

// based on req.user
router.put('/', upload.single('file'), updateProfile); // update profile
router.put('/profilePicture'); // update profile picture
router.get('/', getOwnProfile); // get own user profile

router.get('/:userId', validateUserId, getProfile); // get user's profile

// follow routes
router.get('/following', getFollowing); // get list of own followings
router.get('/followers', getFollowers); // get list of own followers
router.post('/:userId/follow', follow); // follow userId
router.delete('/:userId/follow', unfollow); // unfollow userId
router.get('/:userId/following', getUserFollowing); // get list of userId's followings
router.get('/:userId/followers', getUserFollowers); // get list of userId's followers

export default router;
