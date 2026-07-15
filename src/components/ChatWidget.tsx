"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { SalesAgentUIMessage } from "@/lib/chatbot/agent";

const SUGGESTIONS = [
  "Fronx on-road price in Mumbai?",
  "Best 7-seater for family?",
  "Book a free test drive",
  "EMI for Grand Vitara?",
];

// Minimal markdown: [text](url), **bold**, line breaks. Everything else is text.
function renderMarkdown(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    if (match[1] && match[2]) {
      const href = match[2];
      const external = href.startsWith("http");
      nodes.push(
        <a
          key={`${keyPrefix}-${i++}`}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="underline font-medium"
        >
          {match[1]}
        </a>
      );
    } else if (match[3]) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[3]}</strong>);
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat<SalesAgentUIMessage>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <>
      {/* Launcher — sits above the WhatsApp button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with Nexa Buddy"}
        className="fixed right-4 bottom-20 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="text-2xl leading-none">{open ? "✕" : "🤖"}</span>
      </button>

      {open && (
        <div className="fixed z-50 right-0 bottom-0 sm:right-4 sm:bottom-36 w-full sm:w-[380px] h-[100dvh] sm:h-[560px] sm:max-h-[calc(100dvh-10rem)] flex flex-col bg-card border sm:rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-primary text-primary-foreground">
            <span className="text-2xl">🤖</span>
            <div className="flex-1">
              <p className="font-semibold text-sm leading-tight">Nexa Buddy</p>
              <p className="text-xs opacity-80">Shivam NEXA · replies instantly</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="sm:hidden text-xl leading-none px-2"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 max-w-[85%]">
                  Hi! 👋 I&apos;m Nexa Buddy from Shivam NEXA. Ask me about any NEXA
                  car — prices, EMI, test drives — in English, Hindi or Marathi.
                </div>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-full border px-3 py-1.5 text-xs hover:bg-accent transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");
              if (!text) return null;
              return message.role === "user" ? (
                <div key={message.id} className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-4 py-2.5 max-w-[85%] whitespace-pre-wrap">
                    {text}
                  </div>
                </div>
              ) : (
                <div key={message.id} className="flex">
                  <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 max-w-[85%] whitespace-pre-wrap">
                    {renderMarkdown(text, message.id)}
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="flex">
                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-muted-foreground animate-pulse">
                  typing…
                </div>
              </div>
            )}

            {error && !busy && (
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 max-w-[85%]">
                Sorry, I&apos;m having trouble right now. Please call us at{" "}
                <a href="tel:8828199999" className="underline font-medium">
                  8828199999
                </a>{" "}
                or{" "}
                <a
                  href="https://wa.me/918828199999?text=Hi, I need help with a NEXA car"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  WhatsApp us
                </a>
                .
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="border-t p-3 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Ask about any NEXA car…"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-md bg-primary text-primary-foreground px-4 text-sm font-medium disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
