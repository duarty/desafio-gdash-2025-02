import type { User } from "../../domain/models/user";
import type { UserRepository } from "../../domain/usecases/user-repository";
import type { CreateUserDto } from "../../domain/dtos/create-user-dto";
import { api } from "../api/client";

export class HttpUserRepository implements UserRepository {
    async getUsers(): Promise<User[]> {
        const response = await api.get<User[]>("/users");
        return response.data;
    }

    async createUser(user: CreateUserDto): Promise<User> {
        const response = await api.post<User>("/users", user);
        return response.data;
    }

    async updateUser(id: string, user: Partial<User>): Promise<User> {
        const response = await api.patch<User>(`/users/${id}`, user);
        return response.data;
    }

    async deleteUser(id: string): Promise<void> {
        await api.delete(`/users/${id}`);
    }
}
