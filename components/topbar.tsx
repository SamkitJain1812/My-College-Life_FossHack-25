"use client";

import Link from "next/link";
import { Search, Bell, Sun, Moon, GraduationCap } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border bg-white/90 dark:bg-surface/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Campus Context & Semester Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/" className="md:hidden flex items-center gap-2 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#635BFF] text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
        </Link>
        <div className="truncate">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              Overview
            </h1>
            <span className="text-slate-400 text-xs sm:text-sm font-normal">• Spring Semester 2025</span>
          </div>
          <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
            Stanford Quad • 68°F • Sunny
          </p>
        </div>
      </div>

      {/* Center: Search Bar Pill */}
      <div className="flex-1 max-w-md mx-2 hidden sm:block">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks, trips, notes..."
            className="w-full h-10 pl-10 pr-4 rounded-full bg-slate-50 dark:bg-slate-900/60 border border-border text-xs sm:text-sm text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635BFF] focus:bg-white dark:focus:bg-surface transition-all"
          />
        </div>
      </div>

      {/* Right: Actions (Theme toggle, notifications, student profile) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full h-9 w-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#FF5252]" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Student Avatar */}
        <Link href="/portfolio" className="flex items-center gap-2 pl-1 group" title="Alex Rivera (Student Profile)">
          <div className="relative h-9 w-9 rounded-full bg-gradient-to-tr from-[#635BFF] to-[#A29BFE] text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-white dark:ring-surface">
            AR
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00D287] border-2 border-white dark:border-surface" />
          </div>
        </Link>
      </div>
    </header>
  );
}
