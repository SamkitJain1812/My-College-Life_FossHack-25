"use client";

import * as React from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  Check,
  Edit2,
  Trash2,
  Bell,
  BellRing,
  ArrowUpDown,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useLocalStorage, STORAGE_KEYS } from "@/lib/storage";
import type { Task } from "@/lib/types";

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "CS 106B Problem Set 3",
    description: "Recursion, backtracking & binary tree implementations.",
    course: "CS 106B",
    dueDate: "2024-10-22T23:59:00",
    priority: "high",
    status: "pending",
    notes: "Late penalty: -5%/day. Focus on base cases.",
    createdAt: "2024-10-18T10:00:00Z",
  },
  {
    id: "task-2",
    title: "Draft Intro Paragraph for Philosophy Paper",
    description: "Formulate central thesis on utilitarian critiques of virtue ethics, citing Foot and Thomson examples.",
    course: "PHIL 02",
    dueDate: "2024-10-24T17:00:00",
    priority: "high",
    status: "pending",
    notes: "Office hours notes in Notion.",
    createdAt: "2024-10-20T11:00:00Z",
  },
  {
    id: "task-3",
    title: "Group Project: UI Wireframes for Campus Club",
    description: "Collaborate in Figma to finish low-fidelity flow diagrams for mobile club check-in kiosk screen.",
    course: "CS 147",
    dueDate: "2024-10-28T18:00:00",
    priority: "medium",
    status: "in-progress",
    createdAt: "2024-10-21T09:00:00Z",
  },
  {
    id: "task-4",
    title: "Return library book: Cognitive Psychology",
    description: "Green Library main circulation desk, 2nd floor drop box.",
    course: "PSYCH 50",
    dueDate: "2024-10-29T16:00:00",
    priority: "low",
    status: "pending",
    createdAt: "2024-10-22T13:00:00Z",
  },
  {
    id: "task-5",
    title: "Submit Math 51 Problem Set 4",
    description: "Multivariable calculus matrices, eigenvectors & Gram-Schmidt proofs uploaded to Gradescope.",
    course: "MATH 51",
    dueDate: "2024-10-23T09:30:00",
    priority: "medium",
    status: "completed",
    completedAt: "2024-10-23T09:15:00Z",
    createdAt: "2024-10-19T14:00:00Z",
  },
];

