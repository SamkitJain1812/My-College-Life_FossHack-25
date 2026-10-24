"use client";

import * as React from "react";
import {
  Wallet,
  TrendingUp,
  Download,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Calendar,
  X,
  CreditCard,
  DollarSign,
  PieChart as PieIcon,
  ChevronDown,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { useLocalStorage, STORAGE_KEYS, defaultBudget } from "@/lib/storage";
import type { Expense, Budget } from "@/lib/types";

const CATEGORIES = [
  { name: "Food & Dining", icon: "🍔", color: "#FF5252" },
  { name: "Supplies & Textbooks", icon: "📚", color: "#0984E3" },
  { name: "Transport & Gas", icon: "🚗", color: "#FF9F43" },
  { name: "Entertainment & Fun", icon: "🎮", color: "#635BFF" },
  { name: "Bills & Subscriptions", icon: "⚡", color: "#E056FD" },
  { name: "Health & Personal", icon: "💊", color: "#00D287" },
  { name: "Other", icon: "📦", color: "#64748B" },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: "tx-1",
    amount: 14.50,
    category: "Food & Dining",
    description: "Campus Boba & Ramen",
    notes: "with Study Group",
    paymentMethod: "Apple Pay",
    date: "2024-10-20",
    createdAt: "2024-10-20T12:30:00Z",
  },
  {
    id: "tx-2",
    amount: 49.00,
    category: "Supplies & Textbooks",
    description: "Used Organic Chemistry Textbook",
    notes: "via Chem Student Bookstore",
    paymentMethod: "Debit Card",
    date: "2024-10-21",
    createdAt: "2024-10-21T15:10:00Z",
  },
  {
    id: "tx-3",
    amount: 7.25,
    category: "Transport & Gas",
    description: "Caltrain ticket to San Francisco",
    notes: "Weekend museum exhibit",
    paymentMethod: "Clipper Card",
    date: "2024-10-19",
    createdAt: "2024-10-19T09:40:00Z",
  },
  {
    id: "tx-4",
    amount: 18.00,
    category: "Entertainment & Fun",
    description: "Movie night ticket & popcorn",
    notes: "Dune 2 Re-release",
    paymentMethod: "Apple Pay",
    date: "2024-10-17",
    createdAt: "2024-10-17T20:15:00Z",
  },
  {
    id: "tx-5",
    amount: 8.99,
    category: "Bills & Subscriptions",
    description: "Spotify & Notion Student Bundle",
    notes: "Student plan recurrent billing",
    paymentMethod: "Credit Card",
    date: "2024-10-14",
    createdAt: "2024-10-14T08:00:00Z",
  },
  {
    id: "tx-6",
    amount: 64.20,
    category: "Food & Dining",
    description: "Trader Joe's dorm groceries",
    notes: "Oats, yogurt, snacks & coffee",
    paymentMethod: "Debit Card",
    date: "2024-10-10",
    createdAt: "2024-10-10T17:45:00Z",
  },
  {
    id: "tx-7",
    amount: 32.50,
    category: "Health & Personal",
    description: "CVS vitamins & allergy meds",
    notes: "Campus health pharmacy",
    paymentMethod: "Apple Pay",
    date: "2024-10-06",
    createdAt: "2024-10-06T14:20:00Z",
  },
];

