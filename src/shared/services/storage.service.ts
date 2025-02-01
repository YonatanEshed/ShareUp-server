import admin from '@/config/firebase'; // Adjust the path as needed
import { v4 as uuidv4 } from 'uuid';
import { URL } from 'url';
import path from 'path';

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
        const fileType = path.basename(filePath).split('.').pop();
        const storagePath = `${folder}/${uuidv4()}-${fileName}.${fileType}`;
        const file = this.bucket.file(storagePath);

        await file.save(filePath, {
            resumable: false,
            contentType: 'auto',
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
