import config from '@/config/env';
import * as crypto from 'crypto';

const PASSWORD_SECRET = config.auth.password_secret;

export function hashPassword(password: string) {
    return crypto
        .createHmac('sha256', PASSWORD_SECRET)
        .update(password)
        .digest('hex');
}

export function comparePasswords(
    password: string,
    hashedPassword: string
): boolean {
    return hashPassword(password) === hashedPassword;
}
