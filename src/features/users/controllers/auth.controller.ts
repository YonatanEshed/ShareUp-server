import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { generateToken } from '../utils/jwt.util';
import { comparePasswords, hashPassword } from '../utils/auth.util';

export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res
            .status(400)
            .json({
                isSuccessful: false,
                message: 'Email, Username, and Password are required.',
            });
    }

    try {
        if (await UserService.isEmailTaken(email))
            return res
                .status(400)
                .json({
                    isSuccessful: false,
                    message: 'Email is already taken.',
                });

        const hashedPassword = hashPassword(password);
        const user = await UserService.createUser(
            username,
            email,
            hashedPassword
        );

        const token = generateToken({ userId: user.id });

        return res
            .status(200)
            .json({
                isSuccessful: true,
                data: { token, userId: user.id },
                message: 'Registration successful',
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                isSuccessful: false,
                message: 'Server error',
                error: (error as Error).message,
            });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res
            .status(400)
            .json({
                isSuccessful: false,
                message: 'Email and Password are required.',
            });
    }

    try {
        const user = await UserService.getUserByEmail(email);

        if (!user || !comparePasswords(password, user.password)) {
            return res
                .status(400)
                .json({
                    isSuccessful: false,
                    message: 'Wrong Email or Password',
                });
        }

        if (!comparePasswords(password, user.password)) {
            return res
                .status(400)
                .json({
                    isSuccessful: false,
                    message: 'Wrong Email or Password',
                });
        }

        const token = generateToken({ userId: user.id });

        return res
            .status(200)
            .json({
                isSuccessful: true,
                data: { token, userId: user.id },
                message: 'Login successful',
            });
    } catch (error) {
        return res
            .status(500)
            .json({
                isSuccessful: false,
                message: 'Server error',
                error: (error as Error).message,
            })
            .end();
    }
};
