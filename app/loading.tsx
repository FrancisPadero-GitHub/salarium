import { Spinner } from "@/components/ui/spinner";
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-2">
        {/* Spinner */}
        <Spinner className="h-5 w-5" />
        <p className="text-sm text-zinc-400 dark:text-zinc-500">Loading…</p>
        {/* Skeleton blocks */}
        <div className="w-72 space-y-3">
          <div className="h-4 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-4/6 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
