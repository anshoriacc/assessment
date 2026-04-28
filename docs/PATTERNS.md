# Patterns

This document captures common implementation patterns used in the current showcase codebase.

## 1. Route Pattern (TanStack Router)

Define route + metadata in the same file.

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ellty/quick-form-styling')({
  component: QuickFormStylingPage,
  head: () => ({
    meta: [
      { title: 'Quick Form Styling' },
      { name: 'description', content: '...' },
    ],
  }),
})
```

## 2. Centralized Showcase Data

Keep showcase cards and command entries driven by a shared data source.

```ts
// src/data/assessments.ts
export const assessments = [
  {
    id: 'quick-form-styling',
    title: 'Quick Form Styling',
    company: 'Ellty',
    to: '/ellty/quick-form-styling',
    summary: '...',
  },
]
```

Use helper selectors like:

- `getAssessmentById`
- `getAssessmentsByCompany`
- `getAssessmentsGroupedByCompany`

## 3. Command Palette Actions

Keep command palette behavior action-oriented:

- Global quick actions (home, repo, theme toggle)
- Grouped assessment navigation

Pattern:

```tsx
<CommandItem
  onSelect={() => {
    setOpen(false)
    navigate({ to: '/' })
  }}
>
  Open Showcase Home
</CommandItem>
```

## 4. Theme Handling (SSR-safe)

Theme is resolved on the server and applied before hydration.

Pieces:

- `src/server/theme.ts` for cookie-backed server functions
- `src/stores/theme.ts` for client store + hooks
- `generateThemeScript()` in root head scripts

This prevents theme flash and keeps UI consistent during hydration.

## 5. Root Layout Composition

Root layout composes global shell elements around route content:

- `GlobalBackButton` (hidden on home)
- page content
- `Footer`

Pattern:

```tsx
<div className="flex min-h-dvh flex-col">
  <GlobalBackButton />
  <div className="flex-1">{children}</div>
  <Footer />
</div>
```

## 6. Back Navigation Fallback

For global back behavior:

- Use browser history if available
- Fall back to home route when history stack is shallow

Pattern:

```tsx
if (window.history.length > 1) {
  window.history.back()
} else {
  navigate({ to: '/' })
}
```

## 7. Motion Wrappers for Pages

Use `MotionContainer` and `MotionItem` for subtle page-level transitions without scattering animation logic across many components.

## 8. Query Client Setup

Use a server/client split query client factory:

- fresh instance on server
- singleton instance in browser

This keeps SSR isolation and client cache continuity.

---

If new showcase entries are added, prefer extending `src/data/assessments.ts` first, then wiring any route/UI changes to that source of truth.
