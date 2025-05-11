import { Collection } from 'fireorm';

@Collection('Activity')
class Activity {
    id!: string;
    userId!: string; // The user who performed or is related to the activity
    senderId?: string;
    message!: string;
    type!: activityType; // Type of activity
    createdAt: Date;

    constructor() {
        this.createdAt = new Date();
    }
}

export enum activityType {
    follow,
    like,
    post,
    comment,
}

export default Activity;
