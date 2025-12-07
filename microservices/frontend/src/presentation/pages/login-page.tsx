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
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, CloudSun } from "lucide-react";

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
        defaultValues: { email: "", password: "" },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    async function onLogin(values: z.infer<typeof loginSchema>) {
        setIsLoading(true);
        try {
            const { token, user } = await authRepository.login(values.email, values.password);
            setAuth(user, token.accessToken);
            navigate("/");
        } catch {
            toast.error("Credenciais inválidas");
        } finally {
            setIsLoading(false);
        }
    }

    async function onRegister(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        try {
            await userRepository.createUser(values);
            toast.success("Conta criada! Faça login.");
            setIsLogin(true);
            registerForm.reset();
        } catch {
            toast.error("Erro ao criar conta");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-sm space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
                            <CloudSun className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            {isLogin ? "Entre para acessar o dashboard" : "Preencha seus dados para começar"}
                        </p>
                    </div>

                    {/* Tab Switch */}
                    <div className="flex items-center w-full border-b border-border mb-6">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => { setIsLogin(true); setShowPassword(false); }}
                            className={`flex-1 rounded-none hover:bg-transparent transition-all pb-2 ${isLogin
                                ? "border-b-2 border-primary text-primary font-bold"
                                : "border-b-2 border-transparent text-muted-foreground hover:text-primary"
                                }`}
                        >
                            Entrar
                        </Button>

                        {/* Central Separator */}
                        <div className="w-[1px] h-6 bg-gray-300 mx-1" />

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => { setIsLogin(false); setShowPassword(false); }}
                            className={`flex-1 rounded-none hover:bg-transparent transition-all pb-2 ${!isLogin
                                ? "border-b-2 border-primary text-primary font-bold"
                                : "border-b-2 border-transparent text-muted-foreground hover:text-primary"
                                }`}
                        >
                            Cadastrar
                        </Button>
                    </div>

                    {/* Forms */}
                    {isLogin ? (
                        <Form {...loginForm} key="login-form">
                            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                <FormField
                                    control={loginForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="seu@email.com"
                                                    autoComplete="email"
                                                    className="placeholder:text-gray-400"
                                                    {...field}
                                                />
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
                                            <FormLabel>Senha</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        autoComplete="current-password"
                                                        className="placeholder:text-gray-400 pr-10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full font-bold h-11 shadow-md border border-primary" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Entrar
                                </Button>
                            </form>
                        </Form>
                    ) : (
                        <Form {...registerForm} key="register-form">
                            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                                <FormField
                                    control={registerForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Seu nome"
                                                    autoComplete="name"
                                                    className="placeholder:text-gray-400"
                                                    {...field}
                                                />
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
                                            <FormLabel>E-mail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="seu@email.com"
                                                    autoComplete="email"
                                                    className="placeholder:text-gray-400"
                                                    {...field}
                                                />
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
                                            <FormLabel>Senha</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        autoComplete="new-password"
                                                        className="placeholder:text-gray-400 pr-10"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full font-bold h-11 shadow-md border border-primary" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Criar conta
                                </Button>
                            </form>
                        </Form>
                    )}

                    <p className="text-center text-xs text-muted-foreground">
                        © 2024 GDASH Weather
                    </p>
                </div>
            </div>

            {/* Right side - Decorative */}
            <div className="hidden lg:flex lg:flex-1 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-primary-foreground">
                    <CloudSun className="h-16 w-16 mb-8 opacity-90" />
                    <h2 className="text-3xl font-semibold tracking-tight mb-4">
                        GDASH Weather
                    </h2>
                    <p className="text-lg text-center opacity-80 max-w-md">
                        Sistema de monitoramento climático em tempo real com inteligência artificial
                    </p>
                </div>
            </div>
        </div>
    );
}
