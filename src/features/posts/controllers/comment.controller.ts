import { Request, Response } from 'express';
import commentService from '../services/comment.service';
import postService from '../services/post.service';
import userService from '@/features/users/services/user.service';

export const addComment = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const post = await postService.getPostById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = await commentService.addComment(
            req.user.id,
            postId,
            content
        );
        return res.status(201).json({ comment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;

    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const comment = await commentService.getCommentById(commentId);
        if (!comment)
            return res.status(404).json({ message: 'Comment not found' });

        const post = await postService.getPostById(comment.postId);
        if (
            !post ||
            (comment.userId !== req.user.id && post.userId !== req.user.id)
        )
            return res.status(403).json({
                message: 'Unauthorized action.',
            });

        await commentService.deleteComment(commentId);
        return res
            .status(200)
            .json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await postService.getPostById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comments = await commentService.getCommentsByPost(postId);

        const commentsWithUserDetails = await Promise.all(
            comments.map(async (comment) => {
                const user = await userService.getUserById(comment.userId);
                return {
                    ...comment,
                    user: {
                        id: comment.userId,
                        username: user?.username,
                        profilePictureURL: user?.profilePicture,
                    },
                };
            })
        );

        res.status(200).json(commentsWithUserDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!req.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const comment = await commentService.getCommentById(commentId);
        if (!comment || comment.userId !== req.user.id) {
            return res.status(403).json({
                message: 'Forbidden: You are not the owner of this comment',
            });
        }

        const updatedComment = await commentService.updateComment(
            commentId,
            content
        );
        return res.status(200).json({ updatedComment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
