import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeatherDashboard } from "../hooks/use-weather-dashboard";
import { FlipStatGrid } from "../components/dashboard/flip-stat-grid";
import { WeatherCharts } from "../components/dashboard/weather-charts";
import { WeatherHistoryTable } from "../components/dashboard/weather-history-table";

const CHART_PERIODS = [
    { value: "12", label: "Últimas 12h" },
    { value: "24", label: "Últimas 24h" },
    { value: "48", label: "Últimas 48h" },
    { value: "all", label: "Todos" },
];

const TABLE_LIMITS = [
    { value: "5", label: "5 registros" },
    { value: "10", label: "10 registros" },
    { value: "20", label: "20 registros" },
    { value: "50", label: "50 registros" },
];

export function DashboardPage() {
    const {
        logs,
        insightsData,
        isLoading,
        loadLogs,
        filters
    } = useWeatherDashboard();

    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Dashboard Climático</h2>
                    <p className="text-muted-foreground">
                        Monitoramento em tempo real e insights inteligentes
                    </p>
                </div>
                <Button
                    onClick={() => loadLogs()}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Atualizar
                </Button>
            </div>

            {/* KPI Cards Grid */}
            <FlipStatGrid
                logs={logs}
                insightsData={insightsData}
                isLoading={isLoading}
            />

            {/* Charts Section */}
            {logs.length > 0 && (
                <WeatherCharts
                    logs={logs}
                    period={filters.chartPeriod}
                    onPeriodChange={filters.setChartPeriod}
                    chartPeriods={CHART_PERIODS}
                />
            )}

            {/* Logs Table */}
            {logs.length > 0 && (
                <WeatherHistoryTable
                    logs={logs}
                    limit={filters.tableLimit}
                    onLimitChange={filters.setTableLimit}
                    tableLimits={TABLE_LIMITS}
                />
            )}
        </div>
    );
}
