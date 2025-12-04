import { Injectable, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserRepository } from "../../domain/repositories/user-repository.interface";
import { User } from "../../domain/entities/user.entity";
import { CreateUserDto } from "../../presentation/dtos/create-user.dto";


@Injectable()
export class CreateUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(dto: CreateUserDto): Promise<void> {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException("User with this email already exists");
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(dto.password, salt);

        await this.userRepository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
        });
    }
}
