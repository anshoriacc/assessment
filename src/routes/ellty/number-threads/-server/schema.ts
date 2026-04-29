import {
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const operationTypeEnum = pgEnum('number_threads_operation_type', [
  'ADD',
  'SUBTRACT',
  'MULTIPLY',
  'DIVIDE',
])

export const numberThreadsUsers = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const numberThreads = pgTable('threads', {
  id: uuid('id').primaryKey().defaultRandom(),
  startingNumber: doublePrecision('starting_number').notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => numberThreadsUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const threadOperations = pgTable('operations', {
  id: uuid('id').primaryKey().defaultRandom(),
  threadId: uuid('thread_id')
    .notNull()
    .references(() => numberThreads.id, { onDelete: 'cascade' }),
  parentOperationId: uuid('parent_operation_id'),
  type: operationTypeEnum('type').notNull(),
  rightArgument: doublePrecision('right_argument').notNull(),
  result: doublePrecision('result').notNull(),
  authorId: uuid('author_id')
    .notNull()
    .references(() => numberThreadsUsers.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const numberThreadsUsersRelations = relations(
  numberThreadsUsers,
  ({ many }) => ({
    threads: many(numberThreads),
    operations: many(threadOperations),
  }),
)

export const numberThreadsRelations = relations(
  numberThreads,
  ({ one, many }) => ({
    author: one(numberThreadsUsers, {
      fields: [numberThreads.authorId],
      references: [numberThreadsUsers.id],
    }),
    operations: many(threadOperations),
  }),
)

export const threadOperationsRelations = relations(
  threadOperations,
  ({ one, many }) => ({
    thread: one(numberThreads, {
      fields: [threadOperations.threadId],
      references: [numberThreads.id],
    }),
    author: one(numberThreadsUsers, {
      fields: [threadOperations.authorId],
      references: [numberThreadsUsers.id],
    }),
    parentOperation: one(threadOperations, {
      fields: [threadOperations.parentOperationId],
      references: [threadOperations.id],
      relationName: 'numberThreadsOperationTree',
    }),
    childOperations: many(threadOperations, {
      relationName: 'numberThreadsOperationTree',
    }),
  }),
)

export type NumberThreadsUser = typeof numberThreadsUsers.$inferSelect
export type NumberThread = typeof numberThreads.$inferSelect
export type ThreadOperation = typeof threadOperations.$inferSelect
export type OperationType = (typeof operationTypeEnum.enumValues)[number]
