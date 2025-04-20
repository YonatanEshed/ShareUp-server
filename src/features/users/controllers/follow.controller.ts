import { Request, Response } from 'express';
import UserService from '../services/user.service';
import followService from '../services/follow.service';

export const follow = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        if (!req.user) throw Error('An unexpected error accrued');

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
