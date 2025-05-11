import { Request, Response } from 'express';
import activityService from '../services/activity.service';

export const getUserActivities = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        if (!req.user) throw Error('An unexpected error accrued');

        if (req.user.id !== userId) {
            return res.status(403).json({
                data: null,
                message:
                    "You are not authorized to access this user's activity.",
            });
        }

        const activities = await activityService.getUserActivities(userId);
        return res.status(200).json({
            data: activities,
            message: 'User activities retrieved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
