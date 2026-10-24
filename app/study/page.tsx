"use client";

import * as React from "react";
import { Bot, Copy, FileText, Plus, Send, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STORAGE_KEYS, storage, useLocalStorage } from "@/lib/storage";
import type { ChatMessage, ChatSession } from "@/lib/types";

type StudyMode = "doubt" | "summarize";
type DisplayMessage = Pick<ChatMessage, "role" | "content" | "timestamp">;

const starters = [
  "Explain Dijkstra's Algorithm with a simple analogy",
  "Help me understand this concept step by step",
  "Create five practice questions for my next quiz",
  "Review my answer and point out any gaps",
];

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function MarkdownText({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/);
  return (
    <div className="space-y-3 text-sm leading-6">
      {blocks.map((block, index) => {
        const lines = block.split("\n");
        const isList = lines.every((line) => /^[-*]\s/.test(line.trim()));
        if (isList) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5">
              {lines.map((line) => <li key={line}>{formatInline(line.replace(/^[-*]\s/, ""))}</li>)}
            </ul>
          );
        }
        if (/^#{1,3}\s/.test(lines[0])) {
          return <h3 key={index} className="font-extrabold text-slate-900 dark:text-white">{formatInline(lines[0].replace(/^#{1,3}\s/, ""))}</h3>;
        }
        return <p key={index}>{lines.map((line, lineIndex) => <React.Fragment key={`${line}-${lineIndex}`}>{lineIndex > 0 && <br />}{formatInline(line)}</React.Fragment>)}</p>;
      })}
    </div>
  );
}

function formatInline(value: string): React.ReactNode {
  const parts = value.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-slate-200 px-1.5 py-0.5 text-[.9em] dark:bg-slate-800">{part.slice(1, -1)}</code>;
    return part;
  });
}

