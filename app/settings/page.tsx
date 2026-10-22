"use client";

import * as React from "react";
import {
  Settings,
  Download,
  Upload,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Database,
  FileJson,
  RefreshCw,
  HardDrive,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import {
  downloadBackupFile,
  importAllData,
  exportAllData,
  clearAllData,
  useLocalStorage,
  STORAGE_KEYS,
} from "@/lib/storage";

export default function SettingsPage() {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false);
  const [importedStatus, setImportedStatus] = React.useState<string | null>(null);

  // Hook-based state bindings for counts
  const [expenses] = useLocalStorage(STORAGE_KEYS.EXPENSES, []);
  const [tasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);
  const [trips] = useLocalStorage(STORAGE_KEYS.TRIPS, []);
  const [chatSessions] = useLocalStorage(STORAGE_KEYS.CHAT_SESSIONS, []);

  const handleExport = () => {
    try {
      downloadBackupFile();
      toast({
        title: "Backup Downloaded",
        description: "Your college data was saved to a JSON backup file.",
        variant: "success",
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: err instanceof Error ? err.message : "Could not export data.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const result = importAllData(content);
        if (result.success) {
          setImportedStatus(`Restored successfully from ${file.name}`);
          toast({
            title: "Backup Restored!",
            description: "All tasks, expenses, and portfolio items are now loaded.",
            variant: "success",
          });
          // Reload window after brief delay so all state providers sync
          setTimeout(() => {
            window.location.reload();
          }, 800);
        } else {
          toast({
            title: "Restore Failed",
            description: result.message,
            variant: "destructive",
          });
        }
      } catch (err) {
        toast({
          title: "Invalid File",
          description: "Please select a valid JSON backup file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearAll = () => {
    clearAllData();
    setIsResetModalOpen(false);
    toast({
      title: "Data Reset",
      description: "All local storage records have been cleared.",
      variant: "warning",
    });
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl pb-16">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#635BFF] uppercase tracking-wider">
            <Settings className="h-3.5 w-3.5" /> Preferences & Storage
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Settings & Data Backup
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Export your data to keep a personal offline backup or restore previous semester records.
          </p>
        </div>
      </div>

      {/* Storage Status & Backup Card */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Export / Download */}
        <Card className="rounded-3xl border-border bg-white dark:bg-surface shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center font-bold">
                <Download className="h-5 w-5" />
              </div>
              <Badge variant="primary">Offline Safe</Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Export Backup File
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Downloads a single, human-readable <code className="font-mono text-[#635BFF]">.json</code> file containing all your tasks, budgets, logged expenses, travel itineraries, and portfolio details.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={handleExport}
              className="w-full rounded-xl bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold text-xs h-11 gap-2 shadow-sm shadow-[#635BFF]/25"
            >
              <FileJson className="h-4 w-4" /> Download All Data (JSON)
            </Button>
          </div>
        </Card>

        {/* Import / Restore */}
        <Card className="rounded-3xl border-border bg-white dark:bg-surface shadow-xs p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-2xl bg-[#00D287]/15 text-[#00D287] flex items-center justify-center font-bold">
                <Upload className="h-5 w-5" />
              </div>
              <Badge variant="success">JSON Restore</Badge>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Restore From Backup
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Select a previously exported JSON backup file to instantly populate your dashboard and replace current local storage.
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-xl border-border font-bold text-xs h-11 gap-2"
            >
              <Upload className="h-4 w-4 text-[#00D287]" /> Choose JSON Backup File
            </Button>
            {importedStatus && (
              <p className="text-[11px] text-[#00D287] text-center font-semibold">
                ✓ {importedStatus}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Storage Inspector Card */}
      <Card className="rounded-3xl border-border bg-white dark:bg-surface shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-slate-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Current Local Storage Records
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">100% Client-Side Only</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
            <p className="text-xs text-slate-400 font-semibold">Tasks</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{tasks.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
            <p className="text-xs text-slate-400 font-semibold">Expenses</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{expenses.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
            <p className="text-xs text-slate-400 font-semibold">Saved Trips</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{trips.length}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
            <p className="text-xs text-slate-400 font-semibold">AI Sessions</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{chatSessions.length}</p>
          </div>
        </div>
      </Card>

      {/* Danger Zone: Reset Data */}
      <Card className="rounded-3xl border-red-200/60 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#FF5252] flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" /> Reset All Local Data
          </h3>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Permanently clear all cached tasks, expenses, and travel plans from this browser. This cannot be undone unless you have a JSON backup.
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setIsResetModalOpen(true)}
          className="rounded-xl text-xs font-bold shrink-0 gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" /> Wipe Local Storage
        </Button>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Wipe all local data?"
        description="Are you sure you want to clear your college companion data?"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            This will permanently remove all tasks, expenses, budgets, travel plans, and chat notes from your browser localStorage.
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleClearAll} className="font-bold">
              Yes, Wipe Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
