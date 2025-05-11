import { getRepository } from 'fireorm';
import Activity, { activityType } from '../models/activity.model';

class ActivityService {
    private activityRepository = getRepository(Activity);

    async logActivity(
        userId: string,
        senderId: string,
        type: activityType,
        message: string
    ): Promise<Activity> {
        const activity = new Activity();
        activity.userId = userId;
        activity.type = type;
        activity.message = message;
        activity.senderId = senderId;

        return this.activityRepository.create(activity);
    }

    async getUserActivities(userId: string): Promise<Activity[]> {
        return this.activityRepository
            .whereEqualTo('userId', userId)
            .orderByDescending('createdAt')
            .find();
    }
}

export default new ActivityService();
