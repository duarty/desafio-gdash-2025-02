export interface WeatherLog {
    id: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
    cloudCover: number;
    shortwaveRadiation: number;
    directNormalIrradiance: number;
    diffuseRadiation: number;
    globalTiltedIrradiance: number;
    sunshineDuration: number;
    condition: string;
    createdAt: string;
}
