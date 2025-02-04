import { Router } from 'express';
import { upload } from '@/config/multer';

import {
    uploadPost,
    getPost,
    updatePost,
    deletePost,
    getPostsByUser,
} from '../controllers/post.controller';

const router = Router();

router.post('/', upload.single('file'), uploadPost);

router.get('/:postId', getPost);
router.patch('/:postId', updatePost);
router.delete('/:postId', deletePost);

router.get('/user/:userId', getPostsByUser);

export default router;
