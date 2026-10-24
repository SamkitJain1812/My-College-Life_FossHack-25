"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Calendar, CheckCircle2, CircleDollarSign, Compass, ListChecks, Plus, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { STORAGE_KEYS, defaultBudget, defaultPortfolioProfile, useLocalStorage } from "@/lib/storage";
import type { Budget, Expense, PortfolioProfile, Task, TripPlan } from "@/lib/types";

const quickActions = [
  { href: "/finance", label: "Add expense", icon: CircleDollarSign, color: "text-[#635BFF]", bg: "bg-[#635BFF]/10" },
  { href: "/tasks", label: "Add task", icon: ListChecks, color: "text-[#00B894]", bg: "bg-[#00D287]/15" },
  { href: "/travel", label: "Plan a trip", icon: Compass, color: "text-[#0984E3]", bg: "bg-[#0984E3]/10" },
  { href: "/portfolio", label: "Update portfolio", icon: Plus, color: "text-[#E17055]", bg: "bg-[#E17055]/10" },
  { href: "/study", label: "Ask a doubt", icon: Sparkles, color: "text-[#635BFF]", bg: "bg-[#635BFF]/10" },
];

function isSameDay(value: string, date: Date): boolean {
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.getFullYear() === date.getFullYear() && parsed.getMonth() === date.getMonth() && parsed.getDate() === date.getDate();
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900">{children}</div>;
}

