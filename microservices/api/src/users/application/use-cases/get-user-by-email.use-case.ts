import { Injectable, Inject } from "@nestjs/common";
import { UserRepository } from "../../domain/repositories/user-repository.interface";
import { User } from "../../domain/entities/user.entity";
import { MongooseUserRepository } from "../../infrastructure/persistence/mongoose/repositories/mongoose-user-repository";

@Injectable()
export class GetUserByEmailUseCase {
    constructor(
        @Inject(MongooseUserRepository)
        private readonly userRepository: UserRepository,
    ) { }

    async execute(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }
}
