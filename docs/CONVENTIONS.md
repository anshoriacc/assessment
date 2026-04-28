# Conventions

This document lists coding conventions currently used in this repository.

## File Naming

- Use **kebab-case** for files and folders.
- Keep TanStack Router file semantics:
  - `__root.tsx` for root route
  - `index.tsx` for index routes
  - `_prefix` for route groups/layout wrappers
  - `-components` for route-local components

Examples:

- `src/components/global-back-button.tsx`
- `src/routes/ellty/quick-form-styling.tsx`
- `src/routes/ellty/-components/quick-form-styling.tsx`

## Component Declaration

- Route and layout components: prefer `function` declarations.
- Reusable/shared components: prefer `const` arrow components.

## Imports

- Use `@/` alias for project-root imports.
- Prefer direct file imports over barrel imports.

Good:

```tsx
import { Button } from '@/components/ui/button'
import { assessments } from '@/data/assessments'
```

## Styling

- Tailwind utilities are the primary styling method.
- Use `cn` from `@/lib/utils` for conditional classes.
- Keep styles readable and close to component usage.

## Routing

- Routes are file-based under `src/routes`.
- Current live route set is minimal and showcase-focused.
- Keep route metadata (`head`) close to each route file.

## State and Data

- Theme and command state live in Zustand stores (`src/stores`).
- Showcase entries are centralized in `src/data/assessments.ts`.
- Use TanStack Query where query caching is needed.

## Accessibility and UX

- Use semantic HTML where possible.
- Keep interactive elements keyboard-friendly.
- Maintain clear labels for command items and buttons.

## Testing and Validation

- Use Vitest for tests (`pnpm test`).
- Before finalizing changes, run at least:
  - `pnpm build`
  - `pnpm check` (when formatting/linting is desired)

## Git and Generated Files

- Do not manually edit `src/routeTree.gen.ts`.
- Keep commits focused by concern (docs, feature, cleanup).
