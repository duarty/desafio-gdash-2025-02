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
import { Eye, EyeOff, Loader2, CloudSun } from "lucide-react";
import { motion } from "framer-motion";

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
            toast.error("Credenciais inválidas");
        } finally {
            setIsLoading(false);
        }
    }

    async function onRegister(values: z.infer<typeof registerSchema>) {
        setIsLoading(true);
        try {
            await userRepository.createUser(values);
            toast.success("Conta criada com sucesso! Faça login.");
            setIsLogin(true);
            registerForm.reset();
        } catch {
            toast.error("Falha ao criar conta");
        } finally {
            setIsLoading(false);
        }
    }

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[400px] relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center mb-6 sm:mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25">
                            <CloudSun className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                GDASH Weather
                            </h1>
                            <p className="text-xs text-muted-foreground">Sistema de Monitoramento Climático</p>
                        </div>
                    </div>
                </div>

                <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl sm:text-2xl text-center font-bold tracking-tight">
                            {isLogin ? "Bem-vindo de volta" : "Criar conta"}
                        </CardTitle>
                        <CardDescription className="text-center text-sm">
                            {isLogin
                                ? "Entre com suas credenciais para acessar"
                                : "Preencha os dados para criar sua conta"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Tab Toggle */}
                        <div className="flex w-full bg-muted p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(true);
                                    setShowPassword(false);
                                }}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 !cursor-pointer ${isLogin
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Entrar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(false);
                                    setShowPassword(false);
                                }}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 !cursor-pointer ${!isLogin
                                    ? "bg-background shadow-sm text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                Cadastrar
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
                                                <FormLabel>E-mail</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="seu@email.com"
                                                        {...field}
                                                        autoFocus
                                                        className="h-11"
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
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            {...field}
                                                            className="h-11 pr-10"
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
                                    <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Entrando...
                                            </>
                                        ) : (
                                            "Entrar"
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
                                                <FormLabel>Nome completo</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Seu nome"
                                                        {...field}
                                                        autoFocus
                                                        className="h-11"
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
                                                        {...field}
                                                        className="h-11"
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
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="••••••••"
                                                            {...field}
                                                            className="h-11 pr-10"
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
                                    <Button type="submit" className="w-full h-11 font-semibold" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Criando conta...
                                            </>
                                        ) : (
                                            "Criar conta"
                                        )}
                                    </Button>
                                </form>
                            </Form>
                        )}
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="text-center text-xs text-muted-foreground mt-6">
                    © 2024 GDASH. Todos os direitos reservados.
                </p>
            </motion.div>
        </div>
    );
}
