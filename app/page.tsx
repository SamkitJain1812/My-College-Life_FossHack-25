"use client";

import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Compass,
  Wallet,
  CheckSquare,
  BookOpen,
  ShieldCheck,
  Star,
  Check,
  Zap,
  Lock,
  Heart,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-[#0B0E17] text-slate-900 dark:text-white flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-white/90 dark:bg-surface/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#635BFF] dark:text-white">
              My College Life
            </span>
          </Link>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-100 dark:bg-slate-800/60 text-xs font-semibold">
            <Link href="/" className="px-4 py-1.5 rounded-full bg-[#635BFF] text-white shadow-xs">
              Home
            </Link>
            <Link href="#features" className="px-4 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900">
              Platform
            </Link>
            <Link href="#ai-tools" className="px-4 py-1.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900">
              AI Tools
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Link href="/dashboard">
              <Button size="sm" className="rounded-full bg-[#635BFF] hover:bg-[#5046E5] text-white text-xs font-bold px-4 h-9 shadow-sm shadow-[#635BFF]/30 gap-1.5">
                Open Dashboard <Zap className="h-3.5 w-3.5 fill-current" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left 7 Cols: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-border bg-white dark:bg-surface px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
                <span>🎓 100% Free for Students</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>🔒 Private & On-Device First</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-[#635BFF] font-bold flex items-center gap-0.5">
                  4.9/5 <Star className="h-3 w-3 fill-current" />
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
                Your whole college life, <br />
                <span className="bg-gradient-to-r from-[#635BFF] via-[#7C69FF] to-[#0984E3] bg-clip-text text-transparent">
                  one smart place.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                The all-in-one AI student companion. Effortlessly manage your finances, organize semester tasks, plan weekend getaways with friends, build your portfolio, and study with AI assistance — all in one colorful, unified dashboard.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold px-7 h-12 shadow-md shadow-[#635BFF]/30 gap-2">
                    Get started (Go to Dashboard) <Zap className="h-4 w-4 fill-current" />
                  </Button>
                </Link>
                <Link href="/styleguide">
                  <Button variant="outline" size="lg" className="rounded-full border-border bg-white dark:bg-surface font-semibold px-6 h-12">
                    Explore Demo
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-surface">AX</div>
                  <div className="h-7 w-7 rounded-full bg-[#00D287] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-surface">ML</div>
                  <div className="h-7 w-7 rounded-full bg-[#0984E3] text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-surface">SL</div>
                  <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-surface">+4k</div>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Active in Stanford, UT Austin, McGill & 42+ campus unions
                </span>
              </div>
            </div>

            {/* Right 5 Cols: Floating Mockup Window */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl border border-border bg-white dark:bg-surface p-5 shadow-elevated space-y-4">
                {/* Window top bar */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono text-slate-400 pl-2">campus_hub.app/live</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00D287] bg-[#E8FAF5] dark:bg-[#00D287]/20 px-2 py-0.5 rounded-full">
                    • Live Sync
                  </span>
                </div>

                {/* Card 1: AI Study Copilot */}
                <div className="p-3.5 rounded-2xl bg-[#635BFF]/5 dark:bg-[#635BFF]/15 border border-[#635BFF]/20 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-[#635BFF]">
                    <span className="flex items-center gap-1">✨ AI Study Copilot</span>
                    <span className="text-[10px] text-slate-400 font-normal">CS 224N Note</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    &ldquo;Recurrent Neural Networks vs Transformers: Self-attention scales parallel processing across sequences.&rdquo;
                  </p>
                  <p className="text-[10px] text-[#00D287] font-bold">✓ 3 Flashcards Generated</p>
                </div>

                {/* Card 2: Tasks & Getaway grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Tasks</span>
                      <span className="text-[#635BFF]">3</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">☑ Physics Lab 4</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">☑ Midterm Pitch</p>
                    <p className="text-[10px] text-[#FF5252] font-semibold">Priority: High (Due 11:59pm)</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Getaway</span>
                      <span>🏕️</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Big Sur Cabin</p>
                    <p className="text-[10px] text-slate-400">Fri – Sun • 4 Students</p>
                    <span className="inline-block text-[10px] font-bold text-[#0984E3] bg-[#E7F3FE] dark:bg-[#0984E3]/20 px-2 py-0.5 rounded">
                      Booked
                    </span>
                  </div>
                </div>

                {/* Card 3: Monthly Dining & Books */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-4 border-[#00D287] border-t-transparent flex items-center justify-center text-[10px] font-bold">
                      68%
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Monthly Dining & Books</p>
                      <p className="text-[11px] text-slate-400">$384 spent of $560 allowance</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#00D287] bg-[#E8FAF5] dark:bg-[#00D287]/20 px-2.5 py-1 rounded-full">
                    On Track
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
                  <Lock className="h-3 w-3 text-[#635BFF]" />
                  <span>Offline Encrypted • Syncs locally to device</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Stats Row */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-border shadow-xs flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5252]/10 text-2xl">
                🎒
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">12,000+</p>
                <p className="text-xs font-bold text-slate-500">Active College Students</p>
                <p className="text-[11px] text-slate-400">Organizing daily classes and projects.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-border shadow-xs flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0984E3]/10 text-2xl">
                🏛️
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">45+ Campuses</p>
                <p className="text-xs font-bold text-slate-500">Universities & Colleges</p>
                <p className="text-[11px] text-slate-400">From Ivy League to community colleges.</p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-border shadow-xs flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00D287]/10 text-2xl">
                🧘
              </div>
              <div>
                <p className="text-2xl font-black text-[#00D287]">98% Less Stress</p>
                <p className="text-xs font-bold text-slate-500">Reported in Finals Season</p>
                <p className="text-[11px] text-slate-400">Fewer forgotten deadlines and balanced budgets.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Core Modules Grid */}
        <section id="features" className="py-16 max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-bold uppercase tracking-wider">
              Student Superpowers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything your academic & social life demands
            </h2>
            <p className="text-sm text-slate-500">
              Crafted specifically for the collegiate rhythm — from Syllabus Week to Finals sprint.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI Travel Planner",
                desc: "Weekend trips & study break getaways planned in seconds with budget-aware itineraries, carpool routing, and packing checklists.",
                icon: "✈️",
                linkText: "Split-gas calculations →",
                href: "/travel",
              },
              {
                title: "Finance Tracker",
                desc: "Track student budgets, split meal tabs with roommates, and visualize monthly spending habits before finals crunch hits.",
                icon: "💰",
                linkText: "Zero overdraft surprise →",
                href: "/finance",
              },
              {
                title: "Task Manager",
                desc: "Semester deadlines, color-coded priority badges, overdue alerts, and flexible Kanban status boards tailored for course milestones.",
                icon: "🎯",
                linkText: "Auto-syllabus sync →",
                href: "/tasks",
              },
              {
                title: "Academic Portfolio",
                desc: "Showcase coding projects, course certifications, tech stacks, and instantly export recruiter-ready PDFs with clean typographic layout.",
                icon: "🚀",
                linkText: "Live portfolio link →",
                href: "/portfolio",
              },
              {
                title: "AI Study Assistant",
                desc: "Upload lecture notes, solve difficult assignment doubts, convert dense chapters into flashcards, and generate quick revision summaries.",
                icon: "✨",
                linkText: "Context-aware Q&A →",
                href: "/study",
              },
              {
                title: "Your data stays on device",
                desc: "Zero ad tracking, privacy-first offline storage, and student data encryption. No institutional surveillance, just complete autonomy.",
                icon: "🔒",
                linkText: "100% Client-side sandbox →",
                href: "/dashboard",
              },
            ].map((f) => (
              <Link key={f.title} href={f.href} className="group">
                <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-border shadow-xs hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between h-full space-y-4">
                  <div className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl flex items-center justify-center">
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#635BFF] transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#635BFF] group-hover:underline">
                    {f.linkText}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3-Step Flow */}
        <section className="py-16 bg-slate-100/60 dark:bg-slate-900/40 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <span className="text-xs font-bold text-[#635BFF] uppercase tracking-wider">3-Step Flow</span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">How My College Life Works</h2>
              <p className="text-xs text-slate-500">Zero complex setup. Open in browser and start crushing your goals.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-border shadow-xs space-y-2">
                <span className="text-3xl font-black text-[#635BFF]/30">01</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Import or Drag Syllabus</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload your course syllabus PDF or syllabus link. The AI automatically registers exam dates, recurring problem sets, and grading weighting.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-border shadow-xs space-y-2">
                <span className="text-3xl font-black text-[#635BFF]/30">02</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Set Monthly Budgets</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Designate allowance limits for meal cards, coffee runs, dorm groceries, and weekend fun. Monitor real-time spending with simple charts.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-surface border border-border shadow-xs space-y-2">
                <span className="text-3xl font-black text-[#635BFF]/30">03</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Thrive with AI Daily</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Generate lecture summaries, track GPA trends, collaborate on group road-trips, and keep academic stress completely in check.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#635BFF] to-[#7C69FF] p-8 sm:p-14 text-center text-white shadow-elevated">
            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 mx-auto text-2xl backdrop-blur-md">
                🎓
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Ready to take control of your college journey?
              </h2>
              <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">
                No account creation required. Free forever. Start organizing your semester in 30 seconds.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full bg-white text-[#635BFF] hover:bg-slate-100 font-bold px-8 h-12 shadow-sm gap-2">
                    Launch Dashboard <Zap className="h-4 w-4 fill-current" />
                  </Button>
                </Link>
                <Link href="https://github.com" target="_blank">
                  <Button variant="outline" size="lg" className="rounded-full border-white/30 text-white hover:bg-white/10 font-semibold px-6 h-12 gap-2">
                    ⭐ Star on GitHub
                  </Button>
                </Link>
              </div>
            </div>
            <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white dark:bg-surface py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#635BFF] text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">My College Life</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Empowering students with zero fees or data harvesting.</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5 font-semibold text-[#00D287]">
              🛡️ Zero Login • 100% Client-Side
            </span>
            <span>© 2026 My College Life. MIT Licensed.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
