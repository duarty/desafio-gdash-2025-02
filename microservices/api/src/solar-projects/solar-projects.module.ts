import { Module } from "@nestjs/common";
import { SolarProjectsController } from "./presentation/controllers/solar-projects.controller";
import { GetSolarProjectsUseCase } from "./application/use-cases/get-solar-projects.use-case";
import { ANEELSolarProjectRepository } from "./infrastructure/repositories/aneel-solar-project.repository";
import { SOLAR_PROJECT_REPOSITORY } from "./domain/repositories/solar-project-repository.interface";

@Module({
    controllers: [SolarProjectsController],
    providers: [
        GetSolarProjectsUseCase,
        {
            provide: SOLAR_PROJECT_REPOSITORY,
            useClass: ANEELSolarProjectRepository,
        },
    ],
    exports: [GetSolarProjectsUseCase],
})
export class SolarProjectsModule { }
