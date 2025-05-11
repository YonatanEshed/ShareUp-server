import { Request, Response } from 'express';
import commentService from '../services/comment.service';
import postService from '../services/post.service';
import userService from '../../../features/users/services/user.service';

export const addComment = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!req.user?.id) {
        return res.status(401).json({ data: null, message: 'Unauthorized' });
    }

    try {
        const post = await postService.getPostById(postId);
        if (!post)
            return res
                .status(404)
                .json({ data: null, message: 'Post not found' });

        const comment = await commentService.addComment(
            req.user.id,
            postId,
            content
        );

        const { userId, ...commentWithoutUserId } = comment;

        return res.status(201).json({
            data: {
                ...commentWithoutUserId,
                user: {
                    id: req.user.id,
                    username: req.user.username,
                    profilePicture: req.user.profilePicture,
                },
            },
            message: 'Comment added successfully',
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const deleteComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;

    if (!req.user?.id) {
        return res.status(401).json({ data: null, message: 'Unauthorized' });
    }

    try {
        const comment = await commentService.getCommentById(commentId);
        if (!comment)
            return res
                .status(404)
                .json({ data: null, message: 'Comment not found' });

        const post = await postService.getPostById(comment.postId);
        if (
            !post ||
            (comment.userId !== req.user.id && post.userId !== req.user.id)
        )
            return res.status(403).json({
                data: null,
                message: 'Unauthorized action.',
            });

        await commentService.deleteComment(commentId);
        return res
            .status(200)
            .json({ data: null, message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const post = await postService.getPostById(postId);
        if (!post)
            return res
                .status(404)
                .json({ data: null, message: 'Post not found' });

        const comments = await commentService.getCommentsByPost(postId);

        if (!comments.length) {
            return res.status(404).json({
                data: null,
                message: 'No comments found for this post.',
            });
        }

        const commentsWithUserDetails = await Promise.all(
            comments.map(async (comment) => {
                const { userId, ...commentWithoutUserId } = comment;
                const user = await userService.getUserById(comment.userId);
                return {
                    ...commentWithoutUserId,
                    user: {
                        id: userId,
                        username: user?.username,
                        profilePicture: user?.profilePicture,
                    },
                };
            })
        );

        res.status(200).json({
            data: commentsWithUserDetails,
            message: 'Comments retrieved successfully',
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};

export const updateComment = async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!req.user?.id) {
        return res.status(401).json({ data: null, message: 'Unauthorized' });
    }

    try {
        const comment = await commentService.getCommentById(commentId);
        if (!comment || comment.userId !== req.user.id) {
            return res.status(403).json({
                data: null,
                message: 'Forbidden: You are not the owner of this comment',
            });
        }

        const updatedComment = await commentService.updateComment(
            commentId,
            content
        );
        return res.status(200).json({
            data: updatedComment,
            message: 'Comment updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            message: 'Server error',
            error: (error as Error).message,
        });
    }
};
