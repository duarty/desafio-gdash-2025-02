import { User } from "../entities/user.entity";

export interface UserRepository {
    create(user: Omit<User, "id" | "createdAt">): Promise<void>;
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    delete(id: string): Promise<void>;
}
