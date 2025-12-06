import { Injectable, Logger } from "@nestjs/common";

interface NominatimResponse {
    address: {
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        country?: string;
    };
    display_name: string;
}

@Injectable()
export class GeocodingService {
    private readonly logger = new Logger(GeocodingService.name);
    private readonly userAgent = "GDash-Weather-App/1.0 (duartydev@example.com)";
    private readonly baseUrl = "https://nominatim.openstreetmap.org/reverse";
    private cache = new Map<string, string>();

    async getLocationName(lat: number, lon: number): Promise<string | null> {
        const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;

        if (this.cache.has(key)) {
            return this.cache.get(key) || null;
        }

        try {
            const url = `${this.baseUrl}?format=json&lat=${lat}&lon=${lon}`;

            const response = await fetch(url, {
                headers: {
                    "User-Agent": this.userAgent,
                },
            });

            if (!response.ok) {
                this.logger.warn(`Nominatim API error: ${response.status}`);
                return null;
            }

            const data: NominatimResponse = await response.json();

            const city = data.address.city || data.address.town || data.address.village;
            const state = data.address.state;
            const country = data.address.country;

            let locationName = "";
            if (city && state) {
                locationName = `${city}, ${state}`;
            } else if (state && country) {
                locationName = `${state}, ${country}`;
            } else {
                locationName = data.display_name.split(",").slice(0, 2).join(",");
            }

            this.cache.set(key, locationName);
            return locationName;

        } catch (error) {
            this.logger.error(`Failed to geocode location: ${error}`);
            return null;
        }
    }
}
