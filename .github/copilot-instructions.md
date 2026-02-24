# Copilot Instructions — Salarium

Salarium is a **financial orchestration platform for field service businesses**, built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, and Supabase.

## Architecture

- **`app/`** — Next.js App Router pages/layouts. RSC-first: default to Server Components; add `"use client"` only when needed (interactivity, hooks, browser APIs).
- **`app/landing/`** — Landing page route segment (currently empty; expand with `page.tsx`/`layout.tsx`).
- **`lib/supabase.ts`** — Singleton Supabase client used across the app. Import `supabase` from here; do not create additional clients.
- **`lib/utils.ts`** — Houses `cn()` for className merging (`clsx` + `tailwind-merge`). Always use `cn()` for conditional/combined class names.
- **`components/ui/`** — shadcn/ui generated components. Add via CLI, not by hand.

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

**Dark mode** — Uses `next-themes` with `attribute="class"`. Wrap the root layout in `ThemeProvider` (already done in `app/layout.tsx`). Use the `ModeToggle` component from `components/mode-toggle.tsx` to let users switch themes. Always add `dark:` variants alongside light styles.

**Path aliases** (from `tsconfig.json` / `components.json`):

- `@/components` → `components/`
- `@/components/ui` → `components/ui/`
- `@/lib` → `lib/`
- `@/hooks` → `hooks/`

**Data fetching** — Use TanStack Query v5 (`useQuery`, `useMutation`) in `"use client"` components for Supabase calls. Server Components can call `supabase` directly.

**Icons** — Use `lucide-react` exclusively. Example: `import { CircleDollarSign } from "lucide-react"`.

**Fonts** — Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`) are loaded via `next/font/google` in [`app/layout.tsx`](../app/layout.tsx) and exposed as CSS variables.
