import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { createThread, getThreads } from '../-server/thread'

const THREADS_QUERY_KEY = ['number-threads-list'] as const

export const threadsQueryOptions = queryOptions({
  queryKey: THREADS_QUERY_KEY,
  queryFn: getThreads,
  staleTime: 10 * 1000,
})

export const useThreadsQuery = () => useQuery(threadsQueryOptions)

export const useCreateThreadMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { startingNumber: number }) => createThread({ data }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: THREADS_QUERY_KEY }),
  })
}
