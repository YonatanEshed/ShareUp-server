import { Router } from 'express';

import { getUserActivities } from '../controllers/activity.controller';
import { setFcmToken, clearFcmToken } from '../controllers/fcmToken.controller';

const router = Router();

router.get('/:userId/activity', getUserActivities);

// fcm token
router.post('/fcmToken', setFcmToken);
router.delete('/fcmToken', clearFcmToken);

export default router;
