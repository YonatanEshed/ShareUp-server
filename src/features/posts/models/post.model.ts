import { Collection } from 'fireorm';

@Collection('Posts')
class Post {
    id!: string;
    userId!: string;
    mediaURL?: string; // URL
    caption?: string;
    likesCount: number;
    createdAt: Date;

    constructor() {
        this.caption = '';
        this.likesCount = 0;
        this.createdAt = new Date();
    }
}

export default Post;
