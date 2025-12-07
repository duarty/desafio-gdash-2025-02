import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "./login-page";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

// Mock dependencies
vi.mock("../../infrastructure/repositories/http-auth-repository", () => {
    return {
        HttpAuthRepository: vi.fn(function () {
            return {
                login: vi.fn().mockResolvedValue({
                    token: { accessToken: "fake-token" },
                    user: { id: "1", name: "Test User", email: "test@example.com" },
                }),
            };
        }),
    };
});

vi.mock("../../application/store/auth-store", () => ({
    useAuthStore: () => ({
        setAuth: vi.fn(),
    }),
}));

vi.mock("../../infrastructure/repositories/http-user-repository", () => {
    return {
        HttpUserRepository: vi.fn(function () {
            return {
                createUser: vi.fn().mockResolvedValue({}),
            };
        }),
    };
});

describe("LoginPage", () => {
    it("renders login form", () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByText("Bem-vindo de volta")).toBeInTheDocument();
        expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
        expect(screen.getByLabelText("Senha")).toBeInTheDocument();
    });

    it("submits form with valid data", async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText("E-mail"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Senha"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByText("Entrar", { selector: 'button[type="submit"]' }));

        // Add assertions here if needed, e.g., check if navigate was called
        // For now, just ensuring no crash and basic interaction
    });
});
