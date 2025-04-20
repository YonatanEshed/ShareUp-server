import { Router } from 'express';
import { searchUsers } from '../controllers/search.controller';

const router = Router();

router.get('/', searchUsers);

export default router;
