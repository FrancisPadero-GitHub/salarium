export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-700 dark:border-zinc-800 dark:border-t-zinc-300" />

        {/* Skeleton blocks */}
        <div className="w-72 space-y-3">
          <div className="h-4 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-4/6 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <p className="text-sm text-zinc-400 dark:text-zinc-500">Loading…</p>
      </div>
    </div>
  );
}
