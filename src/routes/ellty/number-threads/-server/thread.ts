import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { and, asc, desc, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'

import { SESSION_COOKIE_NAME, type Session } from './auth'
import { db } from './db'
import { numberThreads, numberThreadsUsers, threadOperations } from './schema'

const createThreadSchema = z.object({
  startingNumber: z.number(),
})

export type OperationNode = {
  id: string
  type: string
  rightArgument: number
  result: number
  author: {
    id: string
    username: string
  }
  createdAt: Date
  childOperations: Array<OperationNode>
}

export type ThreadWithOperations = {
  id: string
  startingNumber: number
  author: {
    id: string
    username: string
  }
  createdAt: Date
  operations: Array<OperationNode>
}

function parseSessionCookie(raw: string | undefined): Session {
  if (!raw) return null

  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

async function buildOperationTree(
  threadId: string,
  parentId: string | null,
): Promise<Array<OperationNode>> {
  const ops = await db
    .select({
      id: threadOperations.id,
      type: threadOperations.type,
      rightArgument: threadOperations.rightArgument,
      result: threadOperations.result,
      createdAt: threadOperations.createdAt,
      authorId: numberThreadsUsers.id,
      authorUsername: numberThreadsUsers.username,
    })
    .from(threadOperations)
    .innerJoin(
      numberThreadsUsers,
      eq(threadOperations.authorId, numberThreadsUsers.id),
    )
    .where(
      and(
        eq(threadOperations.threadId, threadId),
        parentId === null
          ? isNull(threadOperations.parentOperationId)
          : eq(threadOperations.parentOperationId, parentId),
      ),
    )
    .orderBy(asc(threadOperations.createdAt))

  const tree: Array<OperationNode> = []

  for (const op of ops) {
    const childOperations = await buildOperationTree(threadId, op.id)

    tree.push({
      id: op.id,
      type: op.type,
      rightArgument: op.rightArgument,
      result: op.result,
      createdAt: op.createdAt,
      author: {
        id: op.authorId,
        username: op.authorUsername,
      },
      childOperations,
    })
  }

  return tree
}

export const getThreads = createServerFn().handler(async () => {
  const allThreads = await db
    .select({
      id: numberThreads.id,
      startingNumber: numberThreads.startingNumber,
      createdAt: numberThreads.createdAt,
      authorId: numberThreadsUsers.id,
      authorUsername: numberThreadsUsers.username,
    })
    .from(numberThreads)
    .innerJoin(
      numberThreadsUsers,
      eq(numberThreads.authorId, numberThreadsUsers.id),
    )
    .orderBy(desc(numberThreads.createdAt))

  const result: Array<ThreadWithOperations> = []

  for (const thread of allThreads) {
    const operations = await buildOperationTree(thread.id, null)

    result.push({
      id: thread.id,
      startingNumber: thread.startingNumber,
      createdAt: thread.createdAt,
      author: {
        id: thread.authorId,
        username: thread.authorUsername,
      },
      operations,
    })
  }

  return result
})

export const createThread = createServerFn({ method: 'POST' })
  .inputValidator(createThreadSchema)
  .handler(async ({ data }) => {
    const session = parseSessionCookie(getCookie(SESSION_COOKIE_NAME))

    if (!session) throw new Error('Unauthorized')

    const [thread] = await db
      .insert(numberThreads)
      .values({
        startingNumber: data.startingNumber,
        authorId: session.userId,
      })
      .returning()

    const author = await db.query.numberThreadsUsers.findFirst({
      where: eq(numberThreadsUsers.id, session.userId),
    })

    if (!author) throw new Error('Author not found')

    return {
      ...thread,
      author: {
        id: author.id,
        username: author.username,
      },
      operations: [],
    }
  })
