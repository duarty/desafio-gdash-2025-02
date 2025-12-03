export class WeatherLog {
    constructor(
        public readonly id: string,
        public readonly latitude: number,
        public readonly longitude: number,
        public readonly timestamp: Date,
        public readonly temperature: number,
        public readonly humidity: number,
        public readonly windSpeed: number,
        public readonly cloudCover: number,
        public readonly shortwaveRadiation: number,
        public readonly directNormalIrradiance: number,
        public readonly diffuseRadiation: number,
        public readonly globalTiltedIrradiance: number,
        public readonly sunshineDuration: number,
        public readonly condition: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,
    ) { }
}
