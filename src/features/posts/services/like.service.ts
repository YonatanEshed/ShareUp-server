import { getRepository, runTransaction } from 'fireorm';
import Like from '../models/like.model';
import Post from '../models/post.model';

class LikeService {
    private LikeRepository = getRepository(Like);

    async likePost(userId: string, postId: string): Promise<Like> {
        return await runTransaction(async (tran) => {
            const like = new Like();
            like.userId = userId;
            like.postId = postId;

            const post = await tran.getRepository(Post).findById(postId);
            if (post) {
                post.likesCount += 1;
                await tran.getRepository(Post).update(post);
            }

            return await tran.getRepository(Like).create(like);
        });
    }

    async unlikePost(userId: string, postId: string): Promise<boolean> {
        return await runTransaction(async (transaction) => {
            const likes = await transaction
                .getRepository(Like)
                .whereEqualTo('userId', userId)
                .whereEqualTo('postId', postId)
                .find();
            if (likes.length === 0) return false;

            const post = await transaction.getRepository(Post).findById(postId);

            const like = likes[0];
            await transaction.getRepository(Like).delete(like.id);

            if (post) {
                post.likesCount -= 1;
                await transaction.getRepository(Post).update(post);
            }

            return true;
        });
    }

    async deleteLikesByPostId(postId: string): Promise<boolean> {
        return await runTransaction(async (transaction) => {
            const likes = await transaction
                .getRepository(Like)
                .whereEqualTo('postId', postId)
                .find();

            if (likes.length === 0) return false;

            const post = await transaction.getRepository(Post).findById(postId);

            for (const like of likes) {
                await transaction.getRepository(Like).delete(like.id);
            }

            if (post) {
                post.likesCount = 0;
                await transaction.getRepository(Post).update(post);
            }

            return true;
        });
    }

    async getLikesByPost(postId: string) {
        const likes = await this.LikeRepository.whereEqualTo(
            'postId',
            postId
        ).find();
        return likes.map((like) => like.userId);
    }

    async isLiked(userId: string, postId: string): Promise<boolean> {
        const likes = await this.LikeRepository.whereEqualTo('userId', userId)
            .whereEqualTo('postId', postId)
            .find();
        return likes.length > 0;
    }
}

export default new LikeService();
