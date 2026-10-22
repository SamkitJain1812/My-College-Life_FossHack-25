import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-secondary text-secondary-foreground",
    primary: "bg-accent text-accent-foreground border border-primary/20",
    secondary: "bg-muted text-muted-foreground",
    success:
      "bg-success-surface text-success border border-success/30 font-medium",
    warning:
      "bg-warning-surface text-warning border border-warning/30 font-medium",
    danger:
      "bg-danger-surface text-danger border border-danger/30 font-medium",
    outline: "border border-border text-foreground bg-transparent",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] rounded-md",
    md: "px-2.5 py-1 text-xs rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold leading-none tracking-wide select-none transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  );
}
