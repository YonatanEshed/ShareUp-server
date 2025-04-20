import { getRepository } from 'fireorm';
import Comment from '../models/comment.model';
import Post from '../models/post.model';

class CommentService {
    private CommentRepository = getRepository(Comment);

    async getCommentById(commentId: string): Promise<Comment | null> {
        return await this.CommentRepository.findById(commentId);
    }

    async addComment(
        userId: string,
        postId: string,
        content: string
    ): Promise<Comment> {
        const comment = new Comment();
        comment.userId = userId;
        comment.postId = postId;
        comment.content = content;
        comment.createdAt = new Date();

        return await this.CommentRepository.create(comment);
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const comment = await this.CommentRepository.findById(commentId);
        if (!comment) return false;

        await this.CommentRepository.delete(commentId);
        return true;
    }

    async getCommentsByPost(postId: string) {
        const comments = await this.CommentRepository.whereEqualTo(
            'postId',
            postId
        )
            .orderByAscending('createdAt') // Ensure comments are ordered by creation date
            .find();
        return comments;
    }

    async updateComment(
        commentId: string,
        content: string
    ): Promise<Comment | null> {
        const comment = await this.CommentRepository.findById(commentId);
        if (!comment) return null;

        comment.content = content;
        await this.CommentRepository.update(comment);
        return comment;
    }
}

export default new CommentService();
