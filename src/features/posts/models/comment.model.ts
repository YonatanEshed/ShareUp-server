import { Collection } from 'fireorm';

@Collection('Comments')
class Comment {
    id!: string;
    userId!: string;
    postId!: string;
    content!: string;
    createdAt!: Date;
}

export default Comment;
