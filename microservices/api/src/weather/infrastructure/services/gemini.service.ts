import { Injectable, Logger } from "@nestjs/common";

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
    error?: {
        message: string;
    };
}

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private readonly baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    async generateInsights(prompt: string): Promise<string | null> {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            this.logger.warn("GEMINI_API_KEY not configured, skipping AI insights");
            return null;
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey,
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`Gemini API error: ${response.status} - ${errorText}`);
                return null;
            }

            const data: GeminiResponse = await response.json();

            if (data.error) {
                this.logger.error(`Gemini API error: ${data.error.message}`);
                return null;
            }

            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            return text || null;
        } catch (error) {
            this.logger.error(`Failed to call Gemini API: ${error}`);
            return null;
        }
    }
}
