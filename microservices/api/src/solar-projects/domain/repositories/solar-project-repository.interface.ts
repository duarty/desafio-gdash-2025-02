import { PaginatedSolarProjects } from "../entities/solar-project.entity";

export interface SolarProjectRepository {
    findAll(page: number, limit: number, state?: string): Promise<PaginatedSolarProjects>;
}

export const SOLAR_PROJECT_REPOSITORY = "SOLAR_PROJECT_REPOSITORY";
