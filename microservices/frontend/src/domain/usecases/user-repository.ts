import type { User } from "../models/user";
import type { CreateUserDto } from "../dtos/create-user-dto";

export interface UserRepository {
    getUsers(): Promise<User[]>;
    createUser(user: CreateUserDto): Promise<User>;
    updateUser(id: string, user: Partial<User>): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
