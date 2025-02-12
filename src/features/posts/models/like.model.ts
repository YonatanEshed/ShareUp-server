import { Collection } from 'fireorm';

@Collection('Likes')
class Like {
    id!: string;
    userId!: string;
    postId!: string;
}

export default Like;
