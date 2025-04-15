import admin from '../../config/firebase';
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url';
import path from 'path';
import sharp from 'sharp'; // Add sharp for image processing

class MediaService {
    private bucket;

    constructor() {
        this.bucket = admin.storage().bucket();
    }

    /**
     * Uploads a media file to Firebase Storage under the appropriate folder.
     * @param filePath - The local path to the media file.
     * @param fileName - The name the file will be saved with (uuid-fileName).
     * @param folder - The type of the media: 'profile-pictures' or 'posts'.
     * @returns The public URL of the uploaded media file.
     */
    public async uploadMedia(
        filePath: string,
        fileName: string,
        folder: 'profile-pictures' | 'posts'
    ): Promise<string> {
        const storagePath = `${folder}/${uuidv4()}-${fileName}.png`; // Force .png extension
        const file = this.bucket.file(storagePath);

        // Convert the image to PNG format using sharp
        const convertedBuffer = await sharp(filePath).png().toBuffer();

        await file.save(convertedBuffer, {
            resumable: false,
            contentType: 'image/png', // Ensure content type is set to image/png
            metadata: {
                metadata: {
                    firebaseStorageDownloadTokens: uuidv4(),
                },
            },
        });

        return this.getDownloadURL(storagePath);
    }

    /**
     * Deletes a media file from Firebase Storage.
     * @param fileUrl - The full path of the file in the storage bucket.
     * @returns A success message.
     */
    public async deleteMedia(fileUrl: string): Promise<boolean> {
        const filePath = this.extractFilePathFromUrl(fileUrl);
        try {
            await this.bucket.file(filePath).delete();
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Generates a public URL for a file in Firebase Storage.
     * @param filePath - The full path of the file in the storage bucket.
     * @returns The public URL of the file.
     */
    public getDownloadURL(filePath: string): string {
        return `https://firebasestorage.googleapis.com/v0/b/${
            this.bucket.name
        }/o/${encodeURIComponent(filePath)}?alt=media`;
    }

    private extractFilePathFromUrl(fileUrl: string): string {
        const parsedUrl = new URL(fileUrl);
        const encodedPath = parsedUrl.pathname.split('/o/')[1]; // Extract after '/o/'

        return decodeURIComponent(encodedPath);
    }
}

export default new MediaService();
