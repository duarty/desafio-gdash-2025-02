import type { SolarProjectRepository } from "../../domain/repositories/solar-project-repository";
import type { PaginatedSolarProjects } from "../../domain/models/solar-project";
import { api } from "../api/client";

export class HttpSolarProjectRepository implements SolarProjectRepository {
    async getProjects(
        page: number = 1,
        limit: number = 10,
        state?: string
    ): Promise<PaginatedSolarProjects> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
        });

        if (state) {
            params.append("state", state);
        }

        const response = await api.get<PaginatedSolarProjects>(
            `/solar-projects?${params.toString()}`
        );
        return response.data;
    }
}
