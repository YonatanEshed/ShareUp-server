import { Router } from 'express';
import { upload } from '../../../config/multer';

import {
    uploadPost,
    getPost,
    updatePost,
    deletePost,
    getPostsByUser,
} from '../controllers/post.controller';
import {
    likePost,
    unlikePost,
    getLikesByPostId,
} from '../controllers/like.controller';
import {
    addComment,
    deleteComment,
    getCommentsByPost,
} from '../controllers/comment.controller';
import {
    getLatestPosts,
    getLatestPostsFromFollowing,
} from '../controllers/feed.controller';

const router = Router();

router.post('/', upload.single('file'), uploadPost);

router.get('/feed', getLatestPosts);
router.get('/feed/following', getLatestPostsFromFollowing);

router.get('/:postId', getPost);
router.patch('/:postId', updatePost);
router.delete('/:postId', deletePost);

router.get('/user/:userId', getPostsByUser);

router.post('/:postId/like', likePost);
router.delete('/:postId/like', unlikePost);
router.get('/:postId/likes', getLikesByPostId);

router.post('/:postId/comment', addComment);
router.delete('/:postId/comment/:commentId', deleteComment);
router.get('/:postId/comments', getCommentsByPost);

export default router;
