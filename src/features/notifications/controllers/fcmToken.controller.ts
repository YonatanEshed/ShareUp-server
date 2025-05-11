import { Request, Response } from 'express';
import UserService from '../../users/services/user.service';
import { FieldValue } from 'firebase-admin/firestore';

export const setFcmToken = async (req: Request, res: Response) => {
    const { fcmToken } = req.body;

    try {
        if (!fcmToken)
            return res.status(400).json({
                data: null,
                message: "Missing required field 'fcmToken'.",
            });

        if (!req.user) throw Error('An unexpected error occurred');

        const updatedUser = await UserService.updateUser(req.user, {
            fcmToken,
        });

        if (!updatedUser)
            throw Error(
                "Failed to update the user's profile. Please try again later."
            );

        return res.status(200).json({
            data: null,
            message: 'FCM Token was updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const clearFcmToken = async (req: Request, res: Response) => {
    try {
        if (!req.user) throw Error('An unexpected error occurred');

        const updatedUser = await UserService.updateUser(req.user, {
            fcmToken: '',
        });
        if (!updatedUser)
            throw Error(
                "Failed to clear the user's FCM token. Please try again later."
            );

        return res.status(200).json({
            data: null,
            message: 'FCM Token was cleared successfully',
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
