import { useState } from 'react'

import { useSessionQuery } from '../-hooks/auth'
import { type OperationNode } from '../-server/thread'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { NewOperationForm } from './new-operation-form'
import { RelativeTime } from './relative-time'

const operationSymbolMap = {
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '*',
  DIVIDE: '/',
} as const

type OperationTreeProps = {
  operation: OperationNode
  threadId: string
  leftArgument: number
}

export const OperationTree = ({
  operation,
  threadId,
  leftArgument,
}: OperationTreeProps) => {
  const { data: session } = useSessionQuery()
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showChildren, setShowChildren] = useState(true)

  const hasChildren = operation.childOperations.length > 0
  const symbol =
    operationSymbolMap[operation.type as keyof typeof operationSymbolMap]

  return (
    <div className="space-y-2">
      <Card className="border-border/60 bg-card/50 py-4">
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border-border bg-background rounded-md border px-2 py-1 font-mono text-sm tabular-nums">
                <span className="text-muted-foreground">{leftArgument}</span>{' '}
                {symbol} {operation.rightArgument} ={' '}
                <span className="text-primary font-bold">
                  {operation.result}
                </span>
              </span>

              <Badge variant="outline" className="font-normal">
                <span className="text-muted-foreground">by</span>{' '}
                {operation.author.username}
              </Badge>
              <RelativeTime value={operation.createdAt} />
            </div>

            <div className="flex items-center gap-1">
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setShowChildren(!showChildren)}
                >
                  {showChildren ? 'Hide' : 'Show'} (
                  {operation.childOperations.length})
                </Button>
              ) : null}

              {session ? (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  {showReplyForm ? 'Cancel' : 'Reply'}
                </Button>
              ) : null}
            </div>
          </div>

          {showReplyForm ? (
            <NewOperationForm
              threadId={threadId}
              parentOperationId={operation.id}
              leftArgument={operation.result}
              onSuccess={() => setShowReplyForm(false)}
            />
          ) : null}
        </CardContent>
      </Card>

      {hasChildren && showChildren ? (
        <div className="ml-5 space-y-2 border-l pl-3">
          {operation.childOperations.map((childOperation) => (
            <OperationTree
              key={childOperation.id}
              operation={childOperation}
              threadId={threadId}
              leftArgument={operation.result}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
