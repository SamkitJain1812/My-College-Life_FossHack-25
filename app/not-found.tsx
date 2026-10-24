import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FE] px-6 dark:bg-[#0B0E17]">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#635BFF]/10 text-[#635BFF]">
          <Compass className="h-8 w-8" aria-hidden="true" />
        </div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#635BFF]">404 error</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          We could not find that page. Head back to your dashboard and continue where you left off.
        </p>
        <Link href="/dashboard" className="mt-8 inline-block">
          <Button className="rounded-xl bg-[#635BFF] text-white">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back to dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
