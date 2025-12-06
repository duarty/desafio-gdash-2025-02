import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../application/store/auth-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, CloudSun, Users, Lightbulb, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainLayout() {
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { href: "/", label: "Dashboard", icon: CloudSun },
        { href: "/users", label: "Usuários", icon: Users },
        { href: "/insights", label: "Insights", icon: Lightbulb },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 flex h-14 sm:h-16 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 sm:px-6">
                {/* Logo - Desktop */}
                <nav className="hidden md:flex flex-row items-center gap-6 lg:gap-8">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-lg font-bold"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                            <CloudSun className="h-5 w-5" />
                        </div>
                        <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            GDASH Weather
                        </span>
                    </Link>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground",
                                    location.pathname === item.href
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu Button */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Abrir menu de navegação</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0">
                        <SheetHeader className="p-4 border-b">
                            <SheetTitle className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                                    <CloudSun className="h-5 w-5" />
                                </div>
                                GDASH Weather
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-1 p-4">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        )}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="flex-shrink-0"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Mobile Logo */}
                <Link
                    to="/"
                    className="flex md:hidden items-center gap-2 text-lg font-bold"
                >
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                        <CloudSun className="h-4 w-4" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent text-base">
                        GDASH
                    </span>
                </Link>

                {/* Right side - User info and logout */}
                <div className="flex ml-auto items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xs font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium hidden lg:block">
                            {user?.name}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="hidden md:flex hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Sair</span>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 flex-col">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-xl safe-area-bottom">
                <div className="flex items-center justify-around h-16 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 flex-1 py-2 px-3 rounded-xl transition-all",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className={cn(
                                    "flex items-center justify-center w-10 h-10 rounded-xl transition-all",
                                    isActive && "bg-primary/10"
                                )}>
                                    <Icon className={cn(
                                        "h-5 w-5 transition-transform",
                                        isActive && "scale-110"
                                    )} />
                                </div>
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center justify-center gap-1 flex-1 py-2 px-3 rounded-xl text-muted-foreground hover:text-destructive transition-all"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl">
                            <LogOut className="h-5 w-5" />
                        </div>
                        <span className="text-[10px] font-medium">Sair</span>
                    </button>
                </div>
            </nav>

            {/* Spacer for bottom navigation on mobile */}
            <div className="h-20 md:hidden" />
        </div>
    );
}
