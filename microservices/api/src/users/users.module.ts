import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./presentation/controllers/users.controller";
import { CreateUserUseCase } from "./application/use-cases/create-user.use-case";
import { GetUsersUseCase } from "./application/use-cases/get-users.use-case";
import { GetUserByEmailUseCase } from "./application/use-cases/get-user-by-email.use-case";
import { MongooseUserRepository } from "./infrastructure/persistence/mongoose/repositories/mongoose-user-repository";
import { User, UserSchema } from "./infrastructure/persistence/mongoose/schemas/user.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UsersController],
    providers: [
        MongooseUserRepository,
        {
            provide: CreateUserUseCase,
            useFactory: (repo: MongooseUserRepository) => new CreateUserUseCase(repo),
            inject: [MongooseUserRepository],
        },
        {
            provide: GetUsersUseCase,
            useFactory: (repo: MongooseUserRepository) => new GetUsersUseCase(repo),
            inject: [MongooseUserRepository],
        },
        {
            provide: GetUserByEmailUseCase,
            useFactory: (repo: MongooseUserRepository) => new GetUserByEmailUseCase(repo),
            inject: [MongooseUserRepository],
        },
    ],
    exports: [CreateUserUseCase, GetUsersUseCase, GetUserByEmailUseCase],
})
export class UsersModule { }
