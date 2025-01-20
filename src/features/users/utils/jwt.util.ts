import jwt from 'jsonwebtoken';
import config from '@/config/env';

const JWT_SECRET = config.auth.jwt_secret;

export interface JwtPayload {
    userId: string;
    iat: number;
    exp: number;
}

export const generateToken = (
    payload: object,
    expiresIn: string = config.auth.jwt_duration
) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};
