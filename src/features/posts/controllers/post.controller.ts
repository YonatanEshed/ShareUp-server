import { NextFunction, Request, Response } from 'express';
import Post from '../models/post.model';
import MediaService from '../../../shared/services/storage.service';
import postService from '../services/post.service';
import userService from '../../../features/users/services/user.service';
import likeService from '../services/like.service';
import notificationService from '../../../features/notifications/services/notification.service';
import followService from '../../../features/users/services/follow.service';
import { activityType } from '../../../features/notifications/models/activity.model';
import User from '../../../features/users/models/user.model';

export const uploadPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { caption } = req.body;
    try {
        if (!req.file) {
            res.status(400).json({
                data: null,
                message: 'No media file uploaded',
            });
            return next();
        }

        if (!caption) {
            res.status(400).json({
                data: null,
                message: "'caption' field is required.",
            });
            return next();
        }

        if (!req.user) throw Error('An unexpected error occurred');
        const post = await postService.createPost(req.user.id, caption);

        const mediaURL = await MediaService.uploadMedia(
            req.file.path,
            post.id,
            'posts'
        );

        post.mediaURL = mediaURL;
        await postService.setMediaURL(post.id, mediaURL);

        const user = await userService.getUserById(post.userId);
        const { userId, ...postWithoutUserId } = post; // Exclude userId

        const followerIds = await followService.getFollowers(userId);
        let followers = await Promise.all(
            followerIds.map(async (id) => {
                const user = await userService.getUserById(id);
                return user;
            })
        );

        followers = followers.filter((user) => user !== null);

        notificationService.sendNotificationToMultiple(
            req.user,
            followers as User[],
            activityType.post,
            `${req.user.username} uploaded a new post`
        );

        res.status(200).json({
            data: {
                ...postWithoutUserId,
                user: {
                    id: post.userId,
                    username: user?.username,
                    profilePicture: user?.profilePicture,
                },
            },
            message: 'Post uploaded successfully',
        });
        return next();
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
        return next();
    }
};

export const getPost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await postService.getPostById(postId);

        if (!post)
            return res.status(404).json({
                data: null,
                message: 'User with the specified ID does not exist.',
            });

        const user = await userService.getUserById(post.userId);
        const isLiked = req.user
            ? await likeService.isLiked(req.user.id, postId)
            : false;

        const { userId, ...postWithoutUserId } = post; // Exclude userId
        return res.status(200).json({
            data: {
                ...postWithoutUserId,
                user: {
                    id: post.userId,
                    username: user?.username,
                    profilePicture: user?.profilePicture,
                },
                isLiked,
            },
            message: 'Post retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const deletePost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await postService.getPostById(postId);

        if (!post) {
            return res
                .status(404)
                .json({ data: null, message: 'Post not found.' });
        }

        if (!req.user || post.userId !== req.user.id) {
            return res
                .status(403)
                .json({ data: null, message: 'Unauthorized action.' });
        }

        if (post.mediaURL) {
            await MediaService.deleteMedia(post.mediaURL);
        }

        await postService.deletePost(postId);

        return res
            .status(200)
            .json({ data: null, message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const updatePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { caption } = req.body;

    try {
        const post = await postService.getPostById(postId);

        if (!post) {
            return res
                .status(404)
                .json({ data: null, message: 'Post not found.' });
        }

        if (!req.user || post.userId !== req.user.id) {
            return res
                .status(403)
                .json({ data: null, message: 'Unauthorized action.' });
        }

        const updates: Partial<Post> = {};
        if (caption !== undefined) updates.caption = caption;

        const updatedPost = await postService.updatePost(postId, updates);

        const user = await userService.getUserById(post.userId);
        const { userId, ...postWithoutUserId } = updatedPost as Post; // Exclude userId
        return res.status(200).json({
            data: {
                ...postWithoutUserId,
                user: {
                    id: post.userId,
                    username: user?.username,
                    profilePicture: user?.profilePicture,
                },
            },
            message: 'Post updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const getPostsByUser = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const posts = await postService.getPostsByUserId(userId);

        if (!posts.length) {
            return res
                .status(404)
                .json({ data: null, message: 'No posts found for this user.' });
        }

        const user = await userService.getUserById(userId);
        const postsWithUser = posts.map((post) => {
            const { userId, ...postWithoutUserId } = post;
            return {
                ...postWithoutUserId,
                user: {
                    id: userId,
                    username: user?.username,
                    profilePicture: user?.profilePicture,
                },
            };
        });

        return res.status(200).json({
            data: postsWithUser,
            message: 'Posts retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
