import { getRepository } from 'fireorm';
import User, { Profile } from '../models/user.model';

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
        user.username = username.toLowerCase(); // Normalize username to lowercase
        user.email = email;
        user.password = password;

        return this.userRepository.create(user);
    }

    async updateUser(user: User, updates: Partial<User>): Promise<User | null> {
        Object.assign(user, updates);
        return await this.userRepository.update(user);
    }

    async isEmailTaken(email: string): Promise<boolean> {
        const existingUsers = await this.userRepository
            .whereEqualTo('email', email)
            .find();

        return existingUsers.length > 0;
    }

    async searchUsers(searchTerm: string): Promise<string[]> {
        const formattedSearchTerm = searchTerm.trim(); // Remove extra spaceslize search term
        const endSearchTerm = formattedSearchTerm + '\uf8ff'; // Add a high Unicode character to define the range

        console.log(
            `Searching for usernames between "${formattedSearchTerm}" and "${endSearchTerm}"`
        );

        const usersByUsername = await this.userRepository
            .whereGreaterOrEqualThan('username', formattedSearchTerm)
            .whereLessThan('username', endSearchTerm)
            .find();

        console.log('Users found:', usersByUsername);

        return usersByUsername.map((user) => user.id);
    }

    getUserProfile(user: User): Profile {
        const { email, password, ...profile } = user;
        return profile;
    }
}

export default new UserService();
