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
    fcmToken: string;

    constructor() {
        this.bio = '';
        this.followingsCount = 0;
        this.followersCount = 0;
        this.fcmToken = '';
    }
}

interface Profile extends Omit<User, 'email' | 'password' | 'fcmToken'> {}

export default User;
export { Profile };
