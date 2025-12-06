import { Injectable, Logger } from "@nestjs/common";
import {
    SolarProjectRepository,
} from "../../domain/repositories/solar-project-repository.interface";
import {
    SolarProject,
    PaginatedSolarProjects,
} from "../../domain/entities/solar-project.entity";

interface ANEELRecord {
    _id: number;
    DatGeracaoConjuntoDados: string;
    NomEmpreendimento: string;
    IdeNucleoCEG: string;
    CodCEG: string;
    SigUFPrincipal: string;
    SigTipoGeracao: string;
    DscFaseUsina: string;
    DscOrigemCombustivel: string;
    DscFonteCombustivel: string;
    DscTipoOutorga: string;
    NomFonteCombustivel: string;
    DatEntradaOperacao: string | null;
    MdaPotenciaOutorgadaKw: string | null;
    MdaPotenciaFiscalizadaKw: string | null;
    MdaGarantiaFisicaKw: string | null;
    IdcGeracaoQualificada: string | null;
    NumCoordNEmpreendimento: string | null;
    NumCoordEEmpreendimento: string | null;
    DatInicioVigencia: string | null;
    DatFimVigencia: string | null;
    DscPropriRegimePariticipacao: string | null;
    DscSubBacia: string | null;
    DscMuninicpios: string | null;
}

interface ANEELResponse {
    success: boolean;
    result: {
        records: ANEELRecord[];
        total: number;
    };
}

@Injectable()
export class ANEELSolarProjectRepository implements SolarProjectRepository {
    private readonly logger = new Logger(ANEELSolarProjectRepository.name);
    private readonly baseUrl = "https://dadosabertos.aneel.gov.br/api/3/action/datastore_search";
    private readonly resourceId = "2f65a1b0-19b8-4360-8238-b34ab4693d55";

    async findAll(
        page: number = 1,
        limit: number = 10,
        state?: string
    ): Promise<PaginatedSolarProjects> {
        const offset = (page - 1) * limit;

        const params = new URLSearchParams({
            resource_id: this.resourceId,
            limit: limit.toString(),
            offset: offset.toString(),
        });

        const filters: Record<string, string> = {
            SigTipoGeracao: "UFV",
        };

        if (state) {
            filters.SigUFPrincipal = state;
        }

        params.append("filters", JSON.stringify(filters));

        const url = `${this.baseUrl}?${params.toString()}`;

        try {
            this.logger.log(`Fetching solar projects from ANEEL: ${url}`);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`ANEEL API error: ${response.status} ${response.statusText}`);
            }

            const data: ANEELResponse = await response.json();

            if (!data.success) {
                throw new Error("ANEEL API returned unsuccessful response");
            }

            const projects: SolarProject[] = data.result.records.map((r) => this.mapToEntity(r));
            const total = data.result.total;

            return {
                data: projects,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            this.logger.error(`Failed to fetch solar projects: ${error}`);
            throw error;
        }
    }

    private mapToEntity(r: ANEELRecord): SolarProject {
        return {
            id: r._id,
            name: r.NomEmpreendimento || "Sem nome",
            cegCode: r.CodCEG || "",
            cegNucleoId: r.IdeNucleoCEG || "",
            state: r.SigUFPrincipal || "",
            municipality: r.DscMuninicpios || "",
            generationType: r.SigTipoGeracao || "",
            phase: r.DscFaseUsina || "",
            fuelOrigin: r.DscOrigemCombustivel || "",
            fuelSource: r.DscFonteCombustivel || "",
            grantType: r.DscTipoOutorga || "",
            operationDate: r.DatEntradaOperacao || null,
            grantedPowerKw: this.parseNumber(r.MdaPotenciaOutorgadaKw),
            inspectedPowerKw: this.parseNumber(r.MdaPotenciaFiscalizadaKw),
            physicalGuaranteeKw: this.parseNumber(r.MdaGarantiaFisicaKw),
            qualifiedGeneration: r.IdcGeracaoQualificada || null,
            latitude: this.parseNumber(r.NumCoordNEmpreendimento),
            longitude: this.parseNumber(r.NumCoordEEmpreendimento),
            startDate: r.DatInicioVigencia || null,
            endDate: r.DatFimVigencia || null,
            owner: r.DscPropriRegimePariticipacao || null,
            subBasin: r.DscSubBacia || null,
            dataGenerationDate: r.DatGeracaoConjuntoDados || null,
        };
    }

    private parseNumber(value: string | null): number | null {
        if (!value) return null;
        const cleaned = value.replace(",", ".");
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }
}
