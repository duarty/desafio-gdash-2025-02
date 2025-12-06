import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../application/store/auth-store";
import { useWeatherStore } from "../../application/store/weather-store";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, CloudSun, Users, Lightbulb, LogOut, Sun, Thermometer, Droplets, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

export function MainLayout() {
    const { logout, user } = useAuthStore();
    const { currentWeather } = useWeatherStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        { href: "/", label: "Dashboard", icon: CloudSun },
        { href: "/solar-projects", label: "Usinas", icon: Sun },
        { href: "/users", label: "Usuários", icon: Users },
        { href: "/insights", label: "Insights", icon: Lightbulb },
    ];

    const showWeather = location.pathname !== "/" && currentWeather;

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center gap-2.5">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                                    <CloudSun className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div className="hidden sm:flex items-center gap-4">
                                    <span className="text-lg font-semibold tracking-tight leading-none">
                                        GDASH
                                    </span>
                                    {showWeather && (
                                        <div className="flex items-center gap-3 pl-4 border-l h-5 animate-in fade-in slide-in-from-left-2">
                                            <div className="flex items-center gap-1.5 text-xs font-medium" title="Temperatura">
                                                <Thermometer className="h-3.5 w-3.5 text-orange-500" />
                                                <span>{currentWeather.temperature}°C</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium" title="Umidade">
                                                <Droplets className="h-3.5 w-3.5 text-blue-500" />
                                                <span>{currentWeather.humidity}%</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-medium" title="Vento">
                                                <Wind className="h-3.5 w-3.5 text-slate-500" />
                                                <span>{currentWeather.windSpeed} km/h</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-secondary text-foreground"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                            )}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-3 pl-4 border-l">
                                <div className="text-right">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Mobile Menu */}
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-72 p-0">
                                    <div className="flex flex-col h-full">
                                        {/* Mobile Header */}
                                        <div className="p-6 border-b">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {user?.name?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{user?.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Navigation */}
                                        <nav className="flex-1 p-4 space-y-1">
                                            {navItems.map((item) => {
                                                const isActive = location.pathname === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        to={item.href}
                                                        onClick={() => setIsOpen(false)}
                                                        className={cn(
                                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                                            isActive
                                                                ? "bg-primary text-primary-foreground"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                                        )}
                                                    >
                                                        <item.icon className="h-5 w-5" />
                                                        {item.label}
                                                    </Link>
                                                );
                                            })}
                                        </nav>

                                        {/* Mobile Logout */}
                                        <div className="p-4 border-t">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-3 text-muted-foreground"
                                                onClick={handleLogout}
                                            >
                                                <LogOut className="h-5 w-5" />
                                                Sair
                                            </Button>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-bottom">
                <div className="flex items-center justify-around h-16">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-4 py-2 transition-colors",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom spacer for mobile nav */}
            <div className="h-16 md:hidden" />
        </div>
    );
}
