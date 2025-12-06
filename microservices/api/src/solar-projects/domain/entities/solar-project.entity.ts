export interface SolarProject {
    id: number;
    name: string;
    cegCode: string;
    cegNucleoId: string;
    state: string;
    municipality: string;
    generationType: string;
    phase: string;
    fuelOrigin: string;
    fuelSource: string;
    grantType: string;
    operationDate: string | null;
    grantedPowerKw: number | null;
    inspectedPowerKw: number | null;
    physicalGuaranteeKw: number | null;
    qualifiedGeneration: string | null;
    latitude: number | null;
    longitude: number | null;
    startDate: string | null;
    endDate: string | null;
    owner: string | null;
    subBasin: string | null;
    dataGenerationDate: string | null;
}

export interface PaginatedSolarProjects {
    data: SolarProject[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
