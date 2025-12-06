import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../application/store/auth-store";
import { HttpAuthRepository } from "../../infrastructure/repositories/http-auth-repository";
import { HttpUserRepository } from "../../infrastructure/repositories/http-user-repository";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Por favor, insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const registerSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("Por favor, insira um e-mail válido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

export function LoginPage() {
    const { setAuth } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const authRepository = useMemo(() => new HttpAuthRepository(), []);
    const userRepository = useMemo(() => new HttpUserRepository(), []);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onLogin(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        try {
            const { token, user } = await authRepository.login(values.email, values.password);
            setAuth(user, token.accessToken);
            navigate("/");
        } catch {
            toast.error("Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    }

    async function onRegister(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        try {
            await userRepository.createUser(values);
            toast.success("Account created successfully! Please login.");
            setIsLogin(true);
            registerForm.reset();
        } catch {
            toast.error("Failed to create account");
        } finally {
            setIsLoading(false);
        }
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="w-full max-w-sm shadow-2xl border-white/20">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-bold tracking-tight">
                        {isLogin ? "Welcome Back (v2)" : "Create Account (v2)"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isLogin
                            ? "Enter your credentials to access your account"
                            : "Enter your details to create a new account"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full mb-6 bg-muted p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(true);
                                setShowPassword(false);
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 !cursor-pointer ${isLogin
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(false);
                                setShowPassword(false);
                            }}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 !cursor-pointer ${!isLogin
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {isLogin ? (
                        <Form {...loginForm}>
                            <form key="login-form" onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" noValidate>
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite seu e-mail" {...field} autoFocus />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={loginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Digite sua senha"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent !cursor-pointer"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...registerForm}>
                            <form key="register-form" onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4" noValidate>
                                <FormField
                                    control={registerForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite seu nome completo" {...field} autoFocus />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Digite seu e-mail" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={registerForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="Digite sua senha"
                                                        {...field}
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent !cursor-pointer"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
