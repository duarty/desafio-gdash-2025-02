import { useEffect, useState, useMemo } from "react";
import { HttpSolarProjectRepository } from "../../infrastructure/repositories/http-solar-project-repository";
import type { PaginatedSolarProjects } from "../../domain/models/solar-project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Sun, ChevronLeft, ChevronRight, Zap } from "lucide-react";

// Brazilian states
const BRAZILIAN_STATES = [
    { value: "", label: "Todos os Estados" },
    { value: "RR", label: "Roraima" },
    { value: "AM", label: "Amazonas" },
    { value: "PA", label: "Pará" },
    { value: "AC", label: "Acre" },
    { value: "RO", label: "Rondônia" },
    { value: "TO", label: "Tocantins" },
    { value: "MA", label: "Maranhão" },
    { value: "PI", label: "Piauí" },
    { value: "CE", label: "Ceará" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "PB", label: "Paraíba" },
    { value: "PE", label: "Pernambuco" },
    { value: "AL", label: "Alagoas" },
    { value: "SE", label: "Sergipe" },
    { value: "BA", label: "Bahia" },
    { value: "MG", label: "Minas Gerais" },
    { value: "ES", label: "Espírito Santo" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "SP", label: "São Paulo" },
    { value: "PR", label: "Paraná" },
    { value: "SC", label: "Santa Catarina" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MT", label: "Mato Grosso" },
    { value: "GO", label: "Goiás" },
    { value: "DF", label: "Distrito Federal" },
];

export function SolarProjectsPage() {
    const [data, setData] = useState<PaginatedSolarProjects | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [stateFilter, setStateFilter] = useState("RR");
    const repository = useMemo(() => new HttpSolarProjectRepository(), []);

    useEffect(() => {
        fetchProjects();
    }, [page, stateFilter]);

    async function fetchProjects() {
        setIsLoading(true);
        try {
            const result = await repository.getProjects(page, limit, stateFilter || undefined);
            setData(result);
        } catch (error) {
            console.error("Failed to fetch solar projects:", error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleStateChange(value: string) {
        setStateFilter(value === "all" ? "" : value);
        setPage(1);
    }

    function formatPower(powerKw: number | null): string {
        if (!powerKw) return "—";
        if (powerKw >= 1000) {
            return `${(powerKw / 1000).toFixed(2)} MW`;
        }
        return `${powerKw.toFixed(0)} kW`;
    }

    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Sun className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight">Usinas Solares</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Dados de usinas fotovoltaicas do Brasil (ANEEL/SIGA)
                    </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Select value={stateFilter || "all"} onValueChange={handleStateChange}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {BRAZILIAN_STATES.map((state) => (
                                <SelectItem key={state.value || "all"} value={state.value || "all"}>
                                    {state.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Stats */}
            {data && (
                <div className="grid gap-4 sm:grid-cols-2 mb-8">
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Sun className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total de Usinas</p>
                                    <p className="text-2xl font-semibold">{data.pagination.total.toLocaleString("pt-BR")}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Potência na Página</p>
                                    <p className="text-2xl font-semibold">
                                        {formatPower(data.data.reduce((sum, p) => sum + (p.inspectedPowerKw || 0), 0))}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium">Lista de Usinas Fotovoltaicas</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : !data || data.data.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Nenhuma usina encontrada</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="text-xs">Nome</TableHead>
                                            <TableHead className="text-xs hidden sm:table-cell">UF</TableHead>
                                            <TableHead className="text-xs hidden md:table-cell">Município</TableHead>
                                            <TableHead className="text-xs">Potência</TableHead>
                                            <TableHead className="text-xs hidden lg:table-cell">Fase</TableHead>
                                            <TableHead className="text-xs hidden xl:table-cell">Operação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.data.map((project) => (
                                            <TableRow key={project.id} className="hover:bg-muted/50">
                                                <TableCell>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm truncate max-w-[200px]">{project.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate sm:hidden">
                                                            {project.state} • {project.municipality?.split(" - ")[0]}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary">
                                                        {project.state}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm hidden md:table-cell text-muted-foreground truncate max-w-[150px]">
                                                    {project.municipality?.split(" - ")[0] || "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                        {formatPower(project.inspectedPowerKw)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm hidden lg:table-cell">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${project.phase === "Operação"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                                        }`}>
                                                        {project.phase}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-sm hidden xl:table-cell text-muted-foreground">
                                                    {project.operationDate
                                                        ? new Date(project.operationDate).toLocaleDateString("pt-BR")
                                                        : "—"
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {((page - 1) * limit) + 1} - {Math.min(page * limit, data.pagination.total)} de {data.pagination.total.toLocaleString("pt-BR")}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline ml-1">Anterior</span>
                                    </Button>
                                    <div className="flex items-center gap-1 px-2">
                                        <span className="text-sm font-medium">{page}</span>
                                        <span className="text-sm text-muted-foreground">de</span>
                                        <span className="text-sm font-medium">{data.pagination.totalPages}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                                        disabled={page >= data.pagination.totalPages}
                                    >
                                        <span className="hidden sm:inline mr-1">Próxima</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Info */}
            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border/50">
                <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium">Fonte dos Dados</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Sistema de Informações de Geração da ANEEL (SIGA).
                            Dados atualizados diariamente com usinas fotovoltaicas (UFV) do Brasil.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
