import fs from 'fs';
import path from 'path';

import { NextFunction, Request, Response } from 'express';

export const fileUpload = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.files && req.files.length > 0) {
            const file = req.files[0];
            const tmpDir = path.join(__dirname, '../../tmp');

            if (!fs.existsSync(tmpDir)) {
                fs.mkdirSync(tmpDir);
            }

            const tmpFilePath = path.join(tmpDir, file.originalname);
            fs.writeFileSync(tmpFilePath, file.buffer);

            req.file = {
                path: tmpFilePath,
                originalname: file.originalname,
                mimetype: file.mimetype,
            };
        }
        next();
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const fileCleanUp = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (req.file && req.file.path) {
            fs.unlinkSync(req.file.path);
        }
    } catch (error) {}
    next();
};
