import { getRepository } from 'fireorm';
import User from '../models/user.model';

export class UserService {
    private static userRepository = getRepository(User);

    static async getUserById(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        const users = await this.userRepository
            .whereEqualTo('email', email)
            .find();

        if (users.length === 0) return null;
        return users[0];
    }

    static async createUser(
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

    static async updateUser(
        id: string,
        updates: Partial<User>
    ): Promise<User | null> {
        const user = await this.userRepository.findById(id);

        if (!user) return null;

        Object.assign(user, updates);
        return await this.userRepository.update(user);
    }

    static async deleteUser(id: string): Promise<boolean> {
        const user = await this.getUserById(id);
        if (!user) return false;

        await this.userRepository.delete(id);
        return true;
    }

    static async isEmailTaken(email: string): Promise<boolean> {
        const existingUsers = await this.userRepository
            .whereEqualTo('email', email)
            .find();

        return existingUsers.length > 0;
    }
}
