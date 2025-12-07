import { describe, it, expect } from 'vitest';
import { InsightPresenter } from './insight-presenter';

describe('InsightPresenter', () => {
    describe('getInsightForType', () => {
        const mockInsights = [
            "🔥 Calor extremo! Temperatura acima de 35°C.",
            "💧 Umidade baixa (20%). Beba água.",
            "💨 Vento forte a 45km/h.",
            "🌤️ O céu está parcialmente nublado."
        ];

        it('should return undefined if insights array is empty or undefined', () => {
            expect(InsightPresenter.getInsightForType([], 'temp')).toBeUndefined();
            expect(InsightPresenter.getInsightForType(undefined, 'temp')).toBeUndefined();
        });

        it('should find temperature insight based on keywords', () => {
            const result = InsightPresenter.getInsightForType(mockInsights, 'temp');
            expect(result).toBe("🔥 Calor extremo! Temperatura acima de 35°C.");
        });

        it('should find humidity insight based on keywords', () => {
            const result = InsightPresenter.getInsightForType(mockInsights, 'humidity');
            expect(result).toBe("💧 Umidade baixa (20%). Beba água.");
        });

        it('should find wind insight based on keywords', () => {
            const result = InsightPresenter.getInsightForType(mockInsights, 'wind');
            expect(result).toBe("💨 Vento forte a 45km/h.");
        });

        it('should find condition insight based on keywords', () => {
            const result = InsightPresenter.getInsightForType(mockInsights, 'condition');
            expect(result).toBe("🌤️ O céu está parcialmente nublado.");
        });

        it('should fallback to last insight for condition if no keyword matches', () => {
            const genericInsights = ["Insight 1", "Insight 2", "Last Insight"];
            // "condition" logic has a fallback
            const result = InsightPresenter.getInsightForType(genericInsights, 'condition');
            expect(result).toBe("Last Insight");
        });

        it('should return undefined for other types if no match found', () => {
            const noMatchInsights = ["Apenas um texto qualquer"];
            expect(InsightPresenter.getInsightForType(noMatchInsights, 'temp')).toBeUndefined();
        });
    });
});
