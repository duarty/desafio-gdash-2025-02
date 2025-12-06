import { WeatherLog } from "../../domain/entities/weather-log.entity";
import { WeatherRepository } from "../../domain/repositories/weather-repository.interface";
import { GeminiService } from "../../infrastructure/services/gemini.service";
import { GeocodingService } from "../../infrastructure/services/geocoding.service";

export interface InsightsResponse {
  insights: string[];
  source: "gemini" | "local";
  generatedAt: string;
}

export class GenerateInsightsUseCase {
  constructor(
    private readonly weatherRepository: WeatherRepository,
    private readonly geminiService?: GeminiService,
    private readonly geocodingService?: GeocodingService
  ) { }

  async execute(): Promise<InsightsResponse> {
    const logs = await this.weatherRepository.findAll();
    const generatedAt = new Date().toISOString();

    if (logs.length === 0) {
      return {
        insights: ["Ainda não há dados climáticos suficientes para gerar insights."],
        source: "local",
        generatedAt,
      };
    }

    // Try AI-powered insights first
    if (this.geminiService) {
      const aiInsights = await this.generateAIInsights(logs);
      if (aiInsights && aiInsights.length > 0) {
        return {
          insights: aiInsights,
          source: "gemini",
          generatedAt,
        };
      }
    }

    // Fallback to local insights
    return {
      insights: this.generateLocalInsights(logs),
      source: "local",
      generatedAt,
    };
  }

  private async generateAIInsights(logs: WeatherLog[]): Promise<string[] | null> {
    const recentLogs = logs.slice(0, 24); // Last 24 records
    const latest = logs[0];

    // Calculate stats for context
    const temps = recentLogs.map((l) => l.temperature);
    const humidities = recentLogs.map((l) => l.humidity);
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const avgHumidity = humidities.reduce((a, b) => a + b, 0) / humidities.length;
    const minTemp = Math.min(...temps);
    const maxTemp = Math.max(...temps);

    const now = new Date();
    const formattedDate = now.toLocaleString("pt-BR", {
      dateStyle: "full",
      timeStyle: "short",
    });

    let locationInfo = `Lat ${latest.latitude.toFixed(2)}, Lon ${latest.longitude.toFixed(2)}`;

    // Attempt to get city/state name if geocoding service is available
    if (this.geocodingService) {
      const locationName = await this.geocodingService.getLocationName(latest.latitude, latest.longitude);
      if (locationName) {
        locationInfo += ` (${locationName})`;
      }
    }

    const prompt = `Você é um assistente de análise climática. Analise os seguintes dados meteorológicos e gere exatamente 5 insights curtos e úteis em português brasileiro.

CONTEXTO TEMPORAL:
- Data e Hora Atual: ${formattedDate}
- Considere se é dia ou noite para dar recomendações apropriadas (ex: protetor solar vs agasalho noturno).

LOCALIZAÇÃO:
- ${locationInfo}
- Se houver nome da cidade/estado acima, personalize os insights para o clima típico dessa região se relevante.

DADOS ATUAIS:
- Temperatura: ${latest.temperature}°C
- Umidade: ${latest.humidity}%
- Velocidade do vento: ${latest.windSpeed} km/h
- Condição: ${latest.condition}

ESTATÍSTICAS DAS ÚLTIMAS ${recentLogs.length} LEITURAS:
- Temperatura média: ${avgTemp.toFixed(1)}°C
- Temperatura mínima: ${minTemp}°C
- Temperatura máxima: ${maxTemp}°C
- Umidade média: ${avgHumidity.toFixed(1)}%

INSTRUÇÕES:
1. Gere exatamente 5 insights
2. Cada insight deve ter no máximo 100 caracteres
3. Use emojis relevantes no início de cada insight
4. Foque em informações práticas e úteis
5. Inclua tendências, alertas e recomendações
6. Responda APENAS com os 5 insights, um por linha, sem numeração

Exemplo de formato:
☀️ Temperatura agradável para atividades ao ar livre
💧 Umidade elevada pode causar desconforto
📈 Tendência de aumento de temperatura nas próximas horas`;

    try {
      const response = await this.geminiService!.generateInsights(prompt);
      if (!response) return null;

      // Parse response - split by lines and clean up
      const insights = response
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && line.length < 200)
        .slice(0, 6);

      return insights.length > 0 ? insights : null;
    } catch (error) {
      return null;
    }
  }

  private generateLocalInsights(logs: WeatherLog[]): string[] {
    const insights: string[] = [];
    const latest = logs[0];
    const recentLogs = logs.slice(0, 12);

    // Temperature insights in Portuguese
    if (latest.temperature > 35) {
      insights.push("🔥 Calor extremo! Mantenha-se hidratado e evite exposição prolongada ao sol.");
    } else if (latest.temperature > 30) {
      insights.push("☀️ Temperatura elevada. Recomendado uso de protetor solar e roupas leves.");
    } else if (latest.temperature > 25) {
      insights.push("🌤️ Temperatura agradável para atividades ao ar livre.");
    } else if (latest.temperature < 15) {
      insights.push("❄️ Temperatura baixa. Vista roupas quentes.");
    } else if (latest.temperature < 10) {
      insights.push("🥶 Frio intenso! Proteja-se adequadamente.");
    } else {
      insights.push("✅ Temperatura em níveis confortáveis.");
    }

    // Humidity insights
    if (latest.humidity > 80) {
      insights.push("💧 Umidade muito alta. Sensação térmica pode ser maior que a temperatura real.");
    } else if (latest.humidity > 60) {
      insights.push("💦 Umidade moderada a alta.");
    } else if (latest.humidity < 30) {
      insights.push("🏜️ Ar seco. Mantenha-se hidratado.");
    }

    // Wind insights
    if (latest.windSpeed > 40) {
      insights.push("💨 Ventos fortes! Cuidado com objetos soltos.");
    } else if (latest.windSpeed > 20) {
      insights.push("🌬️ Ventos moderados ajudam a amenizar o calor.");
    }

    // Temperature trend
    if (recentLogs.length >= 3) {
      const temps = recentLogs.slice(0, 3).map((l) => l.temperature);
      const avgRecent = temps.reduce((a, b) => a + b, 0) / temps.length;
      const olderTemps = recentLogs.slice(3, 6).map((l) => l.temperature);
      if (olderTemps.length > 0) {
        const avgOlder = olderTemps.reduce((a, b) => a + b, 0) / olderTemps.length;
        if (avgRecent > avgOlder + 2) {
          insights.push("📈 Tendência de aumento de temperatura.");
        } else if (avgRecent < avgOlder - 2) {
          insights.push("📉 Tendência de queda de temperatura.");
        }
      }
    }

    // Average stats
    if (recentLogs.length >= 3) {
      const temps = recentLogs.map((l) => l.temperature);
      const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
      insights.push(`📊 Temperatura média recente: ${avg.toFixed(1)}°C`);
    }

    return insights.slice(0, 6);
  }
}
