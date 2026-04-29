import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { SESSION_COOKIE_NAME, type Session } from './auth'
import { db } from './db'
import { calculateResult } from './math'
import { numberThreads, numberThreadsUsers, threadOperations } from './schema'

const addOperationSchema = z.object({
  threadId: z.string(),
  parentOperationId: z.string().nullable(),
  type: z.enum(['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE']),
  rightArgument: z.number(),
})

function parseSessionCookie(raw: string | undefined): Session {
  if (!raw) return null

  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export const addOperation = createServerFn({ method: 'POST' })
  .inputValidator(addOperationSchema)
  .handler(async ({ data }) => {
    const session = parseSessionCookie(getCookie(SESSION_COOKIE_NAME))

    if (!session) throw new Error('Unauthorized')

    let leftArgument: number

    if (data.parentOperationId) {
      const parent = await db.query.threadOperations.findFirst({
        where: eq(threadOperations.id, data.parentOperationId),
      })

      if (!parent) throw new Error('Parent operation not found')

      leftArgument = parent.result
    } else {
      const thread = await db.query.numberThreads.findFirst({
        where: eq(numberThreads.id, data.threadId),
      })

      if (!thread) throw new Error('Thread not found')

      leftArgument = thread.startingNumber
    }

    const result = calculateResult(leftArgument, data.type, data.rightArgument)

    const [operation] = await db
      .insert(threadOperations)
      .values({
        threadId: data.threadId,
        parentOperationId: data.parentOperationId,
        type: data.type,
        rightArgument: data.rightArgument,
        result,
        authorId: session.userId,
      })
      .returning()

    const author = await db.query.numberThreadsUsers.findFirst({
      where: eq(numberThreadsUsers.id, session.userId),
    })

    if (!author) throw new Error('Author not found')

    return {
      ...operation,
      author: {
        id: author.id,
        username: author.username,
      },
    }
  })
