import { GoogleGenAI } from "@google/genai";

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;
const AI_TIMEOUT_MS = 30_000;

const requestCounts = new Map<string, { count: number; resetAt: number }>();

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function checkRateLimit(ip: string): void {
  const now = Date.now();
  const current = requestCounts.get(ip);

  if (!current || current.resetAt <= now) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    throw new ApiError("Too many requests. Please try again in a minute.", 429);
  }

  current.count += 1;
}

export async function withTimeout<T>(promise: Promise<T>, message = "The AI service took too long to respond."): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new ApiError(message, 504)), AI_TIMEOUT_MS);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new ApiError("The AI service is not configured yet. Please try again later.", 503);
  }

  return new GoogleGenAI({ apiKey });
}

export function getModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-flash-lite-latest";
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }

  console.error("AI route error:", error);
  const providerStatus = typeof error === "object" && error !== null && "status" in error
    ? Number(error.status)
    : 0;
  if (providerStatus === 401 || providerStatus === 403) {
    return Response.json({ error: "The Gemini API key was rejected. Check GEMINI_API_KEY in your server environment." }, { status: 502 });
  }
  if (providerStatus === 429 || providerStatus === 503) {
    return Response.json({ error: "Gemini is temporarily busy. Please try again in a few seconds." }, { status: 503 });
  }
  return Response.json({ error: "The AI service is temporarily unavailable. Please try again shortly." }, { status: 502 });
}
