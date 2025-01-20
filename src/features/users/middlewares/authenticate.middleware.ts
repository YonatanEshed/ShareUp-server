import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import UserService from '../services/user.service';
import { verifyToken } from '../utils/jwt.util';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token is required.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

    try {
        const decoded = verifyToken(token) as JwtPayload;

        const user = await UserService.getUserById(decoded.userId);
        if (!user) throw Error; // if no user move to catch

        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};
