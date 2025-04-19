import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';
import MediaService from '../../../shared/services/storage.service';
import followService from '../services/follow.service';

export const getProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        if (!req.user) throw Error('An unexpected error accured');

        const user = await UserService.getUserById(userId);
        if (!user)
            return res.status(404).json({
                data: null,
                message: 'User with the specified ID does not exist.',
            });

        const profile = UserService.getUserProfile(user);

        let isFollowed = false;
        isFollowed = await followService.isFollow(req.user.id, userId);

        return res.status(200).json({
            data: { ...profile, isFollowed },
            message: 'Profile retrieved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { username, bio } = req.body;

    try {
        if (!username && !bio) {
            res.status(400).json({
                data: null,
                message: "Missing required fields: 'username', 'bio'.",
            });
            return next();
        }

        if (!req.user) throw Error('An unexpected error occurred');

        let updateData;

        if (req.file) {
            const profilePicture = await MediaService.uploadMedia(
                req.file.path,
                req.user.id,
                'profile-pictures'
            );

            // delete current image
            if (req.user.profilePicture)
                await MediaService.deleteMedia(req.user.profilePicture);

            updateData = {
                username,
                bio,
                profilePicture,
            };
        } else {
            updateData = {
                username,
                bio,
            };
        }

        const updatedUser = await UserService.updateUser(req.user, updateData);
        if (!updatedUser)
            throw Error(
                "Failed to update the user's profile. Please try again later."
            );

        const profile = await UserService.getUserProfile(updatedUser);

        res.status(200).json({
            data: profile,
            message: 'Profile updated successfully',
        });
        return next();
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
        return next();
    }
};
