import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherLogDocument = HydratedDocument<WeatherLog>;

@Schema({ timestamps: true, collection: 'weather_logs' })
export class WeatherLog {
    @Prop({ required: true })
    latitude: number;

    @Prop({ required: true })
    longitude: number;

    @Prop({ required: true })
    timestamp: Date;

    @Prop({ required: true })
    temperature: number;

    @Prop()
    humidity: number;

    @Prop()
    wind_speed: number;

    @Prop()
    cloud_cover: number;

    @Prop()
    shortwave_radiation: number;

    @Prop()
    direct_normal_irradiance: number;

    @Prop()
    diffuse_radiation: number;

    @Prop()
    global_tilted_irradiance: number;

    @Prop()
    sunshine_duration: number;

    @Prop()
    condition: string;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
// Create index for efficient querying by timestamp and location
WeatherLogSchema.index({ timestamp: -1 });
