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
                .json({ message: 'You cannot follow yourself.' });

        const isAlreadyFollowing = await followService.isFollow(
            req.user.id,
            userId
        );
        if (isAlreadyFollowing)
            return res
                .status(400)
                .json({ message: 'You are already following this user.' });

        const follow = await followService.createFollow(req.user.id, userId);
        if (!follow) throw Error('Could not perform follow');

        return res
            .status(201)
            .json({ message: 'Successfully followed the user.' });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};

export const unfollow = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        if (!req.user) throw Error('An unexpected error accrued');

        if (req.user.id === userId)
            return res
                .status(403)
                .json({ message: 'You cannot unfollow yourself.' });

        const isFollowing = await followService.isFollow(req.user.id, userId);
        if (!isFollowing)
            return res
                .status(400)
                .json({ message: 'You are not following this user.' });

        const unfollow = await followService.deleteFollow(req.user.id, userId);
        if (!unfollow) throw Error('Could not perform unfollow');

        return res
            .status(200)
            .json({ message: 'Successfully unfollowed the user.' });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getFollowing = async (req: Request, res: Response) => {
    try {
        if (!req.user) throw Error('An unexpected error accrued');

        const followingIds = await followService.getFollowing(req.user.id);
        const followingProfiles = await Promise.all(
            followingIds.map(async (id) => {
                const user = await UserService.getUserById(id);
                return user ? UserService.getUserProfile(user) : null;
            })
        );

        return res.status(200).json({
            following: followingProfiles.filter((profile) => profile !== null),
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getFollowers = async (req: Request, res: Response) => {
    try {
        if (!req.user) throw Error('An unexpected error accrued');

        const followerIds = await followService.getFollowers(req.user.id);
        const followerProfiles = await Promise.all(
            followerIds.map(async (id) => {
                const user = await UserService.getUserById(id);
                return user ? UserService.getUserProfile(user) : null;
            })
        );

        return res.status(200).json({
            followers: followerProfiles.filter((profile) => profile !== null),
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getUserFollowing = async (req: Request, res: Response) => {
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
            following: followingProfiles.filter((profile) => profile !== null),
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getUserFollowers = async (req: Request, res: Response) => {
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
            followers: followerProfiles.filter((profile) => profile !== null),
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};
