"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface QueryStatePanelProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  loadingMessage?: string;
  className?: string;
  children: React.ReactNode;
}

export function QueryStatePanel({
  isLoading,
  isError,
  errorMessage,
  loadingMessage = "Loading...",
  className,
  children,
}: QueryStatePanelProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex min-h-40 items-center justify-center rounded-xl border border-border bg-card p-4",
          className,
        )}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner />
          <span>{loadingMessage}</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          "flex min-h-40 items-center justify-center rounded-xl border border-destructive/20 bg-card p-4",
          className,
        )}
      >
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage ?? "Failed to load data."}</span>
        </div>
      </div>
    );
  }

  return children;
}