export default function StudyPage() {
  const [sessions, setSessions] = useLocalStorage<ChatSession[]>(STORAGE_KEYS.CHAT_SESSIONS, []);
  const [messages, setMessages] = React.useState<DisplayMessage[]>([]);
  const [mode, setMode] = React.useState<StudyMode>("doubt");
  const [input, setInput] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [copied, setCopied] = React.useState("");
  const [hydrated, setHydrated] = React.useState(false);
  const [activeSessionId, setActiveSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!hydrated) {
      const latest = [...sessions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
      setActiveSessionId(latest?.id ?? null);
      setMessages(latest?.messages.filter((message) => message.role !== "system").map(({ role, content, timestamp }) => ({ role, content, timestamp })) ?? []);
      setHydrated(true);
    }
  }, [hydrated, sessions]);

  const persistMessages = React.useCallback((nextMessages: DisplayMessage[]) => {
    const now = new Date().toISOString();
    const existing = sessions.find((session) => session.id === activeSessionId);
    const sessionId = existing?.id ?? createId();
    const session: ChatSession = {
      id: sessionId,
      title: nextMessages.find((message) => message.role === "user")?.content.slice(0, 45) || "New study chat",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      messages: nextMessages.map((message) => ({ ...message, id: createId(), sessionId, timestamp: message.timestamp || now })),
    };
    setSessions((current) => [session, ...current.filter((item) => item.id !== session.id)].slice(0, 20));
    setActiveSessionId(sessionId);
  }, [activeSessionId, sessions, setSessions]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = (mode === "summarize" ? notes : input).trim();
    if (!text || isLoading) return;
    setError("");
    const now = new Date().toISOString();
    const userMessage: DisplayMessage = { role: "user", content: text, timestamp: now };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    if (mode === "summarize") setNotes("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: nextMessages.map(({ role, content }) => ({ role, content })) }),
      });
      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(payload?.error || "Unable to reach the study assistant.");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      const assistantMessage: DisplayMessage = { role: "assistant", content: "", timestamp: new Date().toISOString() };
      setMessages([...nextMessages, assistantMessage]);
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        answer += decoder.decode(chunk.value, { stream: true });
        setMessages([...nextMessages, { ...assistantMessage, content: answer }]);
      }
      const finalMessages = [...nextMessages, { ...assistantMessage, content: answer || "The assistant returned an empty response." }];
      setMessages(finalMessages);
      persistMessages(finalMessages);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
      setMessages(nextMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    setError("");
    setSessions([]);
    storage.remove(STORAGE_KEYS.CHAT_SESSIONS);
  };

  const copyAnswer = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(content);
    window.setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#635BFF]"><Sparkles className="h-3.5 w-3.5" /> AI learning companion</div>
          <h1 className="flex items-center gap-2.5 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">AI Study Assistant <span aria-hidden>🤖</span></h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ask questions, summarize notes, and prepare with confidence.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setMode("doubt")} size="sm" className={`rounded-xl gap-1.5 text-xs font-bold ${mode === "doubt" ? "bg-[#635BFF] text-white" : "bg-white text-slate-600"}`}><Sparkles className="h-3.5 w-3.5" /> Solve doubt</Button>
          <Button onClick={() => setMode("summarize")} variant="outline" size="sm" className={`rounded-xl gap-1.5 text-xs font-bold ${mode === "summarize" ? "border-[#635BFF] text-[#635BFF]" : ""}`}><FileText className="h-3.5 w-3.5" /> Summarize notes</Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="space-y-4 lg:col-span-4">
          <Button onClick={() => { setMessages([]); setActiveSessionId(null); setError(""); }} className="h-11 w-full rounded-2xl bg-[#635BFF] font-bold text-white"><Plus className="mr-2 h-4 w-4" /> New chat</Button>
          <Card className="rounded-3xl border-border bg-white p-4 shadow-xs dark:bg-surface">
            <div className="mb-3 flex items-center justify-between px-1"><span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Recent chats</span><Badge size="sm">{sessions.length}</Badge></div>
            {sessions.length === 0 ? <p className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-slate-900">Your saved study chats will appear here.</p> : <div className="space-y-1">{sessions.slice(0, 6).map((session) => <button key={session.id} onClick={() => { setActiveSessionId(session.id); setMessages(session.messages.filter((message) => message.role !== "system").map(({ role, content, timestamp }) => ({ role, content, timestamp }))); }} className={`w-full rounded-2xl p-3 text-left transition hover:bg-[#635BFF]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF] ${activeSessionId === session.id ? "bg-[#635BFF]/10" : ""}`}><p className="truncate text-xs font-bold text-slate-800 dark:text-white">{session.title}</p><p className="mt-0.5 truncate text-[11px] text-slate-400">{session.messages.length} messages</p></button>)}</div>}
            <button onClick={clearChat} className="mx-auto mt-4 flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]"><Trash2 className="h-3.5 w-3.5" /> Clear chat history</button>
          </Card>
        </aside>

        <main className="space-y-5 lg:col-span-8">
          <Card className="rounded-3xl border-border bg-white p-5 shadow-xs dark:bg-surface">
            <div className="mb-3 flex items-center justify-between"><div><h2 className="text-sm font-extrabold text-slate-900 dark:text-white">{mode === "summarize" ? "Paste your notes" : "What are you studying today?"}</h2><p className="mt-1 text-xs text-slate-400">{mode === "summarize" ? "Turn long notes into a clear, high-yield revision guide." : "Your answer will stream into the chat."}</p></div><Badge variant="success" size="sm">{isLoading ? "Thinking" : "Ready"}</Badge></div>
            {mode === "summarize" ? <textarea aria-label="Notes to summarize" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Paste lecture notes, a chapter, or an assignment here..." className="min-h-32 w-full resize-y rounded-2xl border border-border bg-slate-50 p-3 text-sm outline-none ring-[#635BFF] focus:ring-2 dark:bg-slate-900" /> : <div className="grid gap-2 sm:grid-cols-2">{starters.map((starter) => <button key={starter} onClick={() => setInput(starter)} className="rounded-2xl border border-border bg-slate-50 p-3 text-left text-xs font-semibold text-slate-700 transition hover:border-[#635BFF] hover:bg-[#635BFF]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF] dark:bg-slate-900 dark:text-slate-200">{starter}</button>)}</div>}
          </Card>

          {messages.length === 0 && !isLoading ? <Card className="rounded-3xl border-dashed border-border bg-white p-10 text-center dark:bg-surface"><Bot className="mx-auto mb-3 h-10 w-10 text-[#635BFF]" /><h2 className="font-bold text-slate-800 dark:text-white">Your study space is ready</h2><p className="mt-1 text-sm text-slate-500">Ask a question or paste notes to begin.</p></Card> : <div className="space-y-4">{messages.map((message, index) => <div key={`${message.timestamp}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-2xl rounded-2xl p-4 ${message.role === "user" ? "rounded-tr-none bg-[#635BFF] text-white" : "rounded-tl-none border border-border bg-white text-slate-700 shadow-xs dark:bg-surface dark:text-slate-200"}`}>{message.role === "assistant" ? <MarkdownText content={message.content || (isLoading ? "Thinking..." : "")} /> : <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>}{message.role === "assistant" && message.content && <button onClick={() => copyAnswer(message.content)} className="mt-3 flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#635BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]"><Copy className="h-3.5 w-3.5" /> {copied === message.content ? "Copied" : "Copy answer"}</button>}</div></div>)}</div>}
          {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={submit} className="flex items-end gap-2 rounded-3xl border border-border bg-white p-3 shadow-xs dark:bg-surface"><textarea aria-label="Study question" value={input} onChange={(event) => setInput(event.target.value)} disabled={mode === "summarize" || isLoading} placeholder={mode === "summarize" ? "Use the notes box above..." : "Ask your study assistant anything..."} className="min-h-10 flex-1 resize-none bg-transparent p-2 text-sm outline-none disabled:cursor-not-allowed" rows={2} /><Button aria-label={mode === "summarize" ? "Summarize notes" : "Send question"} type="submit" disabled={isLoading || (mode === "summarize" ? !notes.trim() : !input.trim())} className="h-10 rounded-xl bg-[#635BFF] px-4 text-white"><Send className="h-4 w-4" /></Button></form>
          <p className="text-center text-xs text-slate-400">AI can make mistakes. Verify important academic information.</p>
        </main>
      </div>
    </div>
  );
}
