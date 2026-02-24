import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 text-center dark:bg-zinc-950">
      <span className="text-8xl font-bold tabular-nums text-zinc-200 dark:text-zinc-800">
        404
      </span>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Page not found
        </h1>
        <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Back to home
      </Link>
    </div>
  );
}
