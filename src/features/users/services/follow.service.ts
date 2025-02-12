import { getRepository, runTransaction } from 'fireorm';
import Follow from '../models/follow.model';
import User from '../models/user.model';
import userService from './user.service';

class FollowService {
    private followRepository = getRepository(Follow);

    async getFollow(followerId: string, followedId: string) {
        const follow = await this.followRepository
            .whereEqualTo('followerId', followerId)
            .whereEqualTo('followedId', followedId)
            .findOne();

        return follow;
    }

    async createFollow(
        followerId: string, // the person who follows
        followedId: string // the person who is being followed
    ): Promise<Follow | null> {
        const follower = await userService.getUserById(followerId);
        const followed = await userService.getUserById(followedId);

        if (!follower || !followed) return null;

        let createdFollow: Follow | null = null;

        await runTransaction(async (transaction) => {
            follower.followingsCount += 1;
            followed.followersCount += 1;
            await transaction.getRepository(User).update(follower);
            await transaction.getRepository(User).update(followed);

            const follow = new Follow();
            follow.followerId = followerId;
            follow.followedId = followedId;
            createdFollow = await transaction
                .getRepository(Follow)
                .create(follow);
        });

        return createdFollow;
    }

    async deleteFollow(
        followerId: string, // the person who follows
        followedId: string // the person who is being followed
    ): Promise<boolean> {
        const follower = await userService.getUserById(followerId);
        const followed = await userService.getUserById(followedId);
        const follow = await this.getFollow(followerId, followedId);

        if (!follower || !followed || !follow) return false;

        let isDeleted = false;

        await runTransaction(async (transaction) => {
            follower.followingsCount -= 1;
            followed.followersCount -= 1;
            await transaction.getRepository(User).update(follower);
            await transaction.getRepository(User).update(followed);

            await transaction.getRepository(Follow).delete(follow.id);
            isDeleted = true;
        });

        return isDeleted;
    }

    async isFollow(followerId: string, followedId: string) {
        const existingFollow = await this.followRepository
            .whereEqualTo('followerId', followerId)
            .whereEqualTo('followedId', followedId)
            .findOne();

        return existingFollow !== null;
    }

    async getFollowing(userId: string) {
        const following = await this.followRepository
            .whereEqualTo('followerId', userId)
            .find();

        return following.map((follow) => follow.followedId);
    }

    async getFollowers(userId: string) {
        const followers = await this.followRepository
            .whereEqualTo('followedId', userId)
            .find();

        return followers.map((follow) => follow.followerId);
    }
}

export default new FollowService();
