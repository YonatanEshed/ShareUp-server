import { Request, Response } from 'express';
import UserService from '../services/user.service';

export const searchUsers = async (req: Request, res: Response) => {
    const { q } = req.query;
    try {
        if (!q || typeof q !== 'string') {
            return res.status(400).json({
                data: null,
                message: 'Invalid search term',
            });
        }

        console.log(q);

        const userIds = await UserService.searchUsers(q);
        console.log(userIds);
        const profiles = await Promise.all(
            userIds.map(async (id) => {
                const user = await UserService.getUserById(id);
                user ? UserService.getUserProfile(user) : null;
            })
        );

        return res.status(200).json({
            data: profiles.filter((profile) => profile !== null),
            message: 'Users retrieved successfully',
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
