import { WeatherLog } from "../../domain/entities/weather-log.entity";
import { WeatherRepository } from "../../domain/repositories/weather-repository.interface";
import { GeminiService } from "../../infrastructure/services/gemini.service";
import { GeocodingService } from "../../infrastructure/services/geocoding.service";

export interface InsightsResponse {
  insights: string[];
  source: "gemini" | "local";
  generatedAt: string;
  summary?: string;
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

    if (this.geminiService) {
      const { insights, summary } = await this.generateAIInsights(logs);
      if (insights && insights.length > 0) {
        return {
          insights,
          source: "gemini",
          generatedAt,
          summary,
        };
      }
    }

    const localInsights = this.generateLocalInsights(logs);
    return {
      insights: localInsights,
      source: "local",
      generatedAt,
      summary: `Clima atual: ${logs[0].temperature}°C com ${logs[0].condition}`,
    };
  }

  private async generateAIInsights(logs: WeatherLog[]): Promise<{ insights: string[] | null; summary?: string }> {
    const recentLogs = logs.slice(0, 24);
    const latest = logs[0];

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

    if (this.geocodingService) {
      const locationName = await this.geocodingService.getLocationName(latest.latitude, latest.longitude);
      if (locationName) {
        locationInfo += ` (${locationName})`;
      }
    }

    const prompt = `Você é um assistente de análise climática. Analise os seguintes dados meteorológicos e gere dois tipos de saída em português brasileiro.

CONTEXTO TEMPORAL:
- Data e Hora Atual: ${formattedDate}
- Considere se é dia ou noite.

LOCALIZAÇÃO:
- ${locationInfo}

DADOS ATUAIS:
- Temperatura: ${latest.temperature}°C
- Umidade: ${latest.humidity}%
- Velocidade do vento: ${latest.windSpeed} km/h
- Condição: ${latest.condition}

ESTATÍSTICAS RECENTES:
- Média Temp: ${avgTemp.toFixed(1)}°C
- Mín/Máx Temp: ${minTemp}°C / ${maxTemp}°C

INSTRUÇÕES:
1. Gere um RESUMO curto (1 frase) sobre o clima atual.
2. Gere exatamente 5 INSIGHTS curtos (max 100 caracteres cada) com emojis.

FORMATO DE RESPOSTA OBRIGATÓRIO:
RESUMO: <frase de resumo>
INSIGHTS:
<insight 1>
<insight 2>
<insight 3>
<insight 4>
<insight 5>`;

    try {
      const response = await this.geminiService!.generateInsights(prompt);
      if (!response) return { insights: null };

      const lines = response.split("\n").map(l => l.trim()).filter(l => l.length > 0);
      let summary = "";
      const insights: string[] = [];
      let isInsightsSection = false;

      for (const line of lines) {
        if (line.startsWith("RESUMO:")) {
          summary = line.replace("RESUMO:", "").trim();
        } else if (line.startsWith("INSIGHTS:")) {
          isInsightsSection = true;
        } else if (isInsightsSection) {
          insights.push(line);
        }
      }

      return {
        insights: insights.length > 0 ? insights.slice(0, 5) : null,
        summary: summary || undefined
      };
    } catch (error) {
      return { insights: null };
    }
  }

  private generateLocalInsights(logs: WeatherLog[]): string[] {
    const insights: string[] = [];
    const latest = logs[0];
    const recentLogs = logs.slice(0, 12);

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

    if (latest.humidity > 80) {
      insights.push("💧 Umidade muito alta. Sensação térmica pode ser maior que a temperatura real.");
    } else if (latest.humidity > 60) {
      insights.push("💦 Umidade moderada a alta.");
    } else if (latest.humidity < 30) {
      insights.push("🏜️ Ar seco. Mantenha-se hidratado.");
    }

    if (latest.windSpeed > 40) {
      insights.push("💨 Ventos fortes! Cuidado com objetos soltos.");
    } else if (latest.windSpeed > 20) {
      insights.push("🌬️ Ventos moderados ajudam a amenizar o calor.");
    }

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

    if (recentLogs.length > 0) {
      const temps = recentLogs.map((l) => l.temperature);
      const avg = temps.reduce((a, b) => a + b, 0) / temps.length;
      insights.push(`📊 Temperatura média recente: ${avg.toFixed(1)}°C`);
    }

    return insights.slice(0, 6);
  }
}
