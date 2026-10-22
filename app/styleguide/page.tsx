"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Info,
  Layers,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { ModeToggle } from "@/components/mode-toggle";

export default function StyleguidePage() {
  return (
    <ToastProvider>
      <StyleguideContent />
    </ToastProvider>
  );
}

function StyleguideContent() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [inputError, setInputError] = React.useState("");
  const { toast } = useToast();

  const handleTestError = () => {
    if (!inputValue) {
      setInputError("This field cannot be empty!");
    } else {
      setInputError("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </Button>
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-bold text-sm sm:text-base">Design System & Styleguide</span>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-10 space-y-16">
        {/* Intro */}
        <div className="space-y-3">
          <Badge variant="primary" size="md">
            <Sparkles className="h-3 w-3" /> Design Foundation
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">Design System & UI Components</h1>
          <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
            Live preview of all shared design tokens, color variables, typography, interactive states, and reusable components built for <strong>My College Life</strong>.
          </p>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight">1. Color Tokens</h2>
            <p className="text-xs text-muted-foreground">Tokens mapped to CSS variables for dynamic light & dark themes.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { name: "Primary", token: "bg-primary text-primary-foreground", hex: "hsl(var(--primary))", usage: "Main brand, CTA buttons" },
              { name: "Secondary", token: "bg-secondary text-secondary-foreground border border-border", hex: "hsl(var(--secondary))", usage: "Subtle backgrounds, secondary buttons" },
              { name: "Surface (Card)", token: "bg-surface text-surface-foreground border border-border", hex: "hsl(var(--surface))", usage: "Cards, modals, dropdowns" },
              { name: "Background / Text", token: "bg-background text-foreground border border-border", hex: "hsl(var(--background))", usage: "Root app background & body text" },
              { name: "Success", token: "bg-success text-success-foreground", hex: "hsl(var(--success))", usage: "Completed tasks, saved states" },
              { name: "Warning", token: "bg-warning text-warning-foreground", hex: "hsl(var(--warning))", usage: "Upcoming deadlines, budget warnings" },
              { name: "Danger", token: "bg-danger text-danger-foreground", hex: "hsl(var(--danger))", usage: "Overbudget, errors, delete actions" },
              { name: "Accent", token: "bg-accent text-accent-foreground border border-border", hex: "hsl(var(--accent))", usage: "Highlights, active tabs, pill badges" },
            ].map((col) => (
              <div key={col.name} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-subtle">
                <div className={`h-20 w-full flex items-center justify-center font-bold text-sm ${col.token}`}>
                  {col.name}
                </div>
                <div className="p-3 text-xs space-y-1">
                  <p className="font-semibold text-foreground">{col.name}</p>
                  <p className="text-muted-foreground font-mono text-[11px]">{col.hex}</p>
                  <p className="text-[11px] text-muted-foreground/80">{col.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Buttons */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight">2. Buttons</h2>
            <p className="text-xs text-muted-foreground">Configurable with variants, sizes, and loading state.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variants & Sizes</CardTitle>
              <CardDescription>Hover and click to inspect micro-interactions and transitions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md)</Button>
                <Button size="lg">Large (lg)</Button>
                <Button size="icon" variant="outline" title="Icon Button">
                  <Sparkles className="h-4 w-4" />
                </Button>
                <Button isLoading variant="primary">
                  Loading State
                </Button>
                <Button disabled variant="primary">
                  Disabled
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 3. Badges */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight">3. Badges</h2>
            <p className="text-xs text-muted-foreground">Used for tags, categories, task priority, and status indicators.</p>
          </div>

          <div className="flex flex-wrap gap-2.5 items-center">
            <Badge variant="default">Default</Badge>
            <Badge variant="primary">Primary Tag</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" /> Completed
            </Badge>
            <Badge variant="warning">
              <AlertTriangle className="h-3 w-3" /> Due Soon
            </Badge>
            <Badge variant="danger">High Priority</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="primary" size="sm">Small Badge</Badge>
          </div>
        </section>

        {/* 4. Form Controls: Input & Select */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight">4. Form Inputs & Selects</h2>
            <p className="text-xs text-muted-foreground">Accessible inputs with error messages, label support, and focus rings.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Input Field</CardTitle>
                <CardDescription>Interactive test for validation and typing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Task Title"
                  placeholder="e.g., Computer Networks Lab Report"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (inputError) setInputError("");
                  }}
                  error={inputError}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleTestError}>
                    Trigger Validation Check
                  </Button>
                </div>

                <Input
                  label="Disabled Input"
                  placeholder="Read-only or disabled input"
                  disabled
                  defaultValue="Cannot edit this"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dropdown Select</CardTitle>
                <CardDescription>Styled select element with chevron and options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  label="Task Priority"
                  options={[
                    { label: "Low Priority", value: "low" },
                    { label: "Medium Priority", value: "medium" },
                    { label: "High Priority (Urgent)", value: "high" },
                  ]}
                  defaultValue="medium"
                />

                <Select
                  label="Expense Category"
                  options={[
                    { label: "Food & Canteen", value: "food" },
                    { label: "Study Materials / Books", value: "books" },
                    { label: "Travel & Commute", value: "travel" },
                    { label: "Hostel & Utilities", value: "hostel" },
                    { label: "Entertainment", value: "fun" },
                  ]}
                  defaultValue="food"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 5. Tabs */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight">5. Tabs Navigation</h2>
            <p className="text-xs text-muted-foreground">Accessible tab switcher for segmented views.</p>
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Module Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Overview Tab Content</CardTitle>
                  <CardDescription>Active view showing general summary metrics.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This demonstrates smooth transition between tabs without page reloads.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Analytics Tab Content</CardTitle>
                  <CardDescription>Visual breakdown of monthly expense distribution.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Spending trends and completed assignments graph will render in this tab.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Settings Tab Content</CardTitle>
                  <CardDescription>Configure local storage preferences and data exports.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    All user configurations persist in browser localStorage.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* 6. Empty State & Spinners */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight">6. Empty States & Loading Spinners</h2>
            <p className="text-xs text-muted-foreground">Mandatory loading and empty states required by project architecture.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-start">
            <EmptyState
              icon={<FolderOpen className="h-6 w-6" />}
              title="No Study Notes Generated"
              description="Ask the AI Study Assistant to summarize lecture topics or generate revision flashcards."
              action={<Button size="sm">Ask Study Assistant</Button>}
            />

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-base">Loading Spinners</h3>
              <p className="text-xs text-muted-foreground">Available in small, medium, and large sizes:</p>
              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-[11px] text-muted-foreground">Small (sm)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-[11px] text-muted-foreground">Medium (md)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-[11px] text-muted-foreground">Large (lg)</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 7. Modal Dialog & Toasts */}
        <section className="space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-2xl font-bold tracking-tight">7. Modal & Toast Notifications</h2>
            <p className="text-xs text-muted-foreground">Overlay dialogs and non-intrusive feedback notifications.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Interactive Notification & Modal Triggers</CardTitle>
              <CardDescription>Click to test user feedback responses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setIsModalOpen(true)}>Open Modal Dialog</Button>
                <Button
                  variant="success"
                  onClick={() =>
                    toast({
                      title: "Saved Successfully",
                      description: "Your task was written to browser localStorage.",
                      variant: "success",
                    })
                  }
                >
                  Success Toast
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    toast({
                      title: "Budget Warning",
                      description: "You have reached 80% of your monthly expense limit.",
                      variant: "warning",
                    })
                  }
                >
                  Warning Toast
                </Button>
                <Button
                  variant="danger"
                  onClick={() =>
                    toast({
                      title: "Action Failed",
                      description: "Unable to process request without valid input.",
                      variant: "destructive",
                    })
                  }
                >
                  Error Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal Dialog"
        description="This modal handles outside clicks, Escape key dismissal, and backdrop blur."
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Modals can be used to add new assignments, log expenses, confirm deletion, or prompt AI travel parameters.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                toast({
                  title: "Action Confirmed",
                  description: "Changes were successfully saved.",
                  variant: "success",
                });
              }}
            >
              Confirm Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
