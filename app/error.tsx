"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FE] px-6 dark:bg-[#0B0E17]">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-500 dark:bg-red-950/40">
          <AlertTriangle className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-500">500 error</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Something went wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          This page encountered an unexpected problem. You can retry or return to your dashboard.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset} className="rounded-xl bg-[#635BFF] text-white">
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" /> Try again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="rounded-xl">Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
