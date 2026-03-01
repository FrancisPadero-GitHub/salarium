"use client";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

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
          "flex min-h-40 items-center justify-center rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900",
          className,
        )}
      >
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
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
          "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-900/20 dark:text-red-300",
          className,
        )}
      >
        {errorMessage ?? "Failed to load data."}
      </div>
    );
  }

  return <>{children}</>;
}
