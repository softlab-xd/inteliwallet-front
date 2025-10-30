import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/services/api-client'

export interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  category: string
  deadline: string
  status: string
  progressPercentage: number
  createdAt: string
  updatedAt: string
}

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  details: () => [...goalKeys.all, 'detail'] as const,
  detail: (id: string) => [...goalKeys.details(), id] as const,
}

export function useGoals() {
  return useQuery({
    queryKey: goalKeys.lists(),
    queryFn: async () => {
      const data = await apiClient.get<Goal[]>('/goals')
      return data
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goalData: {
      title: string
      targetAmount: number
      currentAmount?: number
      category: string
      deadline: string 
    }) => {
      const data = await apiClient.post<Goal>('/goals', goalData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all })
    },
  })
}

export function useContributeToGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ goalId, amount }: { goalId: string; amount: number }) => {
      const data = await apiClient.post<Goal>(`/goals/${goalId}/contribute`, { amount })
      return data
    },
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) })
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ goalId, updates }: { goalId: string; updates: Partial<Goal> }) => {
      const data = await apiClient.put<Goal>(`/goals/${goalId}`, updates)
      return data
    },
    onSuccess: (_, { goalId }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(goalId) })
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goalId: string) => {
      await apiClient.delete(`/goals/${goalId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.all })
    },
  })
}
