import type { AuthToken } from "../models/auth-token";
import type { User } from "../models/user";

export interface AuthRepository {
    login(email: string, password: string): Promise<{ token: AuthToken; user: User }>;
}
