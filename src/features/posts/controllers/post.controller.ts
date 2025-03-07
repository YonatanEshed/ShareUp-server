import { Request, Response } from 'express';
import Post from '../models/post.model';
import MediaService from '@/shared/services/storage.service';
import postService from '../services/post.service';
import userService from '@/features/users/services/user.service'; // Import user service

export const uploadPost = async (req: Request, res: Response) => {
    const { caption } = req.body;
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No media file uploaded' });
        }

        if (!caption) {
            return res
                .status(400)
                .json({ message: "'caption' field is required." });
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
        return res.status(200).json({
            post: {
                ...postWithoutUserId,
                user: {
                    id: post.userId,
                    username: user?.username,
                    profilePictureURL: user?.profilePicture,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const getPost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await postService.getPostById(postId);

        if (!post)
            return res.status(404).json({
                message: 'User with the specified ID does not exist.',
            });

        const user = await userService.getUserById(post.userId);
        const { userId, ...postWithoutUserId } = post; // Exclude userId
        return res.status(200).json({
            post: {
                ...postWithoutUserId,
                user: {
                    id: post.userId,
                    username: user?.username,
                    profilePictureURL: user?.profilePicture,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
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
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (!req.user || post.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action.' });
        }

        if (post.mediaURL) {
            await MediaService.deleteMedia(post.mediaURL);
        }

        await postService.deletePost(postId);

        return res.status(200).json({ message: 'Post deleted successfully.' });
    } catch (error) {
        res.status(500).json({
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
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (!req.user || post.userId !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action.' });
        }

        const updates: Partial<Post> = {};
        if (caption !== undefined) updates.caption = caption;

        const updatedPost = await postService.updatePost(postId, updates);

        const user = await userService.getUserById(post.userId);
        const { userId, ...postWithoutUserId } = updatedPost as Post; // Exclude userId
        return res.status(200).json({
            post: {
                ...postWithoutUserId,
                user: {
                    id: post.userId,
                    username: user?.username,
                    profilePictureURL: user?.profilePicture,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
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
                .json({ message: 'No posts found for this user.' });
        }

        const user = await userService.getUserById(userId);
        const postsWithUser = posts.map((post) => {
            const { userId, ...postWithoutUserId } = post;
            return {
                ...postWithoutUserId,
                user: {
                    id: userId,
                    username: user?.username,
                    profilePictureURL: user?.profilePicture,
                },
            };
        });

        return res.status(200).json({ posts: postsWithUser });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
