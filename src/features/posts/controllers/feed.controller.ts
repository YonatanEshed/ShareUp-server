import { Request, Response } from 'express';
import postService from '../services/post.service';
import FollowService from '../../users/services/follow.service';
import userService from '../../../features/users/services/user.service';
import User from '../../../features/users/models/user.model';
import likeService from '../services/like.service';

export const getLatestPosts = async (req: Request, res: Response) => {
    try {
        const posts = await postService.getLatestPosts();

        const userMap = new Map<string, User | null>();

        const postsWithUser = await Promise.all(
            posts.map(async (post) => {
                const { userId, ...postWithoutUserId } = post;
                if (!userMap.has(userId))
                    userMap.set(userId, await userService.getUserById(userId));

                const user = userMap.get(userId);
                const isLiked = req.user
                    ? await likeService.isLiked(
                          req.user.id,
                          postWithoutUserId.id
                      )
                    : false;

                return {
                    ...postWithoutUserId,
                    user: {
                        id: userId,
                        username: user?.username,
                        profilePicture: user?.profilePicture,
                    },
                    isLiked,
                };
            })
        );

        res.status(200).json({
            data: postsWithUser,
            message: 'Latest posts retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const getLatestPostsFromFollowing = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) throw new Error('Unauthorized');
        const userId = req.user.id;
        const followingIds = await FollowService.getFollowing(userId);

        if (followingIds.length === 0) {
            return res.status(200).json({
                data: null,
                message: "You don't follow didn't upload a post yet",
            });
        }

        const posts = await postService.getLatestPostsFromFollowing(
            followingIds
        );

        if (posts.length === 0) {
            return res.status(200).json({
                data: null,
                message: "You don't follow didn't upload a post yet",
            });
        }

        const userMap = new Map<string, User | null>();

        const postsWithUser = await Promise.all(
            posts.map(async (post) => {
                const { userId, ...postWithoutUserId } = post;
                if (!userMap.has(userId))
                    userMap.set(userId, await userService.getUserById(userId));

                const user = userMap.get(userId);
                const isLiked = req.user
                    ? await likeService.isLiked(
                          req.user.id,
                          postWithoutUserId.id
                      )
                    : false;

                return {
                    ...postWithoutUserId,
                    user: {
                        id: userId,
                        username: user?.username,
                        profilePicture: user?.profilePicture,
                    },
                    isLiked,
                };
            })
        );

        res.status(200).json({
            data: postsWithUser,
            message: 'Latest posts from following retrieved successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
