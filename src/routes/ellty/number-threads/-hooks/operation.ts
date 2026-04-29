import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addOperation } from '../-server/operation'

const THREADS_QUERY_KEY = ['number-threads-list'] as const

export const useAddOperationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      threadId: string
      parentOperationId: string | null
      type: 'ADD' | 'SUBTRACT' | 'MULTIPLY' | 'DIVIDE'
      rightArgument: number
    }) => addOperation({ data }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY }),
  })
}
