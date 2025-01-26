import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';

export const validateUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.params;

    try {
        const user = await UserService.getUserById(userId);
        if (!user) throw Error; // if no user move to catch

        next();
    } catch (error) {
        return res
            .status(404)
            .json({ message: 'Target user not found:' + userId });
    }
};
