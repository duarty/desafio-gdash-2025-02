import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface WeatherCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: LucideIcon;
    gradient: string;
    delay?: number;
}

export function WeatherCard({ title, value, description, icon: Icon, gradient, delay = 0 }: WeatherCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className="w-full"
        >
            <Card className={cn(
                "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                gradient
            )}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 p-3 sm:p-4 lg:p-6">
                    <CardTitle className="text-xs sm:text-sm font-medium text-white/90 truncate pr-2">
                        {title}
                    </CardTitle>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white/80 flex-shrink-0" />
                </CardHeader>
                <CardContent className="relative z-10 p-3 sm:p-4 lg:p-6 pt-0">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
                        {value}
                    </div>
                    <p className="text-[10px] sm:text-xs text-white/80 mt-0.5 sm:mt-1 truncate">
                        {description}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