export default function FinancePage() {
  const { toast } = useToast();
  const [expenses, setExpenses, isHydrated] = useLocalStorage<Expense[]>(
    STORAGE_KEYS.EXPENSES,
    INITIAL_EXPENSES
  );
  const [budget, setBudget] = useLocalStorage<Budget>(
    STORAGE_KEYS.BUDGET,
    defaultBudget
  );

  // Month & Category filters
  const [selectedMonth, setSelectedMonth] = React.useState<string>("2024-10");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = React.useState<string>("All");

  // Modal State for Add / Edit
  const [isExpenseModalOpen, setIsExpenseModalOpen] = React.useState(false);
  const [editingExpenseId, setEditingExpenseId] = React.useState<string | null>(null);

  // Form fields
  const [amountInput, setAmountInput] = React.useState("");
  const [categoryInput, setCategoryInput] = React.useState(CATEGORIES[0].name);
  const [descInput, setDescInput] = React.useState("");
  const [notesInput, setNotesInput] = React.useState("");
  const [dateInput, setDateInput] = React.useState(new Date().toISOString().split("T")[0]);
  const [paymentMethodInput, setPaymentMethodInput] = React.useState("Apple Pay");
  const [formError, setFormError] = React.useState("");

  // Budget Edit Modal
  const [isBudgetModalOpen, setIsBudgetModalOpen] = React.useState(false);
  const [budgetInput, setBudgetInput] = React.useState(budget.monthlyLimit.toString());

  // Filtered expenses by Month
  const currentMonthExpenses = expenses.filter((e) => {
    if (!selectedMonth) return true;
    return e.date.startsWith(selectedMonth);
  });

  // Calculate totals
  const totalSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingCash = budget.monthlyLimit - totalSpent;
  const budgetPercentage = Math.round((totalSpent / (budget.monthlyLimit || 1)) * 100);
  const isOverBudget = remainingCash < 0;
  const isHighBudgetWarning = budgetPercentage >= 80;

  // Recharts: Category Breakdown Data
  const categoryData = React.useMemo(() => {
    const map = new Map<string, number>();
    currentMonthExpenses.forEach((e) => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount);
    });

    return Array.from(map.entries())
      .map(([name, value]) => {
        const found = CATEGORIES.find((c) => c.name === name);
        return {
          name,
          value: parseFloat(value.toFixed(2)),
          color: found ? found.color : "#635BFF",
          icon: found ? found.icon : "📦",
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [currentMonthExpenses]);

  // Recharts: Monthly Spending Trend Data
  const monthlyTrendData = [
    { month: "Jul", spend: 410, budget: budget.monthlyLimit },
    { month: "Aug", spend: 485, budget: budget.monthlyLimit },
    { month: "Sep", spend: 520, budget: budget.monthlyLimit },
    { month: "Oct", spend: totalSpent, budget: budget.monthlyLimit },
  ];

  // Open modal for Adding new expense
  const openAddModal = () => {
    setEditingExpenseId(null);
    setAmountInput("");
    setCategoryInput(CATEGORIES[0].name);
    setDescInput("");
    setNotesInput("");
    setDateInput(new Date().toISOString().split("T")[0]);
    setPaymentMethodInput("Apple Pay");
    setFormError("");
    setIsExpenseModalOpen(true);
  };

  // Open modal for Editing expense
  const openEditModal = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setAmountInput(expense.amount.toString());
    setCategoryInput(expense.category);
    setDescInput(expense.description);
    setNotesInput(expense.notes || "");
    setDateInput(expense.date);
    setPaymentMethodInput(expense.paymentMethod || "Apple Pay");
    setFormError("");
    setIsExpenseModalOpen(true);
  };

  // Submit expense (create or update)
  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountInput);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError("Please enter a valid amount greater than 0.");
      return;
    }
    if (!descInput.trim()) {
      setFormError("Please enter a description for this expense.");
      return;
    }

    if (editingExpenseId) {
      // Edit existing
      setExpenses((prev) =>
        prev.map((item) =>
          item.id === editingExpenseId
            ? {
                ...item,
                amount: parsedAmount,
                category: categoryInput,
                description: descInput.trim(),
                notes: notesInput.trim() || undefined,
                date: dateInput,
                paymentMethod: paymentMethodInput,
              }
            : item
        )
      );
      toast({
        title: "Expense Updated",
        description: `Updated "${descInput.trim()}" (₹${parsedAmount.toFixed(2)})`,
        variant: "success",
      });
    } else {
      // Add new
      const newExpense: Expense = {
        id: `tx-${Math.random().toString(36).slice(2, 9)}`,
        amount: parsedAmount,
        category: categoryInput,
        description: descInput.trim(),
        notes: notesInput.trim() || undefined,
        date: dateInput,
        paymentMethod: paymentMethodInput,
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [newExpense, ...prev]);
      toast({
        title: "Expense Logged",
        description: `Added ₹${parsedAmount.toFixed(2)} to ${categoryInput}`,
        variant: "success",
      });
    }

    setIsExpenseModalOpen(false);
  };

  // Delete expense
  const handleDeleteExpense = (id: string, desc: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Expense Deleted",
      description: `Removed "${desc}"`,
      variant: "warning",
    });
  };

  // Save updated budget
  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(budgetInput);
    if (isNaN(parsed) || parsed <= 0) {
      return;
    }
    setBudget((prev) => ({ ...prev, monthlyLimit: parsed }));
    setIsBudgetModalOpen(false);
    toast({
      title: "Budget Updated",
      description: `New monthly limit set to ₹${parsed.toFixed(2)}`,
      variant: "success",
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    if (currentMonthExpenses.length === 0) {
      toast({
        title: "No Data",
        description: "No expenses recorded for this month to export.",
        variant: "warning",
      });
      return;
    }
    const headers = "ID,Date,Category,Description,Notes,Payment Method,Amount\n";
    const rows = currentMonthExpenses
      .map(
        (e) =>
          `"${e.id}","${e.date}","${e.category}","${e.description}","${e.notes || ""}","${e.paymentMethod || ""}","${e.amount.toFixed(2)}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `college-expenses-${selectedMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Report Exported",
      description: `Downloaded ${currentMonthExpenses.length} transaction(s) as CSV.`,
      variant: "success",
    });
  };

  // Filtered rows for table
  const displayedExpenses = currentMonthExpenses.filter((e) => {
    if (selectedCategoryFilter === "All") return true;
    return e.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#635BFF] text-white flex items-center justify-center shadow-sm shadow-[#635BFF]/30">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Finance Tracker
              </h1>
              {/* Month Selector dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-border focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
              >
                <option value="2024-10">October 2024</option>
                <option value="2024-09">September 2024</option>
                <option value="2024-11">November 2024</option>
              </select>
            </div>
            <p className="text-xs text-slate-400">Fall Quarter • Month 2</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl gap-1.5 font-semibold text-xs border-border bg-white dark:bg-surface shadow-xs"
          >
            <Download className="h-3.5 w-3.5" /> Export Report
          </Button>
          <Button
            size="sm"
            onClick={openAddModal}
            className="rounded-xl bg-[#635BFF] hover:bg-[#5046E5] text-white gap-1.5 font-bold text-xs shadow-sm shadow-[#635BFF]/25"
          >
            <Plus className="h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Monthly Budget Card */}
        <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Monthly Budget</span>
            <button
              onClick={() => {
                setBudgetInput(budget.monthlyLimit.toString());
                setIsBudgetModalOpen(true);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-[#635BFF] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Budget Limit"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            ₹{budget.monthlyLimit.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-1">allocated for this month</p>
        </Card>

        {/* Total Spent Card */}
        <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span className="text-[#FF5252]">Total Spent</span>
            <span className="h-2 w-2 rounded-full bg-[#FF5252]" />
          </div>
          <div className="text-3xl font-black text-[#FF5252]">
            ₹{totalSpent.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {currentMonthExpenses.length} transactions recorded
          </p>
        </Card>

        {/* Remaining Cash Card */}
        <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs hover:shadow-card transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span className={isOverBudget ? "text-[#FF5252]" : "text-[#00D287]"}>
              {isOverBudget ? "Over Budget" : "Remaining Cash"}
            </span>
            <span className={`h-2 w-2 rounded-full ${isOverBudget ? "bg-[#FF5252]" : "bg-[#00D287]"}`} />
          </div>
          <div className={`text-3xl font-black ${isOverBudget ? "text-[#FF5252]" : "text-[#00D287]"}`}>
            ₹{Math.abs(remainingCash).toFixed(2)}
          </div>
          <p className={`text-xs font-semibold mt-1 ${isOverBudget ? "text-[#FF5252]" : "text-[#00D287]"}`}>
            {isOverBudget
              ? "Exceeded budget limit"
              : `₹${(remainingCash / 8).toFixed(2)}/day left • 8 days remaining`}
          </p>
        </Card>
      </div>

      {/* Budget Used Progress Bar & >80% Warning Banner */}
      <Card className="p-5 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-600 dark:text-slate-300">
            Monthly Budget Runway: <strong>{budgetPercentage}% used</strong> (₹{totalSpent.toFixed(2)} of ₹{budget.monthlyLimit.toFixed(2)})
          </span>
          <span className={isHighBudgetWarning ? "text-[#FF5252] font-black" : "text-[#00D287]"}>
            {isOverBudget ? "OVER BUDGET" : `${Math.max(0, 100 - budgetPercentage)}% remaining`}
          </span>
        </div>

        {/* Dynamic colored progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? "bg-[#FF5252]"
                : isHighBudgetWarning
                ? "bg-gradient-to-r from-[#FF9F43] to-[#FF5252]"
                : "bg-gradient-to-r from-[#635BFF] to-[#00D287]"
            }`}
            style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
          />
        </div>

        {/* Warning Alert Banner when > 80% */}
        {isHighBudgetWarning && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#FEF5E7] dark:bg-[#FF9F43]/15 border border-[#FF9F43]/30 text-xs text-[#FF9F43] font-semibold animate-fade-in">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              <strong>Budget Alert:</strong> You have consumed {budgetPercentage}% of your monthly limit with 8 days remaining in this cycle. Consider saving on discretionary spending.
            </span>
          </div>
        )}
      </Card>

      {/* Middle Row: Recharts Category Breakdown & Spending Trend */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Recharts Category Breakdown Donut */}
        <Card className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-[#635BFF]" /> Spending by Category
              </h2>
              <p className="text-xs text-slate-400">Visual distribution of expenses across categories</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {categoryData.length} Active Categories
            </span>
          </div>

          {categoryData.length === 0 ? (
            <EmptyState
              title="No expenses logged"
              description="Add your first expense for this month to see the category breakdown."
              className="py-10"
            />
          ) : (
            <div className="grid sm:grid-cols-12 gap-4 items-center">
              {/* Donut Chart */}
              <div className="sm:col-span-6 h-56 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val || 0).toFixed(2)}`, "Spent"]}
                      contentStyle={{
                        backgroundColor: "#1E293B",
                        borderRadius: "12px",
                        border: "none",
                        color: "#fff",
                        fontSize: "12px",
                      }}
                    />
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    ₹{totalSpent.toFixed(0)}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="sm:col-span-6 space-y-2">
                {categoryData.map((cat) => {
                  const pct = totalSpent > 0 ? Math.round((cat.value / totalSpent) * 100) : 0;
                  return (
                    <div
                      key={cat.name}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="truncate font-semibold text-slate-700 dark:text-slate-300">
                          {cat.icon} {cat.name}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-900 dark:text-white">₹{cat.value.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 ml-1 font-semibold">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Right: Recharts Spending Trend Bar Chart */}
        <Card className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-surface border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#635BFF]" /> Monthly Spend Trend
              </h2>
              <p className="text-xs text-slate-400">Quarterly comparison vs ₹650 budget cap</p>
            </div>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [`₹${Number(val || 0).toFixed(2)}`, "Total Spend"]}
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <ReferenceLine y={budget.monthlyLimit} stroke="#FF5252" strokeDasharray="3 3" label={{ value: "Cap", fill: "#FF5252", fontSize: 10 }} />
                <Bar dataKey="spend" fill="#635BFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-border/60">
            <span>• Purple: Actual Monthly Spend</span>
            <span className="text-[#FF5252]">• Dashed Red: Budget Cap (₹650)</span>
          </div>
        </Card>
      </div>

      {/* Transactions Table Section */}
      <Card className="rounded-3xl bg-white dark:bg-surface border-border p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Recent Transactions ({displayedExpenses.length})
            </h2>
            <p className="text-xs text-slate-400">All categorized transactions for {selectedMonth}</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {["All", "Food", "Supplies", "Transport", "Fun", "Bills"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedCategoryFilter === cat
                    ? "bg-[#635BFF] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State or Table */}
        {displayedExpenses.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description={
              selectedCategoryFilter === "All"
                ? "You haven't logged any expenses for this month yet."
                : `No expenses found in category "${selectedCategoryFilter}".`
            }
            action={
              <Button size="sm" onClick={openAddModal}>
                <Plus className="h-4 w-4 mr-1.5" /> Log First Expense
              </Button>
            }
            className="py-12"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-slate-400 uppercase font-bold tracking-wider">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Description / Note</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {displayedExpenses.map((tx) => {
                  const catItem = CATEGORIES.find((c) => c.name === tx.category);
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-3 font-medium text-slate-500 whitespace-nowrap">
                        {tx.date}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 font-bold text-slate-700 dark:text-slate-300">
                          <span>{catItem ? catItem.icon : "📦"}</span>
                          <span className="truncate">{tx.category}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900 dark:text-white">{tx.description}</p>
                        {tx.notes && <p className="text-[11px] text-slate-400">{tx.notes}</p>}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 font-medium">
                        💳 {tx.paymentMethod || "Debit Card"}
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-sm text-[#FF5252]">
                        -₹{tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openEditModal(tx)}
                            className="text-slate-400 hover:text-[#635BFF] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(tx.id, tx.description)}
                            className="text-slate-400 hover:text-[#FF5252] p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: Add or Edit Expense */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title={editingExpenseId ? "✏️ Edit Expense" : "💸 Add New Expense"}
        description={
          editingExpenseId
            ? "Update the details for this recorded transaction"
            : "Track your college spending in seconds"
        }
      >
        <form onSubmit={handleSaveExpense} className="space-y-4 pt-2">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 text-xs text-red-600 font-semibold">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Amount Spent (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-xl text-[#635BFF]">₹</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value);
                  setFormError("");
                }}
                autoFocus
                required
                className="w-full h-12 pl-8 pr-3 text-xl font-black rounded-xl border border-input bg-surface focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Description / Title
            </label>
            <input
              type="text"
              placeholder="e.g., Campus Boba & Ramen"
              value={descInput}
              onChange={(e) => {
                setDescInput(e.target.value);
                setFormError("");
              }}
              required
              className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Additional Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., with CS Study Group or Split with Alex"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-surface text-xs font-semibold placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Apple Pay", "Debit Card", "Cash"].map((pm) => (
                <button
                  type="button"
                  key={pm}
                  onClick={() => setPaymentMethodInput(pm)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all ${
                    paymentMethodInput === pm
                      ? "bg-[#635BFF] text-white border-[#635BFF]"
                      : "bg-surface border-border text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold">
              {editingExpenseId ? "Update Expense" : "Save Expense"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Monthly Budget */}
      <Modal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        title="🎯 Set Monthly Budget"
        description="Configure your total spending allowance for this month"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Monthly Limit (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-xl text-[#635BFF]">₹</span>
              <input
                type="number"
                step="10"
                min="50"
                placeholder="650"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                autoFocus
                required
                className="w-full h-12 pl-8 pr-3 text-xl font-black rounded-xl border border-input bg-surface focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500">
            A progress bar will track your expenditures against this amount and trigger a warning when you reach 80%.
          </p>
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsBudgetModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" className="bg-[#635BFF] hover:bg-[#5046E5] text-white font-bold">
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
