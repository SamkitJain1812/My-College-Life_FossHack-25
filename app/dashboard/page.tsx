"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  Wallet,
  CheckCircle2,
  AlertTriangle,
  Compass,
  ArrowRight,
  Sparkles,
  Plus,
  Send,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLocalStorage, STORAGE_KEYS, defaultBudget } from "@/lib/storage";
import type { Task, Expense, Budget } from "@/lib/types";

export default function DashboardPage() {
  const [tasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  const [expenses] = useLocalStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
  const [budget] = useLocalStorage<Budget>(STORAGE_KEYS.BUDGET, defaultBudget);
  const [promptText, setPromptText] = React.useState("");

  // Live dynamic calculations
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingCash = Math.max(0, budget.monthlyLimit - totalSpent);
  const spentPercent = Math.min(100, Math.round((totalSpent / (budget.monthlyLimit || 1)) * 100));

  const completedTasks = tasks.filter((t) => t.status === "completed");
  const pendingTasks = tasks.filter((t) => t.status !== "completed");
  const overdueTasks = tasks.filter((t) => {
    if (t.status === "completed" || !t.dueDate) return false;
    const dueTime = new Date(t.dueDate).getTime();
    return !isNaN(dueTime) && dueTime < Date.now();
  });
  const firstOverdue = overdueTasks[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#635BFF]/10 text-[#635BFF] dark:bg-[#635BFF]/20 dark:text-[#A29BFE] px-3.5 py-1 text-xs font-semibold">
            <Calendar className="h-3.5 w-3.5" />
            <span>Wednesday, Oct 24 • Fall Semester 2024</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Good morning, Student 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Here is your collegiate pulse: {pendingTasks.length} focus blocks today, safe budget runway, and Yosemite in 17 days.
          </p>
        </div>

        {/* Quick Action Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/finance">
            <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-surface border-border text-xs font-semibold gap-1.5 shadow-xs">
              <span className="text-[#635BFF]">💳</span> Add expense
            </Button>
          </Link>
          <Link href="/tasks">
            <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-surface border-border text-xs font-semibold gap-1.5 shadow-xs">
              <span className="text-[#00D287]">📝</span> Add task
            </Button>
          </Link>
          <Link href="/travel">
            <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-surface border-border text-xs font-semibold gap-1.5 shadow-xs">
              <span className="text-[#0984E3]">✈️</span> Plan a trip
            </Button>
          </Link>
          <Link href="/study">
            <Button size="sm" className="rounded-full bg-[#635BFF] hover:bg-[#5046E5] text-white text-xs font-semibold gap-1.5 shadow-sm shadow-[#635BFF]/25">
              <Sparkles className="h-3.5 w-3.5" /> Ask a doubt
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Spent vs Budget */}
        <Card className="bg-white dark:bg-surface border-border rounded-2xl p-5 shadow-xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
            <span>Spent vs Budget</span>
            <div className="h-8 w-8 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${totalSpent > 0 ? totalSpent.toFixed(0) : "420"}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ ${budget.monthlyLimit.toFixed(0)}</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-[#635BFF] to-[#0984E3] h-full rounded-full transition-all duration-500"
              style={{ width: `${totalSpent > 0 ? spentPercent : 64}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-[#00D287]">{totalSpent > 0 ? spentPercent : 64}% spent</span>
            <span className="text-slate-500">${remainingCash > 0 ? remainingCash.toFixed(0) : "230"} remaining</span>
          </div>
        </Card>

        {/* Card 2: Due Today */}
        <Card className="bg-white dark:bg-surface border-border rounded-2xl p-5 shadow-xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
            <span>Due Today</span>
            <div className="h-8 w-8 rounded-full bg-[#00D287]/15 text-[#00D287] flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            {tasks.length > 0 ? tasks.length : 4} Tasks
          </div>
          <p className="text-xs text-slate-500 mb-3">Targeting finish by 9:00 PM</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8FAF5] dark:bg-[#00D287]/20 text-[#00B894] dark:text-[#00D287] px-2.5 py-0.5 text-[11px] font-bold">
              • {completedTasks.length || 2} Completed
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F3FE] dark:bg-[#0984E3]/20 text-[#0984E3] px-2.5 py-0.5 text-[11px] font-bold">
              • {pendingTasks.length || 2} Pending
            </span>
          </div>
        </Card>

        {/* Card 3: Action Needed */}
        <Card className="bg-white dark:bg-surface border-border rounded-2xl p-5 shadow-xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
            <span className="text-[#FF5252]">Action Needed</span>
            <div className="h-8 w-8 rounded-full bg-[#FF5252]/15 text-[#FF5252] flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#FF5252] mb-1">
            {overdueTasks.length || 1} Overdue
          </div>
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate mb-3">
            {firstOverdue ? firstOverdue.title : "CS 106B Problem Set 3"}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Late penalty: -5%/day</span>
            <Link href="/tasks" className="font-bold text-[#FF5252] hover:underline">
              Submit
            </Link>
          </div>
        </Card>

        {/* Card 4: Adventures */}
        <Card className="bg-white dark:bg-surface border-border rounded-2xl p-5 shadow-xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
            <span>Adventures</span>
            <div className="h-8 w-8 rounded-full bg-[#0984E3]/15 text-[#0984E3] flex items-center justify-center">
              <Compass className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            3 Trips
          </div>
          <p className="text-xs text-slate-500 truncate mb-3">
            Yosemite, Cabo, Lake Tahoe
          </p>
          <Link href="/travel" className="inline-flex items-center gap-1 text-xs font-bold text-[#635BFF] hover:underline">
            Next: Yosemite (Nov 10) <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>
      </div>

      {/* Middle Row: Today's Focus Tasks & Spending Breakdown */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Today's Focus Tasks */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Today&apos;s Focus Tasks
              </h2>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">
                4
              </span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
              <button className="px-2.5 py-1 rounded-lg bg-[#635BFF] text-white">All</button>
              <button className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white">Active</button>
              <button className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white">Done</button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Task 1 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5 hover:border-slate-200 transition-colors">
              <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600 mt-0.5 cursor-pointer hover:border-[#635BFF]" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    CS 106B Recursion Assignment
                  </h3>
                  <Badge variant="danger" size="sm">
                    • High Priority
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold px-2 py-0.5 rounded bg-white dark:bg-surface border border-border">CS 106B</span>
                  <span className="text-[#FF5252] font-semibold flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Tonight 11:59 PM
                  </span>
                  <span>• Pair programming with Alex</span>
                </div>
              </div>
            </div>

            {/* Task 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5 hover:border-slate-200 transition-colors">
              <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600 mt-0.5 cursor-pointer hover:border-[#635BFF]" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Read ECON Chapter 4 Market Equilibria
                  </h3>
                  <Badge variant="warning" size="sm">
                    • Med Priority
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold px-2 py-0.5 rounded bg-white dark:bg-surface border border-border">ECON 101</span>
                  <span>Today 5:00 PM</span>
                  <span>• Pages 112-145 prep</span>
                </div>
              </div>
            </div>

            {/* Task 3 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3.5 hover:border-slate-200 transition-colors">
              <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-600 mt-0.5 cursor-pointer hover:border-[#635BFF]" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Confirm dorm laundry slot
                  </h3>
                  <Badge variant="success" size="sm">
                    • Low Priority
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold px-2 py-0.5 rounded bg-white dark:bg-surface border border-border">Campus Life</span>
                  <span>Flexible</span>
                  <span>• Roble Hall 2nd Floor</span>
                </div>
              </div>
            </div>

            {/* Task 4: Completed */}
            <div className="p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 flex items-start gap-3.5 opacity-80">
              <div className="h-5 w-5 rounded-full bg-[#00D287] text-white flex items-center justify-center mt-0.5">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold line-through text-slate-500">
                    Submit Bio Lab Safety Quiz
                  </h3>
                  <Badge variant="success" size="sm">
                    Completed
                  </Badge>
                </div>
                <div className="text-xs text-slate-400">
                  PHYS 21 • Scored 100% • Finished at 9:15 AM
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4/5 Cols: Spending Breakdown */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white dark:bg-surface border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Spending Breakdown
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                $420 Total
              </span>
            </div>
            <p className="text-xs text-slate-400">October 1 – 24</p>
          </div>

          {/* Visual Donut Ring */}
          <div className="flex items-center justify-center my-2">
            <div className="relative h-44 w-44 flex items-center justify-center">
              <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" stroke="#ECEEF5" strokeWidth="12" fill="none" className="dark:stroke-slate-800" />
                {/* Food (50%) */}
                <circle cx="50" cy="50" r="38" stroke="#FF5252" strokeWidth="12" fill="none" strokeDasharray="119.38 238.76" strokeDashoffset="0" />
                {/* Textbooks (23%) */}
                <circle cx="50" cy="50" r="38" stroke="#0984E3" strokeWidth="12" fill="none" strokeDasharray="54.91 238.76" strokeDashoffset="-119.38" />
                {/* Transit (11%) */}
                <circle cx="50" cy="50" r="38" stroke="#FF9F43" strokeWidth="12" fill="none" strokeDasharray="26.26 238.76" strokeDashoffset="-174.29" />
                {/* Entertainment (16%) */}
                <circle cx="50" cy="50" r="38" stroke="#635BFF" strokeWidth="12" fill="none" strokeDasharray="38.2 238.76" strokeDashoffset="-200.55" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">$420</span>
                <span className="text-[11px] font-semibold text-slate-400 mt-1">This Month</span>
              </div>
            </div>
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#FF5252]" />
                <span className="truncate">Food & Dining</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">$210 <span className="text-[11px] font-normal text-slate-400">(50%)</span></p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#0984E3]" />
                <span className="truncate">Textbooks</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">$95 <span className="text-[11px] font-normal text-slate-400">(23%)</span></p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#FF9F43]" />
                <span className="truncate">Transit & Gas</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">$45 <span className="text-[11px] font-normal text-slate-400">(11%)</span></p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <span className="h-2 w-2 rounded-full bg-[#635BFF]" />
                <span className="truncate">Entertainment</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">$70 <span className="text-[11px] font-normal text-slate-400">(16%)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Yosemite Getaway & Study AI Assistant */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left 7 Cols: Yosemite Trip Card */}
        <div className="lg:col-span-7 bg-white dark:bg-surface border border-border rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between">
          <div className="relative h-44 bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-6 flex flex-col justify-between text-white overflow-hidden">
            <div className="flex items-center justify-between relative z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white">
                🌲 Autumn Getaway
              </span>
              <span className="rounded-full bg-[#635BFF] px-3 py-1 text-xs font-bold text-white shadow-sm">
                Nov 10 – 12
              </span>
            </div>
            <div className="relative z-10 flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">
                  Yosemite National Park 🌲
                </h3>
                <p className="text-xs text-white/80">3 Days • El Portal Cabins • Stanford Outing Club</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-white/70">Est. Cost / Person</p>
                <p className="text-2xl font-black text-[#00D287]">$185</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">JD</div>
                  <div className="h-8 w-8 rounded-full bg-[#00D287] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">MK</div>
                  <div className="h-8 w-8 rounded-full bg-[#0984E3] text-white flex items-center justify-center text-xs font-bold ring-2 ring-white">SL</div>
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold ring-2 ring-white">+1</div>
                </div>
                <span className="text-xs text-slate-500 font-medium">4 buddies joined • Carpool organized</span>
              </div>
              <Link href="/travel">
                <Button size="sm" className="rounded-xl bg-[#635BFF] text-white gap-1.5 font-bold shadow-xs">
                  View Full Plan <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black">D1</span>
                <span>Valley Floor Hike & Cabin Check-in</span>
              </div>
              <p className="text-slate-500 pl-7 text-[11px]">
                Depart campus 6:30 AM via CA-120 • Sunset viewpoint at Tunnel View • Campfire chili prep.
              </p>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Study AI Assistant Card */}
        <div className="lg:col-span-5 bg-white dark:bg-surface border border-border rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-[#635BFF] text-white flex items-center justify-center shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Study AI Assistant
                </h3>
                <p className="text-xs text-slate-400">Syllabus-aware • Fall 2024</p>
              </div>
            </div>
            <Badge variant="success" size="sm">Ready</Badge>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-3">
            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Ask anything about your syllabus, homework, or exam prep..."
              className="w-full bg-transparent text-xs text-foreground placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium">⚡ Gemini AI Student Model</span>
              <Link href="/study">
                <Button size="icon" className="h-8 w-8 rounded-full bg-[#635BFF] hover:bg-[#5046E5] text-white shadow-xs">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested Quick Prompts</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Summarize lecture 4",
                "Explain Bayes Theorem",
                "Debug C++ pointer error",
              ].map((qp) => (
                <Link key={qp} href="/study">
                  <span className="inline-block px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#635BFF]/10 hover:text-[#635BFF] dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 transition-colors">
                    &ldquo;{qp}&rdquo;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
