import { Request } from 'express';
import User from '@/features/users/models/user.model';

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            file?: Express.Multer.File;
        }
    }
}
