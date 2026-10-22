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
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Travel", href: "/travel", icon: Compass },
  { name: "Finance", href: "/finance", icon: Wallet },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Portfolio", href: "/portfolio", icon: Sparkles },
  { name: "Study", href: "/study", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 dark:bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around py-1 px-1 shadow-elevated">
      {mobileLinks.map((link) => {
        const Icon = link.icon;
        const isActive =
          pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href + "/"));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all duration-150 min-w-[44px]",
              isActive
                ? "text-[#635BFF] font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-lg transition-colors",
                isActive && "bg-[#635BFF]/10 text-[#635BFF]"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-[9px] leading-tight tracking-tight mt-0.5">
              {link.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
