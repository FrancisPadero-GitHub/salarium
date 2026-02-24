"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, WalletMinimal } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <WalletMinimal className="h-7 w-7 text-zinc-900 dark:text-zinc-50" />
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Salarium
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            How It Works
          </Link>
          <Link
            href="#stats"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Results
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Log In
          </Link>
          {/* <Link
            href="/auth/signup"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get Started
          </Link> */}

          <Link
            href="/dashboard"
            title="Temporary, will remove it till auth is ready"
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <ModeToggle />
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden",
          open ? "block" : "hidden", // Show/hide based on state and is if mobile
        )}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          <Link
            href="#features"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            How It Works
          </Link>
          <Link
            href="#stats"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Results
          </Link>
          <div className="mt-3 flex flex-col gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-2 text-center text-sm font-medium text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:bg-zinc-800"
            >
              Log In
            </Link>
            {/* <Link
              href="/auth/signup"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
            >
              Get Started
            </Link> */}
            <Link
              href="/dashboard"
              title="Temporary"
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
