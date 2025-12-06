import { render, screen, fireEvent } from "@testing-library/react";
import { LoginPage } from "./login-page";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

// Mock dependencies
vi.mock("../../infrastructure/repositories/http-auth-repository", () => {
    return {
        HttpAuthRepository: vi.fn().mockImplementation(() => {
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

describe("LoginPage", () => {
    it("renders login form", () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("submits form with valid data", async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByLabelText("Password"), {
            target: { value: "password123" },
        });

        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        // Add assertions here if needed, e.g., check if navigate was called
        // For now, just ensuring no crash and basic interaction
    });
});
