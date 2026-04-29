import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import { useSessionQuery } from '../-hooks/auth'
import { useCreateThreadMutation } from '../-hooks/thread'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const threadSchema = z.object({
  startingNumber: z
    .string()
    .trim()
    .min(1, 'Starting number is required')
    .regex(/^-?\d+$/, { message: 'Please enter a valid integer' }),
})

export const NewThreadForm = () => {
  const { data: session } = useSessionQuery()
  const createThreadMutation = useCreateThreadMutation()
  const isPending = createThreadMutation.isPending
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      startingNumber: '',
    },
    validators: {
      onSubmit: threadSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)

      try {
        await createThreadMutation.mutateAsync({
          startingNumber: Number.parseInt(value.startingNumber, 10),
        })

        form.reset()
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to create thread')
      }
    },
  })

  if (!session) return null

  return (
    <Card className="from-card to-primary/5 bg-linear-to-r">
      <CardContent>
        <h3 className="mb-3 text-sm font-medium">Start a number thread</h3>

        <form
          id="number-threads-create-form"
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
              <form.Field
                name="startingNumber"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="number-threads-starting-number">
                        Starting Number
                      </FieldLabel>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          id="number-threads-starting-number"
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
                          placeholder="e.g. 144"
                          className="flex-1"
                        />

                        <Button
                          type="submit"
                          form="number-threads-create-form"
                          disabled={isPending}
                        >
                          {isPending ? 'Publishing...' : 'Publish thread'}
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
