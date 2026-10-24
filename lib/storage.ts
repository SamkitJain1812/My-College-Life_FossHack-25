"use client";

import * as React from "react";
import type {
  Expense,
  Budget,
  Task,
  PortfolioProfile,
  TripPlan,
  ChatSession,
  CollegeLifeAllData,
} from "./types";

/**
 * Storage key constants.
 */
export const STORAGE_KEYS = {
  EXPENSES: "college_life_expenses_v2",
  BUDGET: "college_life_budget_v2",
  TASKS: "college_life_tasks_v2",
  PORTFOLIO: "college_life_portfolio_v2",
  TRIPS: "college_life_trips_v2",
  CHAT_SESSIONS: "college_life_chat_sessions_v2",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS] | string;

/**
 * SSR safety check
 */
export const isBrowser = (): boolean => {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
};

/**
 * Low-level typed localStorage helper functions.
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch (err) {
      console.warn(`[storage.get] Error reading key "${key}":`, err);
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event for cross-component reactive updates in the same window
      window.dispatchEvent(
        new CustomEvent("local-storage-change", { detail: { key, value } })
      );
    } catch (err) {
      console.error(`[storage.set] Error saving key "${key}":`, err);
    }
  },

  update<T>(key: string, updater: (prev: T) => T, fallback: T): T {
    const current = storage.get<T>(key, fallback);
    const updated = updater(current);
    storage.set<T>(key, updated);
    return updated;
  },

  remove(key: string): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(
        new CustomEvent("local-storage-change", { detail: { key, value: null } })
      );
    } catch (err) {
      console.error(`[storage.remove] Error removing key "${key}":`, err);
    }
  },
};

/**
 * SSR-safe React hook: useLocalStorage
 * Returns [value, setValue, isHydrated]
 * Initial render strictly matches server-side HTML (no hydration mismatch).
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (valOrUpdater: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = React.useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = React.useState<boolean>(false);
  const defaultValueRef = React.useRef(defaultValue);

  // Sync with localStorage on client mount
  React.useEffect(() => {
    const stored = storage.get<T>(key, defaultValueRef.current);
    setState(stored);
    setIsHydrated(true);

    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: unknown }>;
      if (!customEvent.detail || customEvent.detail.key === key) {
        setState(storage.get<T>(key, defaultValueRef.current));
      }
    };

    window.addEventListener("local-storage-change", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("local-storage-change", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  const setLocalStorageValue = React.useCallback(
    (valOrUpdater: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next =
          typeof valOrUpdater === "function"
            ? (valOrUpdater as (prev: T) => T)(prev)
            : valOrUpdater;
        storage.set<T>(key, next);
        return next;
      });
    },
    [key]
  );

  return [state, setLocalStorageValue, isHydrated];
}

/**
 * Initial safe defaults for all entities
 */
export const defaultBudget: Budget = {
  monthlyLimit: 650,
  currency: "₹",
  month: "2024-10",
  savingsGoal: 150,
};

export const defaultPortfolioProfile: PortfolioProfile = {
  name: "Alex Rivera",
  tagline: "Undergraduate Scholar & Aspiring Software Engineer",
  institution: "Stanford University",
  classYear: "2026",
  gpa: "3.88",
  bio: "Passionate about building intuitive software, AI student tools, and accessible digital experiences. Exploring full-stack engineering, generative AI integration, and modern higher education workflows.",
  email: "arivera@stanford.edu",
  github: "https://github.com/alexrivera",
  linkedin: "https://linkedin.com/in/alex-rivera-cs",
  statusTag: "Open for Summer 2025 SDE Internships",
  items: [],
};

/**
 * Backup / Export all user data as a single JSON payload
 */
export function exportAllData(): CollegeLifeAllData {
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    expenses: storage.get<Expense[]>(STORAGE_KEYS.EXPENSES, []),
    budget: storage.get<Budget>(STORAGE_KEYS.BUDGET, defaultBudget),
    tasks: storage.get<Task[]>(STORAGE_KEYS.TASKS, []),
    portfolio: storage.get<PortfolioProfile>(STORAGE_KEYS.PORTFOLIO, defaultPortfolioProfile),
    trips: storage.get<TripPlan[]>(STORAGE_KEYS.TRIPS, []),
    chatSessions: storage.get<ChatSession[]>(STORAGE_KEYS.CHAT_SESSIONS, []),
  };
}

