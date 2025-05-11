import { getRepository } from 'fireorm';
import Post from '../models/post.model';

class PostService {
    private PostRepository = getRepository(Post);

    async getPostById(id: string): Promise<Post | null> {
        return await this.PostRepository.findById(id);
    }

    async createPost(userId: string, caption: string): Promise<Post> {
        const post = new Post();
        post.userId = userId;
        post.caption = caption;

        return this.PostRepository.create(post);
    }

    async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
        const post = await this.PostRepository.findById(id);

        if (!post) return null;

        Object.assign(post, updates);
        return await this.PostRepository.update(post);
    }

    async deletePost(id: string): Promise<boolean> {
        const post = await this.getPostById(id);
        if (!post) return false;

        await this.PostRepository.delete(id);
        return true;
    }

    async setMediaURL(id: string, mediaURL: string): Promise<Post | null> {
        const post = await this.PostRepository.findById(id);

        if (!post) return null;

        post.mediaURL = mediaURL;

        return await this.PostRepository.update(post);
    }

    async getPostsByUserId(userId: string): Promise<Post[]> {
        return await this.PostRepository.whereEqualTo('userId', userId)
            .orderByDescending('createdAt')
            .find();
    }

    async getLatestPosts(): Promise<Post[]> {
        return await this.PostRepository.orderByDescending('createdAt').find();
    }

    async getLatestPostsFromFollowing(followingIds: string[]): Promise<Post[]> {
        return await this.PostRepository.whereIn('userId', followingIds)
            .orderByDescending('createdAt')
            .find();
    }
}

export default new PostService();
