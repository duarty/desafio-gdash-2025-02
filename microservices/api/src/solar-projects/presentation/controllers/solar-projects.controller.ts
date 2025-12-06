import { Controller, Get, Query } from "@nestjs/common";
import { GetSolarProjectsUseCase } from "../../application/use-cases/get-solar-projects.use-case";
import { PaginatedSolarProjects } from "../../domain/entities/solar-project.entity";

@Controller("solar-projects")
export class SolarProjectsController {
    constructor(
        private readonly getSolarProjectsUseCase: GetSolarProjectsUseCase
    ) { }

    @Get()
    async findAll(
        @Query("page") page?: string,
        @Query("limit") limit?: string,
        @Query("state") state?: string
    ): Promise<PaginatedSolarProjects> {
        return this.getSolarProjectsUseCase.execute(
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            state
        );
    }
}
