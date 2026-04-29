import { createFileRoute } from '@tanstack/react-router'
import { IconInfoCircle, IconMathSymbols } from '@tabler/icons-react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { MotionContainer, MotionItem } from '@/components/ui/motion'
import { Badge } from '@/components/ui/badge'
import { sessionQueryOptions, useSessionQuery } from './-hooks/auth'
import { NewThreadForm } from './-components/new-thread-form'
import { AuthPanel } from './-components/auth-panel'
import { ThreadList } from './-components/thread-list'

export const Route = createFileRoute('/ellty/number-threads/')({
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(sessionQueryOptions)
  },
  component: NumberThreadsPage,
  head: () => ({
    meta: [
      {
        title: 'Number Threads',
      },
      {
        name: 'description',
        content:
          'Number Threads is a tree-based arithmetic discussion app with account auth, recursive replies, and Drizzle-backed persistence.',
      },
    ],
  }),
})

function NumberThreadsPage() {
  const { data: session } = useSessionQuery()

  return (
    <MotionContainer
      as="main"
      className="mx-auto min-h-dvh w-full max-w-3xl space-y-10 p-4 pt-16 sm:p-6 sm:pt-16"
    >
      <MotionItem className="space-y-4">
        <Badge variant="outline">
          <IconMathSymbols className="size-3.5" />
          Ellty
        </Badge>

        <div className="space-y-2">
          <h1 className="font-medium sm:text-lg">Number Threads</h1>

          <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed sm:text-base">
            Start with a number, then branch replies with arithmetic operations.
            Every reply becomes a node in the discussion tree.
          </p>
        </div>

        <div className="grid gap-2 text-xs sm:grid-cols-3">
          <div className="border-border/60 bg-card/70 rounded-lg border p-3">
            <p className="text-muted-foreground">Stack</p>
            <p className="mt-1 font-medium">
              TanStack Start + Drizzle + Postgres
            </p>
          </div>
          <div className="border-border/60 bg-card/70 rounded-lg border p-3">
            <p className="text-muted-foreground">Auth</p>
            <p className="mt-1 font-medium">
              Cookie session with username/password
            </p>
          </div>
          <div className="border-border/60 bg-card/70 rounded-lg border p-3">
            <p className="text-muted-foreground">Data shape</p>
            <p className="mt-1 font-medium">
              Recursive tree from root number to replies
            </p>
          </div>
        </div>
      </MotionItem>

      <MotionItem className="space-y-4">
        {!session ? (
          <Alert className="border-primary/30 bg-primary/10">
            <IconInfoCircle className="size-4" />
            <AlertDescription>
              Sign in or register to publish new number threads and replies.
            </AlertDescription>
          </Alert>
        ) : null}

        <AuthPanel />
      </MotionItem>

      <MotionItem>{session ? <NewThreadForm /> : null}</MotionItem>

      <MotionItem className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-medium">Active Threads</h2>
          <Badge variant="secondary">Public feed</Badge>
        </div>

        <ThreadList />
      </MotionItem>
    </MotionContainer>
  )
}
