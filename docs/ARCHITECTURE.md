# Architecture

This document describes the current architecture of the Assessment Showcase app.

## Overview

The app is a TanStack Start project with SSR, file-based routing, a small set of live showcase pages, and a reusable UI layer.

### Current Routes

- `/` - Showcase home with cards sourced from `src/data/assessments.ts`
- `/ellty` - Route group/layout container
- `/ellty/quick-form-styling` - Live assessment page
- `/health` - Health endpoint

## Tech Stack

| Layer      | Technology                                       |
| ---------- | ------------------------------------------------ |
| Framework  | TanStack Start (React 19 + Vite)                 |
| Routing    | TanStack Router (file-based, type-safe)          |
| Data/Cache | TanStack Query v5                                |
| Forms      | TanStack Form                                    |
| Styling    | TailwindCSS v4 + Base UI/shadcn-style components |
| State      | Zustand                                          |
| Animation  | Motion                                           |
| Testing    | Vitest                                           |

## Source Structure

```
src/
├── components/
│   ├── command-palette.tsx
│   ├── footer.tsx
│   ├── global-back-button.tsx
│   ├── providers.tsx
│   ├── toggle-theme.tsx
│   └── ui/
├── constants/
│   └── env.ts
├── data/
│   └── assessments.ts
├── hooks/
│   └── use-mobile.ts
├── lib/
│   ├── axios.ts
│   ├── query-client.ts
│   ├── theme-context.ts
│   └── utils.ts
├── routes/
│   ├── __root.tsx
│   ├── index.tsx
│   ├── health.ts
│   ├── ellty.tsx
│   └── ellty/
│       ├── quick-form-styling.tsx
│       └── -components/
├── server/
│   └── theme.ts
├── stores/
│   ├── command.ts
│   └── theme.ts
├── router.tsx
└── routeTree.gen.ts
```

## Rendering Flow

1. `src/routes/__root.tsx` loads the preferred theme via `getThemeServerFn`.
2. `generateThemeScript()` is injected into the head to apply theme before hydration.
3. `Providers` sets app-level context and mounts global UI helpers:
   - `ThemeHotkey`
   - `GlobalCommandPalette`
4. Root layout wraps page content with:
   - `GlobalBackButton` (hidden on `/`)
   - Route content
   - `Footer` (includes theme controls)

## Data Model

Showcase cards and command palette assessment entries are centralized in:

- `src/data/assessments.ts`

This module exposes:

- `assessments` (source list)
- `getAssessmentById`
- `getAssessmentsByCompany`
- `getAssessmentsGroupedByCompany`

## Navigation UX

- Home renders cards from `assessments`.
- Command palette includes quick actions and grouped assessment navigation.
- Global back bar uses browser history when available; otherwise navigates to `/`.

## Theme System

- Server cookie API in `src/server/theme.ts`
- Zustand store in `src/stores/theme.ts`
- Footer toggle (`src/components/toggle-theme.tsx`)
- Command palette quick-action toggle (switch light/dark)

## Environment

Environment constants currently exist in `src/constants/env.ts`.
For this trimmed showcase state, the app path primarily depends on theme cookie handling; additional env vars may be present for future assessments.
