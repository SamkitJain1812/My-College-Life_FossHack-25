"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  Wallet,
  CheckSquare,
  Sparkles,
  BookOpen,
  GraduationCap,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Travel Planner", href: "/travel", icon: Compass },
  { name: "Finance Tracker", href: "/finance", icon: Wallet },
  { name: "Task Manager", href: "/tasks", icon: CheckSquare },
  { name: "Portfolio", href: "/portfolio", icon: Sparkles },
  { name: "Study Assistant", href: "/study", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col justify-between border-r border-border bg-white dark:bg-surface p-5 shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div className="space-y-7">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-2 pt-1 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#635BFF] text-white shadow-md shadow-[#635BFF]/25 transition-transform group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#635BFF] dark:text-white">
            College Life
          </span>
        </Link>

        {/* Navigation items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href + "/"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-[#635BFF] text-white shadow-sm shadow-[#635BFF]/30 font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-500 dark:text-slate-400")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* AI Companion Active Badge at bottom */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex items-center justify-center gap-2 rounded-full bg-[#E8FAF5] dark:bg-[#00D287]/15 py-2.5 px-3 text-xs font-bold text-[#00B894] dark:text-[#00D287] shadow-xs">
          <Zap className="h-3.5 w-3.5 fill-current" />
          <span>AI Companion Active</span>
        </div>
      </div>
    </aside>
  );
}
