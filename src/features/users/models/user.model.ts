import { Collection } from 'fireorm';

@Collection('Users')
class User {
    id!: string;
    email!: string;
    password!: string;
    username!: string;
    profilePicture?: string; // URL
    bio: string;
    followingsCount: number;
    followersCount: number;

    constructor() {
        this.bio = '';
        this.followingsCount = 0;
        this.followersCount = 0;
    }
}

interface Profile extends Omit<User, 'email' | 'password'> {}

export default User;
export { Profile };
