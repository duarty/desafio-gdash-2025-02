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
        >
            <Card className={cn("relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-md", gradient)}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">{title}</CardTitle>
                    <Icon className="h-6 w-6 text-white/80" />
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-white">{value}</div>
                    <p className="text-xs text-white/80 mt-1">{description}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
