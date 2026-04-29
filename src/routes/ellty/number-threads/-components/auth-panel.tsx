import React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'

import {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useSessionQuery,
} from '../-hooks/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const authSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const AuthPanel = () => {
  const { data: session, isLoading } = useSessionQuery()
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const logoutMutation = useLogoutMutation()

  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    validators: {
      onSubmit: authSchema,
    },
    onSubmit: async ({ value }) => {
      setError(null)

      try {
        if (mode === 'login') {
          await loginMutation.mutateAsync(value)
        } else {
          await registerMutation.mutateAsync(value)
        }

        form.reset()
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Authentication failed')
      }
    },
  })

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Checking session...
          </span>
        </CardContent>
      </Card>
    )
  }

  if (session) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Signed in as</span>
            <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium">
              {session.username}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-medium">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h3>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setError(null)
              form.reset()
            }}
          >
            {mode === 'login' ? 'Need account?' : 'Have account?'}
          </Button>
        </div>

        <form
          id="number-threads-auth-form"
          onSubmit={(event) => {
            event.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <FieldGroup className="gap-4">
            <form.Field
              name="username"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="number-threads-username">
                      Username
                    </FieldLabel>
                    <Input
                      id="number-threads-username"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                      placeholder="numberspeaker"
                      autoComplete="username"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="number-threads-password">
                      Password
                    </FieldLabel>
                    <Input
                      id="number-threads-password"
                      type="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                      placeholder="min. 6 chars"
                      autoComplete={
                        mode === 'login' ? 'current-password' : 'new-password'
                      }
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>

          {error ? <p className="text-destructive text-sm">{error}</p> : null}

          <Button
            type="submit"
            form="number-threads-auth-form"
            className="w-full"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {loginMutation.isPending || registerMutation.isPending
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
