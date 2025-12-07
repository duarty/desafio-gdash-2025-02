import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FlipStatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    insight?: string;
    source?: "gemini" | "local";
    isLoading?: boolean;
}

export function FlipStatCard({ title, value, subtitle, icon: Icon, insight, source, isLoading }: FlipStatCardProps) {
    const hasInsight = insight && insight.length > 0;
    const isGemini = source === "gemini";

    if (isLoading) {
        return (
            <Card className="h-[140px] border-0 shadow-sm bg-card">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="group h-[140px] perspective-1000">
            <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                <Card className="absolute w-full h-full border-0 shadow-sm bg-card backface-hidden">
                    <CardContent className="p-6 h-full">
                        <div className="flex items-start justify-between h-full">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                                <p className="text-3xl font-semibold tracking-tight">{value}</p>
                                <p className="text-xs text-muted-foreground">{subtitle}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="absolute w-full h-full border-0 shadow-sm bg-card backface-hidden rotate-y-180">
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                        {hasInsight ? (
                            <>
                                <div className="flex items-start gap-2">
                                    <Sparkles className={cn(
                                        "h-4 w-4 flex-shrink-0 mt-0.5",
                                        isGemini ? "text-blue-500" : "text-amber-500"
                                    )} />
                                    <p className="text-sm leading-relaxed line-clamp-4">{insight}</p>
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded",
                                        isGemini
                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                    )}>
                                        {isGemini ? "Gemini AI" : "Local"}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                                <Sparkles className="h-5 w-5 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    Configure a API Gemini para insights
                                </p>
                                <a
                                    href="https://aistudio.google.com/api-keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                                >
                                    Obter API Key <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
