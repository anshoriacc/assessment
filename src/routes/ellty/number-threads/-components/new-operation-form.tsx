import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import { useSessionQuery } from '../-hooks/auth'
import { useAddOperationMutation } from '../-hooks/operation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type OperationType = 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'

const operationChoices = [
  { type: 'ADD' as const, symbol: '+', label: 'Add' },
  { type: 'SUBTRACT' as const, symbol: '-', label: 'Subtract' },
  { type: 'MULTIPLY' as const, symbol: '*', label: 'Multiply' },
  { type: 'DIVIDE' as const, symbol: '/', label: 'Divide' },
]

const operationSchema = z.object({
  rightArgument: z
    .string()
    .trim()
    .min(1, 'Right argument is required')
    .regex(/^-?\d+$/, { message: 'Please enter a valid integer' }),
})

type NewOperationFormProps = {
  threadId: string
  parentOperationId: string | null
  leftArgument: number
  onSuccess?: () => void
}

export const NewOperationForm = ({
  threadId,
  parentOperationId,
  leftArgument,
  onSuccess,
}: NewOperationFormProps) => {
  const { data: session } = useSessionQuery()
  const addOperationMutation = useAddOperationMutation()
  const isPending = addOperationMutation.isPending
  const [type, setType] = React.useState<OperationType>('ADD')
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      rightArgument: '',
    },
    validators: {
      onSubmit: operationSchema,
      onChange: z.object({
        rightArgument: z.string().refine(
          (value) => {
            if (!value) return true

            const parsed = Number.parseInt(value, 10)
            if (Number.isNaN(parsed)) return true

            return type !== 'DIVIDE' || parsed !== 0
          },
          { message: 'Cannot divide by zero' },
        ),
      }),
    },
    onSubmit: async ({ value }) => {
      setError(null)

      try {
        await addOperationMutation.mutateAsync({
          threadId,
          parentOperationId,
          type,
          rightArgument: Number.parseInt(value.rightArgument, 10),
        })

        form.reset()
        onSuccess?.()
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to add operation')
      }
    },
  })

  if (!session) return null

  return (
    <Card className="border-border/60 bg-card/70">
      <CardContent>
        <form
          id={`number-threads-operation-${threadId}-${parentOperationId ?? 'root'}`}
          onSubmit={(event) => {
            event.preventDefault()
            if (isPending) return
            form.handleSubmit()
          }}
          aria-busy={isPending}
          className="space-y-3"
        >
          <fieldset disabled={isPending} className="space-y-3">
            <FieldGroup>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground">Apply on</span>
                <span className="bg-muted rounded-md px-2 py-1 font-mono">
                  {leftArgument}
                </span>

                <span className="flex flex-wrap gap-1">
                  {operationChoices.map((operationChoice) => (
                    <button
                      key={operationChoice.type}
                      type="button"
                      onClick={() => setType(operationChoice.type)}
                      aria-label={operationChoice.label}
                      className={
                        type === operationChoice.type
                          ? 'bg-primary text-primary-foreground rounded-md px-2 py-1 font-mono'
                          : 'bg-muted text-muted-foreground hover:text-foreground rounded-md px-2 py-1 font-mono'
                      }
                    >
                      {operationChoice.symbol}
                    </button>
                  ))}
                </span>
              </div>

              <form.Field
                name="rightArgument"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="sr-only">
                        Right argument
                      </FieldLabel>

                      <div className="flex gap-2">
                        <Input
                          id={field.name}
                          type="text"
                          inputMode="numeric"
                          pattern="-?[0-9]*"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => {
                            const nextValue = event.target.value
                            if (/^-?\d*$/.test(nextValue)) {
                              field.handleChange(nextValue)
                            }
                          }}
                          aria-invalid={isInvalid}
                          placeholder="right argument"
                          className="flex-1"
                        />

                        <Button
                          type="submit"
                          form={`number-threads-operation-${threadId}-${parentOperationId ?? 'root'}`}
                          size="sm"
                          disabled={isPending}
                        >
                          {isPending ? 'Replying...' : 'Reply'}
                        </Button>
                      </div>

                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </fieldset>

          {error ? <p className="text-destructive text-xs">{error}</p> : null}
        </form>
      </CardContent>
    </Card>
  )
}