export default function TasksPage() {
  const { toast } = useToast();
  const [tasks, setTasks, isHydrated] = useLocalStorage<Task[]>(
    STORAGE_KEYS.TASKS,
    INITIAL_TASKS
  );

  // Filters & Sorting
  const [statusFilter, setStatusFilter] = React.useState<"all" | "pending" | "in-progress" | "completed">("all");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [sortBy, setSortBy] = React.useState<"deadline-asc" | "deadline-desc" | "priority">("deadline-asc");

  // Notifications Permission
  const [hasNotificationPermission, setHasNotificationPermission] = React.useState(false);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTaskId, setEditingTaskId] = React.useState<string | null>(null);

  // Form Fields
  const [titleInput, setTitleInput] = React.useState("");
  const [courseInput, setCourseInput] = React.useState("CS 106B");
  const [dueDateInput, setDueDateInput] = React.useState("");
  const [priorityInput, setPriorityInput] = React.useState<"high" | "medium" | "low">("medium");
  const [statusInput, setStatusInput] = React.useState<"pending" | "in-progress" | "completed">("pending");
  const [descInput, setDescInput] = React.useState("");
  const [formError, setFormError] = React.useState("");

  // Check browser notification support
  React.useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setHasNotificationPermission(Notification.permission === "granted");
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not Supported",
        description: "Browser notifications are not supported on this device.",
        variant: "warning",
      });
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setHasNotificationPermission(true);
      new Notification("College Life Reminders Enabled! 🎓", {
        body: "We will alert you before assignment deadlines.",
      });
      toast({
        title: "Reminders Enabled",
        description: "You will receive desktop alerts for approaching deadlines.",
        variant: "success",
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "Notifications were blocked in your browser settings.",
        variant: "warning",
      });
    }
  };

  // Helper to check if task is overdue
  const isTaskOverdue = (task: Task): boolean => {
    if (task.status === "completed" || !task.dueDate) return false;
    const dueTime = new Date(task.dueDate).getTime();
    return !isNaN(dueTime) && dueTime < Date.now();
  };

  // Helper to check if task is due today
  const isTaskDueToday = (task: Task): boolean => {
    if (task.status === "completed" || !task.dueDate) return false;
    const due = new Date(task.dueDate);
    const today = new Date();
    return (
      due.getFullYear() === today.getFullYear() &&
      due.getMonth() === today.getMonth() &&
      due.getDate() === today.getDate()
    );
  };

  // Computed metrics
  const overdueTasks = tasks.filter(isTaskOverdue);
  const dueTodayTasks = tasks.filter(isTaskDueToday);
  const completedTasks = tasks.filter((t) => t.status === "completed");
  const pendingTasks = tasks.filter((t) => t.status === "pending" || t.status === "in-progress");
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Toggle status between completed and pending
  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newStatus = t.status === "completed" ? "pending" : "completed";
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === "completed" ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  // Open modal for Adding new task
  const openAddModal = () => {
    setEditingTaskId(null);
    setTitleInput("");
    setCourseInput("CS 106B");
    setDueDateInput(new Date(Date.now() + 86400000).toISOString().slice(0, 16));
    setPriorityInput("medium");
    setStatusInput("pending");
    setDescInput("");
    setFormError("");
    setIsModalOpen(true);
  };

  // Open modal for Editing task
  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setTitleInput(task.title);
    setCourseInput(task.course || "General");
    setDueDateInput(task.dueDate ? task.dueDate.slice(0, 16) : "");
    setPriorityInput(task.priority);
    setStatusInput(task.status);
    setDescInput(task.description || "");
    setFormError("");
    setIsModalOpen(true);
  };

  // Delete task
  const handleDeleteTask = (id: string, title: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Task Deleted",
      description: `Removed "${title}"`,
      variant: "warning",
    });
  };

  // Save task (create or edit)
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) {
      setFormError("Task title is required.");
      return;
    }

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                title: titleInput.trim(),
                course: courseInput.trim(),
                dueDate: dueDateInput || undefined,
                priority: priorityInput,
                status: statusInput,
                description: descInput.trim() || undefined,
              }
            : t
        )
      );
      toast({
        title: "Task Updated",
        description: `Saved changes to "${titleInput.trim()}"`,
        variant: "success",
      });
    } else {
      const newTask: Task = {
        id: `task-${Math.random().toString(36).slice(2, 9)}`,
        title: titleInput.trim(),
        course: courseInput.trim(),
        dueDate: dueDateInput || undefined,
        priority: priorityInput,
        status: statusInput,
        description: descInput.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      toast({
        title: "Task Created",
        description: `Added "${titleInput.trim()}" to ${courseInput}`,
        variant: "success",
      });
    }

    setIsModalOpen(false);
  };

  // Filter & sort tasks
  const filteredTasks = tasks
    .filter((t) => {
      if (statusFilter === "pending" && t.status !== "pending") return false;
      if (statusFilter === "in-progress" && t.status !== "in-progress") return false;
      if (statusFilter === "completed" && t.status !== "completed") return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "deadline-asc") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "deadline-desc") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortBy === "priority") {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Semester Task Manager
            </h1>
          </div>
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { id: "all", label: `All Tasks (${tasks.length})` },
              { id: "pending", label: `To do (${tasks.filter((t) => t.status === "pending").length})` },
              { id: "in-progress", label: `In progress (${tasks.filter((t) => t.status === "in-progress").length})` },
              { id: "completed", label: `Done (${completedTasks.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? "bg-[#635BFF] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filter, Sorter & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Priority filter pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
            {["all", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                  priorityFilter === p
                    ? "bg-white dark:bg-surface font-bold shadow-xs text-slate-900 dark:text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {p === "all" ? "All" : p}
              </button>
            ))}
          </div>

          {/* Sorter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-9 px-3 rounded-xl border border-border bg-white dark:bg-surface text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
          >
            <option value="deadline-asc">Deadline (Earliest)</option>
            <option value="deadline-desc">Deadline (Latest)</option>
            <option value="priority">Priority (High to Low)</option>
          </select>

          {/* Optional Browser Notification toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={requestNotificationPermission}
            className={`rounded-xl text-xs font-semibold h-9 gap-1.5 ${
              hasNotificationPermission ? "text-[#00D287] border-[#00D287]/40" : ""
            }`}
            title="Browser deadline notifications"
          >
            {hasNotificationPermission ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{hasNotificationPermission ? "Reminders On" : "Enable Reminders"}</span>
          </Button>

          <Button
            size="sm"
            onClick={openAddModal}
            className="rounded-xl bg-[#635BFF] hover:bg-[#5046E5] text-white gap-1.5 font-bold text-xs h-9 shadow-sm shadow-[#635BFF]/25"
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Overdue alert banner if any overdue tasks exist */}
      {overdueTasks.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FFECEC] dark:bg-[#FF5252]/15 border border-[#FF5252]/30 text-xs text-[#FF5252] animate-fade-in">
          <div className="flex items-center gap-2.5 font-semibold">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>
              <strong>{overdueTasks.length} task is overdue!</strong> Complete it today to protect your weekly study velocity score.
            </span>
          </div>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              setStatusFilter("pending");
              setPriorityFilter("all");
            }}
            className="rounded-xl h-8 text-xs font-bold shrink-0"
          >
            Resolve Overdue
          </Button>
        </div>
      )}

      {/* Main Grid: Left task list (8 cols), Right velocity & radar (4 cols) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Tasks List */}
        <div className="lg:col-span-8 space-y-3.5">
          {filteredTasks.length === 0 ? (
            <EmptyState
              title="No tasks found"
              description="You have no tasks matching the selected filters. Great job or time to add a new assignment!"
              action={
                <Button size="sm" onClick={openAddModal}>
                  <Plus className="h-4 w-4 mr-1.5" /> Create a Task
                </Button>
              }
              className="py-16"
            />
          ) : (
            filteredTasks.map((t) => {
              const isDone = t.status === "completed";
              const isOverdue = isTaskOverdue(t);
              const formattedDate = t.dueDate
                ? new Date(t.dueDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : null;

              return (
                <Card
                  key={t.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isDone
                      ? "bg-slate-50/60 dark:bg-slate-900/20 border-border/60 opacity-80"
                      : isOverdue
                      ? "bg-red-50/20 dark:bg-red-950/10 border-red-200 dark:border-red-900/30 shadow-xs"
                      : "bg-white dark:bg-surface border-border shadow-xs hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox button */}
                    <button
                      onClick={() => toggleTaskStatus(t.id)}
                      className={`h-5 w-5 rounded-md flex items-center justify-center mt-0.5 transition-all shrink-0 ${
                        isDone
                          ? "bg-[#00D287] text-white"
                          : "border-2 border-slate-300 dark:border-slate-600 hover:border-[#635BFF]"
                      }`}
                    >
                      {isDone && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </button>

                    {/* Task Details */}
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              t.priority === "high"
                                ? "danger"
                                : t.priority === "medium"
                                ? "warning"
                                : "success"
                            }
                            size="sm"
                          >
                            • {t.priority.toUpperCase()} PRIORITY
                          </Badge>

                          {t.course && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {t.course}
                            </span>
                          )}

                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">
                            {t.status === "in-progress" ? "In Progress" : t.status}
                          </span>
                        </div>

                        {formattedDate && (
                          <span
                            className={`text-xs font-bold flex items-center gap-1 ${
                              isOverdue ? "text-[#FF5252]" : "text-slate-500"
                            }`}
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            {isOverdue && "⚠️ OVERDUE: "}
                            {formattedDate}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-base font-bold ${
                          isDone ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {t.title}
                      </h3>

                      {t.description && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {t.description}
                        </p>
                      )}

                      {t.notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          Notes: {t.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions: Edit / Delete */}
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="text-slate-400 hover:text-[#635BFF] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit Task"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(t.id, t.title)}
                        className="text-slate-400 hover:text-[#FF5252] p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Right Column: Velocity & Deadlines Radar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Due Today & Overdue Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4 rounded-3xl bg-white dark:bg-surface border-border shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Due Today
              </span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {dueTodayTasks.length}
              </p>
              <p className="text-[10px] text-slate-400">Due before midnight</p>
            </Card>

            <Card className="p-4 rounded-3xl bg-white dark:bg-surface border-border shadow-xs">
              <span className="text-[11px] font-bold text-[#FF5252] uppercase tracking-wider block mb-1">
                Overdue
              </span>
              <p className="text-2xl font-black text-[#FF5252]">
                {overdueTasks.length}
              </p>
              <p className="text-[10px] text-slate-400">Immediate action needed</p>
            </Card>
          </div>

          {/* Weekly Velocity Card */}
          <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Weekly Velocity
              </span>
              <Badge variant="primary" size="sm">Active</Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 flex items-center justify-center shrink-0">
                <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#ECEEF5" strokeWidth="10" fill="none" className="dark:stroke-slate-800" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#635BFF"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray="238.76"
                    strokeDashoffset={238.76 - (238.76 * completionPercentage) / 100}
                    className="transition-all duration-500"
                  />
                </svg>
                <span className="absolute text-sm font-black text-slate-900 dark:text-white">
                  {completionPercentage}%
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-base font-black text-slate-900 dark:text-white">
                  {completedTasks.length} of {tasks.length} completed
                </p>
                <p className="text-xs text-slate-500 leading-tight">
                  {overdueTasks.length === 0
                    ? "Great momentum, all current assignments on schedule!"
                    : `${overdueTasks.length} overdue task(s) awaiting resolution.`}
                </p>
              </div>
            </div>
          </Card>

          {/* Deadlines Radar */}
          <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Deadlines Radar
              </span>
              <span className="text-xs font-semibold text-slate-400">Upcoming</span>
            </div>
            <div className="space-y-2 text-xs divide-y divide-border/50">
              {tasks
                .filter((t) => t.status !== "completed" && t.dueDate)
                .slice(0, 4)
                .map((t) => {
                  const overdue = isTaskOverdue(t);
                  return (
                    <div key={t.id} className="flex items-center justify-between py-2">
                      <div className="truncate pr-2">
                        <p className={`font-semibold truncate ${overdue ? "text-[#FF5252]" : "text-foreground"}`}>
                          • {t.title}
                        </p>
                        <span className="text-[10px] text-slate-400">{t.course}</span>
                      </div>
                      <span className={`text-[11px] font-bold shrink-0 ${overdue ? "text-[#FF5252]" : "text-slate-500"}`}>
                        {new Date(t.dueDate!).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </Card>
        </div>
      </div>

      {/* Modal: Create or Edit Task */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTaskId ? "✏️ Edit Task" : "📝 Create New Task"}
        description={
          editingTaskId
            ? "Update course deadlines, priority, and notes"
            : "Add a class assignment, quiz prep, or milestone"
        }
      >
        <form onSubmit={handleSaveTask} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-xs text-red-600 font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="e.g., Chem 101 Lab Report: Chromatography"
              value={titleInput}
              onChange={(e) => {
                setTitleInput(e.target.value);
                setFormError("");
              }}
              required
              autoFocus
              className="w-full h-11 px-3.5 text-sm font-semibold rounded-xl border border-input bg-surface focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Course / Category
              </label>
              <input
                type="text"
                placeholder="e.g., CS 106B or Campus Life"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Deadline Date & Time
              </label>
              <input
                type="datetime-local"
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["high", "medium", "low"] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriorityInput(p)}
                    className={`py-2 text-center rounded-xl text-xs font-bold border transition-all ${
                      priorityInput === p
                        ? "bg-[#635BFF] text-white border-[#635BFF]"
                        : "bg-surface border-border text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {p.slice(0, 1).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              >
                <option value="pending">To Do (Pending)</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Description or Milestones
            </label>
            <textarea
              rows={3}
              placeholder="Add study references, problem set questions, or partner notes..."
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              className="w-full p-3 text-xs font-medium rounded-xl border border-input bg-surface focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold">
              {editingTaskId ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
