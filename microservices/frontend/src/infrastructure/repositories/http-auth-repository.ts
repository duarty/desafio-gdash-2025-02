import type { AuthToken } from "../../domain/models/auth-token";
import type { User } from "../../domain/models/user";
import type { AuthRepository } from "../../domain/usecases/auth-repository";
import { api } from "../api/client";

export class HttpAuthRepository implements AuthRepository {
    async login(email: string, password: string): Promise<{ token: AuthToken; user: User }> {
        const response = await api.post<{ accessToken: string; user: User }>("/auth/login", { email, password });
        return {
            token: { accessToken: response.data.accessToken },
            user: response.data.user,
        };
    }
}
