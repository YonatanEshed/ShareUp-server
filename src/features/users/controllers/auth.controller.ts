import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { generateToken } from '../utils/jwt.util';
import { comparePasswords, hashPassword } from '../utils/auth.util';

export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    try {
        if (await UserService.isEmailTaken(email))
            return res.status(400).json({ message: 'Email is already taken.' });

        const hashedPassword = hashPassword(password);
        const user = await UserService.createUser(
            username,
            email,
            hashedPassword
        );

        const token = generateToken({ userId: user.id });

        return res.status(200).json({ token, userId: user.id });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await UserService.getUserByEmail(email);

        if (!user || !comparePasswords(password, user.password)) {
            return res.status(400).json({ message: 'Wrong Email or Password' });
        }

        if (!comparePasswords(password, user.password)) {
            return res.status(400).json({ message: 'Wrong Email or Password' });
        }

        const token = generateToken({ userId: user.id });

        return res.status(200).json({ token, userId: user.id });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error }).end();
    }
};
