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

const studyRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(12_000),
      }),
    )
    .min(1)
    .max(50),
  mode: z.enum(["doubt", "summarize"]),
});

export async function POST(request: Request): Promise<Response> {
  try {
    checkRateLimit(getClientIp(request));

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError("Please send a valid JSON request.", 400);
    }

    const input = studyRequestSchema.safeParse(body);
    if (!input.success) {
      throw new ApiError("Please provide messages and choose either doubt or summarize mode.", 400);
    }

    const ai = getGeminiClient();
    const contents = input.data.messages.map((message) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));
    const stream = await withTimeout(
      ai.models.generateContentStream({
        model: getModelName(),
        contents,
        config: {
          systemInstruction:
            input.data.mode === "doubt"
              ? "You are a friendly college study assistant. Explain concepts clearly, use examples, and be concise."
              : "You are a study-notes summarizer. Extract the most important concepts, definitions, formulas, and action items in clear plain text.",
        },
      }),
      "The AI service took too long to start responding.",
    );

    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          const iterator = stream[Symbol.asyncIterator]();
          while (true) {
            const result = await withTimeout(
              iterator.next(),
              "The AI service stopped responding. Please try again.",
            );
            if (result.done) break;
            const chunk = result.value;
            const text = chunk.text;
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
