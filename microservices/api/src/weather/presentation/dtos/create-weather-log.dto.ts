import { Type } from "@sinclair/typebox";

export const CreateWeatherLogDto = Type.Object({
  latitude: Type.Number(),
  longitude: Type.Number(),
  timestamp: Type.String(),
  temperature: Type.Number(),
  humidity: Type.Number(),
  wind_speed: Type.Number(),
  cloud_cover: Type.Number(),
  shortwave_radiation: Type.Number(),
  direct_normal_irradiance: Type.Optional(Type.Number()),
  diffuse_radiation: Type.Optional(Type.Number()),
  global_tilted_irradiance: Type.Optional(Type.Number()),
  sunshine_duration: Type.Optional(Type.Number()),
  condition: Type.String(),
});

export type CreateWeatherLogDto = typeof CreateWeatherLogDto.static;
