import { Request, Response } from 'express';
import postService from '../services/post.service';
import FollowService from '../../users/services/follow.service';
import { log } from 'console';

export const getLatestPosts = async (req: Request, res: Response) => {
    try {
        const posts = await postService.getLatestPosts();
        res.status(200).json({
            data: posts,
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

        console.log('got here 1');

        const posts = await postService.getLatestPostsFromFollowing(
            followingIds
        );

        console.log('got here 2');

        if (posts.length === 0) {
            return res.status(200).json({
                data: null,
                message: "You don't follow didn't upload a post yet",
            });
        }

        console.log('got here 3');

        res.status(200).json({
            data: posts,
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
