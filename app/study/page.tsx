"use client";

import * as React from "react";
import {
  Bot,
  Sparkles,
  Send,
  Paperclip,
  Mic,
  Copy,
  RotateCcw,
  Plus,
  BookOpen,
  Code2,
  FileText,
  HelpCircle,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function StudyPage() {
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "user",
      text: "Can you explain the difference between Process and Thread in Operating Systems? I have a quiz in 2 hours!",
    },
  ]);
  const [input, setInput] = React.useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    // Simulate AI response preview
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Here is a high-yield summary for "${userMsg}":\n\n• Core Concept: Always remember the boundary separation.\n• Key Exam Formula / Theorem: Practice active recall on this topic before your quiz.`,
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            AI Study Assistant 🤖
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ask homework doubts, summarize syllabus lectures, and prepare for exams
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button size="sm" className="rounded-xl bg-[#635BFF] hover:bg-[#5046E5] text-white gap-1.5 font-bold text-xs shadow-sm shadow-[#635BFF]/25">
            <Sparkles className="h-3.5 w-3.5" /> Solve Doubt
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl gap-1.5 font-semibold text-xs">
            <FileText className="h-3.5 w-3.5" /> Summarize Notes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Sessions & Syllabus Sync (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <Button className="w-full h-11 rounded-2xl bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold text-xs gap-2 shadow-xs">
            <Plus className="h-4 w-4" /> New Chat
          </Button>

          <Card className="p-4 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent Sessions</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">5</span>
            </div>

            <div className="space-y-1">
              {[
                { title: "OS Process vs Thread", tag: "Now", desc: "Operating Systems quick revision" },
                { title: "CS 106B Binary Search Trees", tag: "Today", desc: "AVL rotations & balance factor proofs" },
                { title: "ECON 101 Oligopoly Prep", tag: "Yesterday", desc: "Game theory Nash equilibrium" },
                { title: "Physics 21 Gauss's Law", tag: "Oct 21", desc: "Flux through spherical shell" },
                { title: "Bio 103 Cellular Respiration", tag: "Oct 18", desc: "Krebs cycle ATP breakdown" },
              ].map((sess, idx) => (
                <div
                  key={sess.title}
                  className={`p-3 rounded-2xl cursor-pointer transition-all ${
                    idx === 0
                      ? "bg-[#635BFF]/10 dark:bg-[#635BFF]/20 text-[#635BFF]"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="truncate">{sess.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{sess.tag}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{sess.desc}</p>
                </div>
              ))}
            </div>

            {/* Syllabus Sync status */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#635BFF]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#00D287]" /> Syllabus Synced
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Calibrated for Stanford Spring &apos;25 Computer Science curriculum.
              </p>
            </div>

            <div className="pt-2 text-center">
              <button className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center justify-center gap-1.5 mx-auto">
                <Trash2 className="h-3.5 w-3.5" /> Clear chat history
              </button>
            </div>
          </Card>
        </div>

        {/* Right Column: Chat Interface & High-Yield Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Top starter prompt chips */}
          <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                How can I help you ace your classes today?
              </h3>
              <Badge variant="success" size="sm">Ready</Badge>
            </div>
            <p className="text-xs text-slate-400">Choose a quick starter prompt or drop an assignment below</p>

            <div className="grid sm:grid-cols-2 gap-2.5 pt-1">
              {[
                { title: "Explain Dijkstra's Algorithm", desc: "Break it down with a student-friendly GPS analogy", icon: "🗺️" },
                { title: "Summarize 10-page syllabus PDF", desc: "Extract the 5 highest-yield exam concepts & formulas", icon: "📄" },
                { title: "5 Organic Chemistry Practice Questions", desc: "Generate SN1 vs SN2 reaction mechanism scenarios", icon: "🧪" },
                { title: "Debug Python Recursion Error", desc: "Fix 'maximum recursion depth exceeded' base case", icon: "💻" },
              ].map((p) => (
                <div
                  key={p.title}
                  onClick={() => setInput(p.title)}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-border cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                    <span>{p.icon}</span> <span>{p.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight pl-6">{p.desc}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Dialogue area */}
          <div className="space-y-4">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-xl rounded-2xl rounded-tr-none bg-[#635BFF] text-white p-4 shadow-sm text-xs sm:text-sm font-medium leading-relaxed">
                Can you explain the difference between Process and Thread in Operating Systems? I have a quiz in 2 hours!
                <div className="text-[10px] text-white/70 text-right mt-1.5 font-normal">11:42 AM • Delivered</div>
              </div>
            </div>

            {/* AI Assistant Answer Card */}
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>

              <Card className="flex-1 p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">Study Assistant</span>
                    <span className="text-xs font-bold text-[#00D287] uppercase tracking-wider">• Concept Breakdown</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 font-semibold text-slate-500">
                    <Copy className="h-3 w-3" /> Copy Answer
                  </Button>
                </div>

                <p className="text-xs sm:text-sm font-bold text-[#635BFF]">
                  Good luck on the quiz! Here&apos;s the easiest way to remember it:
                </p>

                {/* Apartment vs Roommates Analogy */}
                <div className="p-4 rounded-2xl bg-[#E8FAF5] dark:bg-[#00D287]/15 border border-[#00D287]/30 text-xs space-y-1.5">
                  <div className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    🏢 The Apartment vs. Roommates Analogy
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Think of a <strong>Process</strong> like an entire <strong>Apartment</strong>, and <strong>Threads</strong> like <strong>Roommates</strong> living inside it. They share the common living room, fridge, and kitchen (shared memory space & address space), but each roommate has their own personal to-do list, clothes, and schedule (independent execution flow & registers)!
                  </p>
                </div>

                {/* 3 Comparison Cards */}
                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-1">
                    <p className="font-bold text-[#0984E3]">⚙️ Memory Space</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                      <strong>Process:</strong> Isolated address space. Cannot touch other processes without IPC.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                      <strong>Thread:</strong> Shares memory & open files with siblings.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-1">
                    <p className="font-bold text-[#635BFF]">⚡ Creation Overhead</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                      <strong>Process:</strong> Heavyweight. Expensive context switching and memory allocation.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                      <strong>Thread:</strong> Lightweight. Fast context switching.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-1">
                    <p className="font-bold text-[#FF5252]">🛡️ Crash Isolation</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                      <strong>Process:</strong> Safe. If one crashes, others remain unaffected.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                      <strong>Thread:</strong> Risky. An unhandled segfault crashes the whole process.
                    </p>
                  </div>
                </div>

                {/* Key takeaway */}
                <div className="p-3.5 rounded-2xl bg-[#FEF5E7] dark:bg-[#FF9F43]/15 border border-[#FF9F43]/30 text-xs">
                  <p className="font-extrabold text-amber-900 dark:text-amber-300">
                    ⚡ Key Takeaway for Exam (High Yield)
                  </p>
                  <p className="text-amber-800 dark:text-amber-200 text-[11px] mt-0.5 leading-relaxed">
                    Threads of the same process share <strong>Code, Data, and Heap</strong>, but maintain their own independent <strong>Stack, Program Counter (PC), and Registers</strong>.
                  </p>
                </div>

                {/* Follow up chips */}
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <span className="text-[11px] font-bold text-slate-400">Follow-up:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Give me a 3-question quick quiz 🎯",
                      "Explain Context Switching in detail 🔀",
                      "Show C pthread code snippet 💻",
                    ].map((fu) => (
                      <button
                        key={fu}
                        onClick={() => setInput(fu)}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom Chat Bar */}
          <form onSubmit={handleSend} className="relative rounded-2xl bg-white dark:bg-surface border border-border shadow-md p-2 flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
              <Paperclip className="h-4 w-4" />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
              <Mic className="h-4 w-4" />
            </button>
            <input
              type="text"
              placeholder="Type your homework question or paste syllabus notes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-xs sm:text-sm text-foreground placeholder:text-slate-400 focus:outline-none"
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-xl bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold h-9 px-4 gap-1.5 shadow-xs"
            >
              Send <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
            <span>⚡ Powered by Gemini • Student Academic Mode</span>
            <span>Markdown supported • Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
}
