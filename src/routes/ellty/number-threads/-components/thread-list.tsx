import React from 'react'

import { useSessionQuery } from '../-hooks/auth'
import { useThreadsQuery } from '../-hooks/thread'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { NewOperationForm } from './new-operation-form'
import { OperationTree } from './operation-tree'
import { RelativeTime } from './relative-time'

export const ThreadList = () => {
  const { data: session } = useSessionQuery()
  const { data: threads, isLoading, error } = useThreadsQuery()

  const [expandedThreadIds, setExpandedThreadIds] = React.useState<Set<string>>(
    new Set(),
  )
  const [replyingThreadIds, setReplyingThreadIds] = React.useState<Set<string>>(
    new Set(),
  )

  const toggleInSet = (
    id: string,
    setState: React.Dispatch<React.SetStateAction<Set<string>>>,
  ) => {
    setState((previousSet) => {
      const nextSet = new Set(previousSet)
      if (nextSet.has(id)) nextSet.delete(id)
      else nextSet.add(id)
      return nextSet
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-5 w-18" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/40">
        <CardContent>
          <p className="text-destructive text-sm">
            Failed to load number threads
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!threads || threads.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No threads yet. Start one and invite replies.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="space-y-4">
      {threads.map((thread) => {
        const hasOperations = thread.operations.length > 0
        const isExpanded = expandedThreadIds.has(thread.id)
        const isReplying = replyingThreadIds.has(thread.id)

        return (
          <Card
            key={thread.id}
            className="from-card via-card to-primary/5 bg-linear-to-l py-4"
          >
            <CardHeader className="gap-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">
                    Seed:{' '}
                    <span className="font-mono tabular-nums">
                      {thread.startingNumber}
                    </span>
                  </CardTitle>
                  <Badge variant="outline" className="font-normal">
                    <span className="text-muted-foreground">by</span>{' '}
                    {thread.author.username}
                  </Badge>
                  <RelativeTime value={thread.createdAt} />
                </div>

                <div className="flex items-center gap-2">
                  {hasOperations ? (
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        toggleInSet(thread.id, setExpandedThreadIds)
                      }
                    >
                      {isExpanded ? 'Collapse' : 'Expand'} (
                      {thread.operations.length})
                    </Button>
                  ) : null}

                  {session ? (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() =>
                        toggleInSet(thread.id, setReplyingThreadIds)
                      }
                    >
                      {isReplying ? 'Cancel' : 'Reply'}
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardHeader>

            {isReplying || (hasOperations && isExpanded) ? (
              <CardContent className="space-y-4">
                {isReplying ? (
                  <NewOperationForm
                    threadId={thread.id}
                    parentOperationId={null}
                    leftArgument={thread.startingNumber}
                    onSuccess={() =>
                      toggleInSet(thread.id, setReplyingThreadIds)
                    }
                  />
                ) : null}

                {hasOperations && isExpanded ? (
                  <div className="space-y-2">
                    {thread.operations.map((operation) => (
                      <OperationTree
                        key={operation.id}
                        operation={operation}
                        threadId={thread.id}
                        leftArgument={thread.startingNumber}
                      />
                    ))}
                  </div>
                ) : null}
              </CardContent>
            ) : null}
          </Card>
        )
      })}
    </section>
  )
}
