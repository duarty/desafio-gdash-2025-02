import { Injectable } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user-repository.interface";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class GetUsersUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}
