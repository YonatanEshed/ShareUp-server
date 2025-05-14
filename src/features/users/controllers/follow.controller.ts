import { Request, Response } from 'express';
import UserService from '../services/user.service';
import followService from '../services/follow.service';
import notificationService from '../../../features/notifications/services/notification.service';
import userService from '../services/user.service';
import { activityType } from '../../../features/notifications/models/activity.model';

export const follow = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        if (!req.user) throw Error('An unexpected error accrued');

        const followed = await userService.getUserById(userId);

        if (!followed)
            return res.status(404).json({
                data: null,
                message: 'No such user with id: ' + userId,
            });

        if (req.user.id === userId)
            return res
                .status(403)
                .json({ data: null, message: 'You cannot follow yourself.' });

        const isAlreadyFollowing = await followService.isFollow(
            req.user.id,
            userId
        );
        if (isAlreadyFollowing)
            return res.status(400).json({
                data: null,
                message: 'You are already following this user.',
            });

        const follow = await followService.createFollow(req.user.id, userId);
        if (!follow) throw Error('Could not perform follow');

        notificationService.sendNotification(
            req.user,
            followed,
            activityType.follow,
            `${req.user.username} started following you`
        );

        return res
            .status(201)
            .json({ data: null, message: 'Successfully followed the user.' });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const unfollow = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        if (!req.user) throw Error('An unexpected error accrued');

        if (req.user.id === userId)
            return res
                .status(403)
                .json({ data: null, message: 'You cannot unfollow yourself.' });

        const isFollowing = await followService.isFollow(req.user.id, userId);
        if (!isFollowing)
            return res.status(400).json({
                data: null,
                message: 'You are not following this user.',
            });

        const unfollow = await followService.deleteFollow(req.user.id, userId);
        if (!unfollow) throw Error('Could not perform unfollow');

        return res
            .status(200)
            .json({ data: null, message: 'Successfully unfollowed the user.' });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const getFollowing = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const followingIds = await followService.getFollowing(userId);
        const followingProfiles = await Promise.all(
            followingIds.map(async (id) => {
                const user = await UserService.getUserById(id);
                return user ? UserService.getUserProfile(user) : null;
            })
        );

        return res.status(200).json({
            data: followingProfiles.filter((profile) => profile !== null),
            message: 'User following retrieved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const getFollowers = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const followerIds = await followService.getFollowers(userId);
        const followerProfiles = await Promise.all(
            followerIds.map(async (id) => {
                const user = await UserService.getUserById(id);
                return user ? UserService.getUserProfile(user) : null;
            })
        );

        return res.status(200).json({
            data: followerProfiles.filter((profile) => profile !== null),
            message: 'User followers retrieved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