export default function DashboardPage() {
  const [tasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  const [expenses] = useLocalStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
  const [budget] = useLocalStorage<Budget>(STORAGE_KEYS.BUDGET, defaultBudget);
  const [trips] = useLocalStorage<TripPlan[]>(STORAGE_KEYS.TRIPS, []);
  const [portfolio] = useLocalStorage<PortfolioProfile>(STORAGE_KEYS.PORTFOLIO, defaultPortfolioProfile);
  const today = new Date();
  const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const monthExpenses = expenses.filter((expense) => expense.date.startsWith(monthKey));
  const spent = monthExpenses.reduce((total, expense) => total + (Number.isFinite(expense.amount) ? expense.amount : 0), 0);
  const limit = Number.isFinite(budget.monthlyLimit) ? budget.monthlyLimit : 0;
  const percent = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
  const dueToday = tasks.filter((task) => task.status !== "completed" && task.dueDate && isSameDay(task.dueDate, today));
  const overdue = tasks.filter((task) => task.status !== "completed" && task.dueDate && new Date(task.dueDate).getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime());
  const latestTrip = [...trips].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  const profile = portfolio ?? { items: [] };
  const completenessFields = [profile.name, profile.tagline, profile.institution, profile.bio, profile.email, profile.github, profile.linkedin, profile.items?.length ? "items" : ""];
  const completeness = Math.round((completenessFields.filter(Boolean).length / completenessFields.length) * 100);
  const firstName = profile.name?.split(" ")[0] || "Student";

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#635BFF]/10 px-3.5 py-1 text-xs font-semibold text-[#635BFF]"><Calendar className="h-3.5 w-3.5" /> {today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Good morning, {firstName} 👋</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here&apos;s your collegiate pulse for today.</p>
        </div>
        <div className="flex flex-wrap gap-2">{quickActions.map(({ href, label, icon: Icon, color, bg }) => <Link key={href} href={href}><Button variant="outline" size="sm" className="rounded-full bg-white text-xs font-semibold dark:bg-surface"><Icon className={`mr-1.5 h-3.5 w-3.5 ${color}`} />{label}</Button></Link>)}</div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-border bg-white p-5 shadow-xs dark:bg-surface"><div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">Spent vs budget <span className="rounded-full bg-[#635BFF]/10 p-2 text-[#635BFF]"><Wallet className="h-4 w-4" /></span></div><div className="mb-3 text-3xl font-extrabold text-slate-900 dark:text-white">₹{spent.toFixed(0)} <span className="text-sm font-semibold text-slate-400">/ ₹{limit.toFixed(0)}</span></div>{limit === 0 ? <Empty>No monthly budget set yet.</Empty> : <><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full bg-gradient-to-r from-[#635BFF] to-[#0984E3] ${percent >= 100 ? "from-red-500 to-orange-500" : ""}`} style={{ width: `${percent}%` }} /></div><div className="mt-2 flex justify-between text-xs font-semibold"><span className="text-[#00B894]">{percent}% spent</span><span className="text-slate-500">₹{Math.max(0, limit - spent).toFixed(0)} remaining</span></div></>}</Card>
        <Card className="rounded-2xl border-border bg-white p-5 shadow-xs dark:bg-surface"><div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">Due today <span className="rounded-full bg-[#00D287]/15 p-2 text-[#00B894]"><CheckCircle2 className="h-4 w-4" /></span></div><div className="mb-1 text-3xl font-extrabold text-slate-900 dark:text-white">{dueToday.length}</div>{dueToday.length === 0 ? <Empty>No tasks due today.</Empty> : <div className="space-y-1 text-xs text-slate-500">{dueToday.slice(0, 2).map((task) => <p key={task.id} className="truncate">• {task.title}</p>)}{dueToday.length > 2 && <Link href="/tasks" className="font-bold text-[#635BFF]">View all tasks</Link>}</div>}</Card>
        <Card className="rounded-2xl border-border bg-white p-5 shadow-xs dark:bg-surface"><div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">Action needed <span className="rounded-full bg-red-100 p-2 text-red-500"><AlertTriangle className="h-4 w-4" /></span></div><div className="mb-1 text-3xl font-extrabold text-red-500">{overdue.length}</div>{overdue.length === 0 ? <Empty>You&apos;re all caught up.</Empty> : <><p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">{overdue[0].title}</p><Link href="/tasks" className="mt-2 inline-block text-xs font-bold text-red-500">Review overdue tasks <ArrowRight className="inline h-3 w-3" /></Link></>}</Card>
        <Card className="rounded-2xl border-border bg-white p-5 shadow-xs dark:bg-surface"><div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">Portfolio <span className="rounded-full bg-[#E17055]/10 p-2 text-[#E17055]"><Sparkles className="h-4 w-4" /></span></div><div className="mb-2 text-3xl font-extrabold text-slate-900 dark:text-white">{completeness}%</div><div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full rounded-full bg-[#E17055]" style={{ width: `${completeness}%` }} /></div><Link href="/portfolio" className="mt-2 inline-block text-xs font-bold text-[#E17055]">{completeness === 0 ? "Start your portfolio" : "Complete your profile"} <ArrowRight className="inline h-3 w-3" /></Link></Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Card className="rounded-3xl border-border bg-white p-6 shadow-xs dark:bg-surface lg:col-span-7"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Latest saved trip</h2><p className="text-xs text-slate-400">Your most recently created itinerary</p></div><Link href="/travel" className="text-xs font-bold text-[#635BFF]">Plan another <ArrowRight className="inline h-3 w-3" /></Link></div>{latestTrip ? <div className="rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#0984E3] p-5 text-white"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-white/70">Upcoming adventure</p><h3 className="mt-1 text-2xl font-extrabold">{latestTrip.destination}</h3><p className="mt-1 text-sm text-white/80">{latestTrip.duration} · {latestTrip.vibes?.join(" · ") || "Personalized itinerary"}</p></div><Compass className="h-8 w-8 text-white/80" /></div><div className="mt-6 flex items-end justify-between border-t border-white/20 pt-4 text-sm"><span>{latestTrip.itinerary?.length || 0} itinerary days</span><span className="font-bold">{latestTrip.estimatedCost ? `${latestTrip.budget ? "$" : ""}${latestTrip.estimatedCost.toFixed(0)} estimated` : "Budget not estimated"}</span></div></div> : <Empty>No saved trips yet. Your generated travel plans will show here.</Empty>}</Card>
        <Card className="rounded-3xl border-border bg-white p-6 shadow-xs dark:bg-surface lg:col-span-5"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Today&apos;s focus</h2><p className="text-xs text-slate-400">Tasks that need your attention</p></div><Link href="/tasks" className="text-xs font-bold text-[#635BFF]">Open tasks</Link></div>{tasks.length === 0 ? <Empty>No tasks yet. Add one to start your day.</Empty> : <div className="space-y-3">{[...dueToday, ...overdue.filter((task) => !dueToday.some((item) => item.id === task.id))].slice(0, 4).map((task) => <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-900"><span className={`h-2.5 w-2.5 rounded-full ${overdue.some((item) => item.id === task.id) ? "bg-red-500" : "bg-[#00D287]"}`} /><span className="flex-1 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">{task.title}</span><span className="text-[10px] font-bold uppercase text-slate-400">{overdue.some((item) => item.id === task.id) ? "overdue" : "today"}</span></div>)}{dueToday.length === 0 && overdue.length === 0 && <Empty>Nothing urgent today. Nice work!</Empty>}</div>}</Card>
      </section>
    </div>
  );
}