/**
 * Trigger download of the JSON backup file directly in the browser
 */
export function downloadBackupFile(fileName?: string): void {
  if (!isBrowser()) return;
  const data = exportAllData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const defaultName = `college-life-backup-${new Date().toISOString().split("T")[0]}.json`;
  link.href = url;
  link.download = fileName || defaultName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import and restore backup JSON data into browser localStorage
 */
export function importAllData(
  jsonInput: string | CollegeLifeAllData
): { success: boolean; message: string } {
  try {
    const data: CollegeLifeAllData =
      typeof jsonInput === "string" ? JSON.parse(jsonInput) : jsonInput;

    if (!data || typeof data !== "object") {
      return { success: false, message: "Invalid backup format: not an object." };
    }

    if (Array.isArray(data.expenses)) {
      storage.set(STORAGE_KEYS.EXPENSES, data.expenses);
    }
    if (data.budget && typeof data.budget === "object") {
      storage.set(STORAGE_KEYS.BUDGET, data.budget);
    }
    if (Array.isArray(data.tasks)) {
      storage.set(STORAGE_KEYS.TASKS, data.tasks);
    }
    if (data.portfolio && typeof data.portfolio === "object") {
      storage.set(STORAGE_KEYS.PORTFOLIO, data.portfolio);
    }
    if (Array.isArray(data.trips)) {
      storage.set(STORAGE_KEYS.TRIPS, data.trips);
    }
    if (Array.isArray(data.chatSessions)) {
      storage.set(STORAGE_KEYS.CHAT_SESSIONS, data.chatSessions);
    }

    return { success: true, message: "Backup successfully restored!" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Malformed JSON file.";
    return { success: false, message: `Import failed: ${msg}` };
  }
}

/**
 * Wipe all local data for testing or reset
 */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((k) => storage.remove(k));
}

// Backward-compatible named storage helpers
export const tasksStorage = {
  get: (): Task[] => storage.get<Task[]>(STORAGE_KEYS.TASKS, []),
  save: (tasks: Task[]): void => storage.set(STORAGE_KEYS.TASKS, tasks),
  add: (task: Omit<Task, "id" | "createdAt">): Task => {
    const current = tasksStorage.get();
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    };
    tasksStorage.save([newTask, ...current]);
    return newTask;
  },
  toggle: (id: string): Task[] => {
    const updated = tasksStorage.get().map((t) =>
      t.id === id
        ? {
            ...t,
            status: (t.status === "completed" ? "pending" : "completed") as "pending" | "completed",
            completedAt: t.status === "completed" ? undefined : new Date().toISOString(),
          }
        : t
    );
    tasksStorage.save(updated);
    return updated;
  },
  remove: (id: string): Task[] => {
    const filtered = tasksStorage.get().filter((t) => t.id !== id);
    tasksStorage.save(filtered);
    return filtered;
  },
};

export const expensesStorage = {
  get: (): Expense[] => storage.get<Expense[]>(STORAGE_KEYS.EXPENSES, []),
  save: (expenses: Expense[]): void => storage.set(STORAGE_KEYS.EXPENSES, expenses),
  add: (expense: Omit<Expense, "id" | "createdAt">): Expense => {
    const current = expensesStorage.get();
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    };
    expensesStorage.save([newExpense, ...current]);
    return newExpense;
  },
  remove: (id: string): Expense[] => {
    const filtered = expensesStorage.get().filter((e) => e.id !== id);
    expensesStorage.save(filtered);
    return filtered;
  },
};

export const travelPlansStorage = {
  get: (): TripPlan[] => storage.get<TripPlan[]>(STORAGE_KEYS.TRIPS, []),
  save: (plans: TripPlan[]): void => storage.set(STORAGE_KEYS.TRIPS, plans),
  add: (plan: Omit<TripPlan, "id" | "createdAt">): TripPlan => {
    const current = travelPlansStorage.get();
    const newPlan: TripPlan = {
      ...plan,
      id: Math.random().toString(36).slice(2, 9),
      createdAt: new Date().toISOString(),
    };
    travelPlansStorage.save([newPlan, ...current]);
    return newPlan;
  },
  remove: (id: string): TripPlan[] => {
    const filtered = travelPlansStorage.get().filter((p) => p.id !== id);
    travelPlansStorage.save(filtered);
    return filtered;
  },
};

export type TaskItem = Task;
export type ExpenseItem = Expense;
export type TravelPlan = TripPlan;
