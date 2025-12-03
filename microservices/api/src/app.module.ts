import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { WeatherModule } from "./weather/weather.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI ||
        "mongodb://admin:password@mongodb:27017/gdash_solar?authSource=admin",
    ),
    WeatherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
