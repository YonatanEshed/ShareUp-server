import { Collection } from 'fireorm';

@Collection('Follows')
class Follow {
    id!: string;
    followerId!: string;
    followedId!: string;
}

export default Follow;
