import { Request, Response } from 'express';
import UserService from '../services/user.service';

export const getOwnProfile = async (req: Request, res: Response) => {
    try {
        if (!req.user) throw Error('An unexpected error accrued');
        const profile = UserService.getUserProfile(req.user);

        return res.status(200).json({ profile });
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const user = await UserService.getUserById(userId);
        if (!user)
            return res.status(404).json({
                message: 'User with the specified ID does not exist.',
            });

        const profile = UserService.getUserProfile(user);

        return res.status(200).json(profile);
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    const { username, bio } = req.body;

    try {
        if (!username && !bio)
            return res.status(400).json({
                message: "Missing required fields: 'username', 'bio'.",
            });

        if (!req.user) throw Error('An unexpected error accrued');

        const updateData = {
            username,
            bio,
        };

        const updatedUser = await UserService.updateUser(req.user, updateData);
        if (!updatedUser)
            throw Error(
                "Failed to update the user's profile. Please try again later.Failed to update the user's profile. Please try again later."
            );

        const profile = await UserService.getUserProfile(updatedUser);

        return res.status(200).json(profile);
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Server error', error: (error as Error).message });
    }
};
