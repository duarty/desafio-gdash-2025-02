import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { WeatherModule } from "./weather/weather.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { SolarProjectsModule } from "./solar-projects/solar-projects.module";
import { AdminSeeder } from "./seeders/admin.seeder";
import { MongooseUserRepository } from "./users/infrastructure/persistence/mongoose/repositories/mongoose-user-repository";
import { User, UserSchema } from "./users/infrastructure/persistence/mongoose/schemas/user.schema";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
      "mongodb://admin:password@mongodb:27017/gdash_solar?authSource=admin",
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    WeatherModule,
    UsersModule,
    AuthModule,
    SolarProjectsModule,
  ],
  controllers: [],
  providers: [MongooseUserRepository, AdminSeeder],
})
export class AppModule { }

