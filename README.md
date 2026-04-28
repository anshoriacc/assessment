# Assessment Showcase

This repository is a TanStack Start app used as a personal technical assessment showcase.

## Tech Stack

- **Framework**: TanStack Start (React 19 + Vite)
- **Routing**: TanStack Router (file-based, type-safe)
- **Data Layer**: TanStack Query v5
- **Forms**: TanStack Form
- **Styling**: TailwindCSS v4 + Base UI / shadcn-style primitives
- **State**: Zustand
- **Animation**: Motion
- **Testing**: Vitest

## Current App Features

- Showcase home page at `/`
- Assessment route group at `/ellty`
- Live assessment page at `/ellty/quick-form-styling`
- Health check endpoint at `/health`
- Global command palette (Cmd/Ctrl + K)
- SSR-safe theme system (light/dark/system)
- Global top back button for non-home routes
- Footer with theme toggle controls
- Devtools integration (Router, Query, Form, Hotkeys)

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm dev`     | Start development server |
| `pnpm build`   | Build for production     |
| `pnpm preview` | Preview production build |
| `pnpm test`    | Run tests                |
| `pnpm lint`    | Run ESLint               |
| `pnpm format`  | Run Prettier             |
| `pnpm check`   | Format and lint          |

## Project Structure

```
src/
├── components/          # App-level components
│   └── ui/              # Reusable UI primitives
├── constants/           # Environment constants
├── data/                # Showcase data sources
├── hooks/               # Shared hooks
├── lib/                 # Utilities and shared setup
├── routes/              # File-based routes
├── server/              # Server functions
├── stores/              # Zustand stores
├── router.tsx           # Router instance setup
└── routeTree.gen.ts     # Auto-generated route tree
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Conventions](./docs/CONVENTIONS.md)
- [Patterns](./docs/PATTERNS.md)

## Environment Variables

Current source uses:

```env
SITE_URL=http://localhost:3000
```

If you are only running the current live showcase pages, only `SITE_URL` is generally needed.
