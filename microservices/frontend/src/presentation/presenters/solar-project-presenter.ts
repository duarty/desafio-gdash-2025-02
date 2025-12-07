import type { SolarProject } from "../../domain/models/solar-project";

export class SolarProjectPresenter {
    static readonly BRAZILIAN_STATES = [
        { value: "", label: "Todos os Estados" },
        { value: "RR", label: "Roraima" },
        { value: "AM", label: "Amazonas" },
        { value: "PA", label: "Pará" },
        { value: "AC", label: "Acre" },
        { value: "RO", label: "Rondônia" },
        { value: "TO", label: "Tocantins" },
        { value: "MA", label: "Maranhão" },
        { value: "PI", label: "Piauí" },
        { value: "CE", label: "Ceará" },
        { value: "RN", label: "Rio Grande do Norte" },
        { value: "PB", label: "Paraíba" },
        { value: "PE", label: "Pernambuco" },
        { value: "AL", label: "Alagoas" },
        { value: "SE", label: "Sergipe" },
        { value: "BA", label: "Bahia" },
        { value: "MG", label: "Minas Gerais" },
        { value: "ES", label: "Espírito Santo" },
        { value: "RJ", label: "Rio de Janeiro" },
        { value: "SP", label: "São Paulo" },
        { value: "PR", label: "Paraná" },
        { value: "SC", label: "Santa Catarina" },
        { value: "RS", label: "Rio Grande do Sul" },
        { value: "MS", label: "Mato Grosso do Sul" },
        { value: "MT", label: "Mato Grosso" },
        { value: "GO", label: "Goiás" },
        { value: "DF", label: "Distrito Federal" },
    ];

    /**
     * Formats power in KW to string with appropriate unit (kW or MW)
     * @param powerKw Power in Kilowatts
     * @returns Formatted string (e.g., "500 kW" or "1.50 MW")
     */
    static formatPower(powerKw: number | null | undefined): string {
        if (!powerKw) return "—";
        if (powerKw >= 1000) {
            return `${(powerKw / 1000).toFixed(2)} MW`;
        }
        return `${powerKw.toFixed(0)} kW`;
    }

    /**
     * Calculates total inspected power from a list of solar projects
     * @param projects List of solar projects
     * @returns Total power in KW
     */
    static calculateTotalPower(projects: SolarProject[]): number {
        return projects.reduce((sum, p) => sum + (p.inspectedPowerKw || 0), 0);
    }

    /**
     * Generates a Google Maps URL for the coordinates
     * @param lat Latitude
     * @param lng Longitude
     * @returns URL string or null if coordinates invalid
     */
    static getGoogleMapsUrl(lat: number | null | undefined, lng: number | null | undefined): string | null {
        if (!lat || !lng) return null;
        return `https://www.google.com/maps?q=${lat},${lng}`;
    }

    /**
     * Safe date formatting
     * @param dateStr ISO date string
     * @returns Formatted date or original string/dash on error
     */
    static formatDate(dateStr: string | null | undefined): string {
        if (!dateStr) return "—";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;

            return date.toLocaleDateString("pt-BR", {
                timeZone: 'UTC' // Assuming dates are UTC or relevant to store
            });
        } catch {
            return dateStr;
        }
    }
}
