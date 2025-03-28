import { Request, Response } from 'express';
import likeService from '../services/like.service';
import postService from '../services/post.service';
import userService from '../../../features/users/services/user.service';

export const likePost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    if (!req.user?.id) {
        return res.status(401).json({ data: null, message: 'Unauthorized' });
    }

    try {
        const post = await postService.getPostById(postId);
        if (!post) {
            return res
                .status(404)
                .json({ data: null, message: 'Post not found' });
        }

        const isLiked = await likeService.isLiked(req.user.id, postId);
        if (isLiked)
            return res
                .status(400)
                .json({
                    data: null,
                    message: 'You have already liked this post',
                });

        const like = await likeService.likePost(req.user.id, postId);
        return res
            .status(201)
            .json({ data: like, message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const unlikePost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    if (!req.user?.id) {
        return res.status(401).json({ data: null, message: 'Unauthorized' });
    }

    try {
        const post = await postService.getPostById(postId);
        if (!post) {
            return res
                .status(404)
                .json({ data: null, message: 'Post not found' });
        }

        const success = await likeService.unlikePost(req.user.id, postId);
        if (!success) {
            return res
                .status(404)
                .json({ data: null, message: 'Like not found' });
        }

        return res
            .status(200)
            .json({ data: null, message: 'Post unliked successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const getLikesByPostId = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const post = await postService.getPostById(postId);
        if (!post) {
            return res
                .status(404)
                .json({ data: null, message: 'Post not found' });
        }

        const likes = await likeService.getLikesByPost(postId);
        const userProfiles = await Promise.all(
            likes.map(async (userId) => {
                const user = await userService.getUserById(userId);
                return user ? userService.getUserProfile(user) : null;
            })
        );

        res.status(200).json({
            data: userProfiles.filter((profile) => profile !== null),
            message: 'Likes retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
