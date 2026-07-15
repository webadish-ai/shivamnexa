import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { NextResponse } from "next/server";
import { salesAgent } from "@/lib/chatbot/agent";

export const runtime = "nodejs";
export const maxDuration = 60;

// Best-effort per-IP throttle (per warm instance) to cap token spend from abuse.
const RATE_LIMIT = 30; // messages
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear();
  return recent.length > RATE_LIMIT;
}

const MAX_MESSAGES = 40;
const MAX_TEXT_LENGTH = 2000;

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim();
  if (ip && isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please call us at 8828199999 instead." },
      { status: 429 }
    );
  }

  const { messages } = (await request.json()) as { messages: UIMessage[] };

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Invalid conversation." }, { status: 400 });
  }
  for (const message of messages) {
    for (const part of message.parts ?? []) {
      if (part.type === "text" && part.text.length > MAX_TEXT_LENGTH) {
        return NextResponse.json({ error: "Message too long." }, { status: 400 });
      }
    }
  }

  return createAgentUIStreamResponse({
    agent: salesAgent,
    uiMessages: messages,
  });
}
