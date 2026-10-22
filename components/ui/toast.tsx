"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "default" | "success" | "warning" | "destructive";

export interface ToastItem {
  id: string;
  title?: string;
  description: string;
  type?: ToastType;
}

interface ToastContextValue {
  toasts: ToastItem[];
  toast: (options: {
    title?: string;
    description: string;
    variant?: ToastType;
    type?: ToastType;
  }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback(
    ({
      title,
      description,
      variant,
      type,
    }: {
      title?: string;
      description: string;
      variant?: ToastType;
      type?: ToastType;
    }) => {
      const id = Math.random().toString(36).slice(2, 9);
      const toastType = variant || type || "default";
      setToasts((prev) => [...prev, { id, title, description, type: toastType }]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2">
        {toasts.map((t) => (
          <ToastCard key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      toast: ({ title, description }: { title?: string; description: string }) => {
        console.log(`[Toast] ${title ? title + ": " : ""}${description}`);
      },
      toasts: [],
      removeToast: () => {},
    };
  }
  return context;
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  const icons = {
    default: <Info className="h-5 w-5 text-primary shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-success shrink-0" />,
    warning: <AlertCircle className="h-5 w-5 text-warning shrink-0" />,
    destructive: <AlertCircle className="h-5 w-5 text-danger shrink-0" />,
  };

  const borderStyles = {
    default: "border-border",
    success: "border-success/30 bg-success-surface/20",
    warning: "border-warning/30 bg-warning-surface/20",
    destructive: "border-danger/30 bg-danger-surface/20",
  };

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-xl border bg-surface p-4 shadow-elevated transition-all duration-200 animate-fade-in",
        borderStyles[toast.type || "default"]
      )}
    >
      {icons[toast.type || "default"]}
      <div className="flex-1 space-y-0.5">
        {toast.title && (
          <h4 className="text-sm font-semibold text-foreground">{toast.title}</h4>
        )}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {toast.description}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
