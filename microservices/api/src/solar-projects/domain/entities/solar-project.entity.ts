export interface SolarProject {
    id: number;
    name: string;
    cegCode: string;
    state: string;
    municipality: string;
    generationType: string;
    phase: string;
    fuelSource: string;
    grantType: string;
    operationDate: string | null;
    grantedPowerKw: number | null;
    inspectedPowerKw: number | null;
    latitude: number | null;
    longitude: number | null;
    startDate: string | null;
    endDate: string | null;
    owner: string | null;
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
