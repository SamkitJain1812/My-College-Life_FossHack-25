import { Type } from "@google/genai";
import { z } from "zod";
import {
  ApiError,
  checkRateLimit,
  errorResponse,
  getClientIp,
  getGeminiClient,
  getModelName,
  withTimeout,
} from "@/lib/api";

const travelRequestSchema = z.object({
  destination: z.string().trim().min(1).max(120),
  days: z.number().int().min(1).max(14),
  budget: z.number().finite().nonnegative().max(1_000_000),
  interests: z.array(z.string().trim().min(1).max(60)).max(12),
  startingCity: z.string().trim().min(1).max(120),
});

const travelResponseSchema = z.object({
  summary: z.string(),
  days: z.array(
    z.object({
      day: z.number().int().positive(),
      items: z.array(
        z.object({
          time: z.string(),
          title: z.string(),
          description: z.string(),
          estCost: z.number().finite().nonnegative(),
        }),
      ),
    }),
  ),
  totalEstCost: z.number().finite().nonnegative(),
  tips: z.array(z.string()),
});

const geminiTravelSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                estCost: { type: Type.NUMBER },
              },
              required: ["time", "title", "description", "estCost"],
            },
          },
        },
        required: ["day", "items"],
      },
    },
    totalEstCost: { type: Type.NUMBER },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["summary", "days", "totalEstCost", "tips"],
};

export async function POST(request: Request): Promise<Response> {
  try {
    checkRateLimit(getClientIp(request));

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError("Please send a valid JSON request.", 400);
    }

    const input = travelRequestSchema.safeParse(body);
    if (!input.success) {
      throw new ApiError("Please provide a destination, trip length, budget, interests, and starting city.", 400);
    }

    const ai = getGeminiClient();
    const response = await withTimeout(
      ai.models.generateContent({
        model: getModelName(),
        contents: `Create a practical student travel itinerary from ${input.data.startingCity} to ${input.data.destination}.
Trip length: ${input.data.days} days. Total budget: ${input.data.budget}. Interests: ${input.data.interests.join(", ") || "general sightseeing"}.
Return only the requested JSON. Keep costs realistic and in the same currency as the budget. Include exactly one day entry for each trip day.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: geminiTravelSchema,
        },
      }),
    );

    if (!response.text) {
      throw new ApiError("The AI service returned an empty travel plan. Please try again.", 502);
    }

    let json: unknown;
    try {
      json = JSON.parse(response.text);
    } catch {
      throw new ApiError("The AI service returned an invalid travel plan. Please try again.", 502);
    }

    const parsed = travelResponseSchema.safeParse(json);
    if (!parsed.success) {
      throw new ApiError("The AI service returned an invalid travel plan. Please try again.", 502);
    }

    return Response.json(parsed.data);
  } catch (error) {
    return errorResponse(error);
  }
}
