import { Router } from 'express';
import multer from 'multer';

import {
    uploadPost,
    getPost,
    updatePost,
    deletePost,
    getPostsByUser,
} from '../controllers/post.controller';

const router = Router();
const upload = multer({ dest: 'tmp/' }); // Temporary storage for uploaded files

router.post('/', upload.single('file'), uploadPost);

router.get('/:postId', getPost);
router.patch('/:postId', updatePost);
router.delete('/:postId', deletePost);

router.get('/user/:userId', getPostsByUser);

export default router;
