import { Inject, Injectable } from "@nestjs/common";
import {
    SolarProjectRepository,
    SOLAR_PROJECT_REPOSITORY,
} from "../../domain/repositories/solar-project-repository.interface";
import { PaginatedSolarProjects } from "../../domain/entities/solar-project.entity";

@Injectable()
export class GetSolarProjectsUseCase {
    constructor(
        @Inject(SOLAR_PROJECT_REPOSITORY)
        private readonly solarProjectRepository: SolarProjectRepository
    ) { }

    async execute(
        page: number = 1,
        limit: number = 10,
        state?: string
    ): Promise<PaginatedSolarProjects> {
        // Validate and sanitize inputs
        const sanitizedPage = Math.max(1, page);
        const sanitizedLimit = Math.min(Math.max(1, limit), 100); // Max 100 per page

        return this.solarProjectRepository.findAll(
            sanitizedPage,
            sanitizedLimit,
            state
        );
    }
}
