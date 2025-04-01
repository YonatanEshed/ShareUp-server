import { Router } from 'express';
import { upload } from '../../../config/multer';

import { getProfile, updateProfile } from '../controllers/profile.controller';
import {
    follow,
    unfollow,
    getFollowing,
    getFollowers,
} from '../controllers/follow.controller';
import { validateUserId } from '../middlewares/user.middleware';

const router = Router();

// based on req.user
router.put('/', upload.single('file'), updateProfile); // update profile

router.get('/:userId', validateUserId, getProfile); // get user's profile

// follow routes
router.post('/:userId/follow', follow); // follow userId
router.delete('/:userId/follow', unfollow); // unfollow userId
router.get('/:userId/following', getFollowing); // get list of userId's followings
router.get('/:userId/followers', getFollowers); // get list of userId's followers

export default router;
