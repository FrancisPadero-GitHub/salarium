# Copilot Instructions — Salarium

Salarium is a **financial orchestration platform for field service businesses**, built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, and Supabase.

## Architecture

- **`app/`** — Next.js App Router pages/layouts. RSC-first: default to Server Components; add `"use client"` only when needed (interactivity, hooks, browser APIs).
- **`app/landing/`** — Landing page route segment (currently empty; expand with `page.tsx`/`layout.tsx`).
- **`app/loading.tsx`** — Global loading UI (spinner + skeleton). Duplicate per route segment for scoped loading states.
- **`app/not-found.tsx`** — Global 404 page.
- **`app/error.tsx`** — Error boundary (`"use client"`). Receives `error` and `reset` props.
- **`app/global-error.tsx`** — Root-level error boundary; must own its own `<html><body>` tags.
- **`app/template.tsx`** — Re-renders on every navigation (fade-in animation); wraps `{children}`.
- **`app/default.tsx`** — Parallel route fallback; returns `null`.
- **`lib/supabase.ts`** — Singleton Supabase client. Import `supabase` from here; do not create additional clients.
- **`lib/utils.ts`** — Houses `cn()` for className merging (`clsx` + `tailwind-merge`). Always use `cn()` for conditional/combined class names.
- **`components/theme-provider.tsx`** — Thin wrapper around `next-themes` `ThemeProvider`. Already applied in root layout.
- **`components/mode-toggle.tsx`** — Sun/Moon toggle button. Import and drop anywhere to expose a theme switcher.
- **`components/ui/`** — shadcn/ui generated components. Add via CLI, not by hand.
- **`types/`** — TypeScript type definitions (e.g. `job.ts` for `Job` and `PaymentMethod` types).
- **`data/`** — Static data files (e.g. `jobs.ts` with mock job data).

## Key Dependencies & Versions

| Package         | Version        | Notes                                          |
| --------------- | -------------- | ---------------------------------------------- |
| Next.js         | 16.1.6         | App Router only                                |
| React           | 19             | Server Components default                      |
| Tailwind CSS    | v4             | No config file — configured via CSS            |
| shadcn/ui       | new-york style | zinc base, CSS variables                       |
| Supabase JS     | v2             | Client-side singleton                          |
| TanStack Query  | v5             | For async data fetching in client components   |
| React Hook Form | v7             | For forms                                      |
| next-themes     | latest         | Dark mode via `attribute="class"`              |
| Lucide React    | —              | Icon library (configured in `components.json`) |

## Developer Workflows

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
npx shadcn add <component>  # Add a shadcn/ui component to components/ui/
```

Required `.env` variables:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Critical Conventions

**Tailwind CSS v4** — No `tailwind.config.js`. All theme tokens are defined via CSS custom properties in [`app/globals.css`](../app/globals.css) under `@theme inline`. To extend the theme, add CSS variables there, not in a config file.

**Styling pattern** — Always import `cn` from `@/lib/utils` and use it for class merging:

```tsx
import { cn } from "@/lib/utils";
<div
  className={cn("base-class", condition && "conditional-class", className)}
/>;
```

**shadcn/ui** — Style is `new-york`, base color is `zinc`, CSS variables mode is on. Run `npx shadcn add <name>` to scaffold components into `components/ui/`. Do not edit generated UI primitives directly; compose them.

**Dark mode** — Uses `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`. `ThemeProvider` is already mounted in [`app/layout.tsx`](../app/layout.tsx) with `suppressHydrationWarning` on `<html>`. Use `<ModeToggle />` from `@/components/mode-toggle` to expose a switcher. Always pair light styles with `dark:` variants; use zinc scale throughout (e.g. `bg-white dark:bg-zinc-950`, `text-zinc-900 dark:text-zinc-50`).

**Routing file conventions** — Scope `loading.tsx` / `error.tsx` per route segment by placing them alongside the segment's `page.tsx`. `global-error.tsx` is root-only and must include its own `<html><body>`. `template.tsx` re-mounts on every navigation (unlike `layout.tsx` which persists).

**Path aliases** (from `tsconfig.json` / `components.json`):

- `@/components` → `components/`
- `@/components/ui` → `components/ui/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`

**Data fetching** — Use TanStack Query v5 (`useQuery`, `useMutation`) in `"use client"` components for Supabase calls. Server Components can call `supabase` directly.

**Icons** — Use `lucide-react` exclusively. Example: `import { CircleDollarSign } from "lucide-react"`.

**Fonts** — Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`) are loaded via `next/font/google` in [`app/layout.tsx`](../app/layout.tsx) and exposed as CSS variables.

**Forms** — Use React Hook Form v7 for form state management in client components. Server Components should not contain forms.
