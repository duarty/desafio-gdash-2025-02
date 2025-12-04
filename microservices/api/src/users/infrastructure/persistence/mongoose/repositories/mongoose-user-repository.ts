import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRepository } from "../../../../domain/repositories/user-repository.interface";
import { User as UserEntity } from "../../../../domain/entities/user.entity";
import { User, UserDocument } from "../schemas/user.schema";

@Injectable()
export class MongooseUserRepository implements UserRepository {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }

    async create(user: Omit<UserEntity, "id" | "createdAt">): Promise<void> {
        const createdUser = new this.userModel({
            name: user.name,
            email: user.email,
            passwordHash: user.passwordHash,
        });
        await createdUser.save();
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await this.userModel.find().exec();
        return users.map(this.toDomain);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await this.userModel.findOne({ email }).exec();
        return user ? this.toDomain(user) : null;
    }

    async delete(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id).exec();
    }

    private toDomain(userDoc: UserDocument): UserEntity {
        return new UserEntity(
            userDoc._id.toString(),
            userDoc.name,
            userDoc.email,
            userDoc.passwordHash,
            userDoc.createdAt,
        );
    }
}
