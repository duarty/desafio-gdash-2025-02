import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { MongooseUserRepository } from "../users/infrastructure/persistence/mongoose/repositories/mongoose-user-repository";

@Injectable()
export class AdminSeeder implements OnModuleInit {
    private readonly logger = new Logger(AdminSeeder.name);

    constructor(private readonly userRepository: MongooseUserRepository) { }

    async onModuleInit(): Promise<void> {
        await this.seedAdminUser();
    }

    private async seedAdminUser(): Promise<void> {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "admin@admin.com";
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "123456";
        const adminName = process.env.DEFAULT_ADMIN_NAME || "Administrador";

        const existingAdmin = await this.userRepository.findByEmail(adminEmail);

        if (existingAdmin) {
            this.logger.log(`Admin user already exists: ${adminEmail}`);
            return;
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(adminPassword, salt);

        await this.userRepository.create({
            name: adminName,
            email: adminEmail,
            passwordHash,
        });

        this.logger.log(`Admin user created successfully: ${adminEmail}`);
    }
}
