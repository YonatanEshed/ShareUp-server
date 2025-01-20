import { getRepository } from 'fireorm';
import User from '../models/user.model';

class UserService {
    private userRepository = getRepository(User);

    async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const users = await this.userRepository
            .whereEqualTo('email', email)
            .find();

        if (users.length === 0) return null;
        return users[0];
    }

    async createUser(
        username: string,
        email: string,
        password: string
    ): Promise<User> {
        const user = new User();
        user.username = username;
        user.email = email;
        user.password = password;

        return this.userRepository.create(user);
    }

    async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
        const user = await this.userRepository.findById(id);

        if (!user) return null;

        Object.assign(user, updates);
        return await this.userRepository.update(user);
    }

    async deleteUser(id: string): Promise<boolean> {
        const user = await this.getUserById(id);
        if (!user) return false;

        await this.userRepository.delete(id);
        return true;
    }

    async isEmailTaken(email: string): Promise<boolean> {
        const existingUsers = await this.userRepository
            .whereEqualTo('email', email)
            .find();

        return existingUsers.length > 0;
    }
}

export default new UserService();
