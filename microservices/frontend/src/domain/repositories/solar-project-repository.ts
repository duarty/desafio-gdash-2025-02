import type { PaginatedSolarProjects } from "../models/solar-project";

export interface SolarProjectRepository {
    getProjects(page?: number, limit?: number, state?: string): Promise<PaginatedSolarProjects>;
}
