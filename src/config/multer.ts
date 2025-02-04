import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4().replace(/-/g, ''); // Generate a UUID and remove dashes
        const ext = path.extname(file.originalname); // Extract the file extension from the original file
        cb(null, `${uniqueId}${ext}`); // Use the UUID as the file name
    },
});

export const upload = multer({ storage }); // Temporary storage for uploaded files
