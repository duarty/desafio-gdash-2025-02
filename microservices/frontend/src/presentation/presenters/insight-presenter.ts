export type InsightType = "temp" | "humidity" | "wind" | "condition";

export class InsightPresenter {
    /**
     * Filters the raw insights list to find the most relevant one for the given card type.
     * @param insights Raw array of insight strings
     * @param type The type of card (temp, humidity, wind, or condition)
     * @returns The most relevant insight string, or undefined if none found
     */
    static getInsightForType(insights: string[] | undefined, type: InsightType): string | undefined {
        if (!insights || insights.length === 0) return undefined;

        switch (type) {
            case "temp":
                return insights.find(i =>
                    i.includes("temperatura") || i.includes("°C") || i.includes("calor") ||
                    i.includes("frio") || i.includes("quente") || i.includes("📈") ||
                    i.includes("📉") || i.includes("🔥") || i.includes("❄️") || i.includes("☀️")
                );
            case "humidity":
                return insights.find(i =>
                    i.includes("umidade") || i.includes("%") || i.includes("💧") ||
                    i.includes("💦") || i.includes("seco") || i.includes("úmido")
                );
            case "wind":
                return insights.find(i =>
                    i.includes("vento") || i.includes("km/h") || i.includes("💨") ||
                    i.includes("🌬️") || i.includes("brisa")
                );
            case "condition":
                return insights.find(i =>
                    i.includes("condição") || i.includes("céu") || i.includes("☁️") ||
                    i.includes("🌤️") || i.includes("🌧️") || i.includes("sol") ||
                    i.includes("chuva") || i.includes("nublado")
                ) || insights[insights.length - 1]; // Fallback to last insight for condition
            default:
                return undefined;
        }
    }
}
