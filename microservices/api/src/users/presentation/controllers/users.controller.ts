import { Controller, Post, Body, Get } from "@nestjs/common";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { GetUsersUseCase } from "../../application/use-cases/get-users.use-case";
import { CreateUserDto } from "../dtos/create-user.dto";
import { User } from "../../domain/entities/user.entity";

@Controller("users")
export class UsersController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly getUsersUseCase: GetUsersUseCase,
    ) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<void> {
        return this.createUserUseCase.execute(createUserDto);
    }

    @Get()
    async findAll(): Promise<User[]> {
        return this.getUsersUseCase.execute();
    }
}
