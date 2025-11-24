import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/services/api-client'

export interface Challenge {
  id: string
  creator: {
    id: string
    username: string
    avatar: string
  }
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  category: string
  deadline: string
  status: string
  maxParticipants: number
  currentParticipants: number
  rewardPoints: number
  reward: number
  progressPercentage: number
  progress: number
  target: number
  topContributors: Array<{
    id: string
    userId: string
    username: string
    avatar: string
    contributedAmount: number
    contributionPercentage: number
    isCreator: boolean
  }>
  createdAt: string
  updatedAt: string
}

export const challengeKeys = {
  all: ['challenges'] as const,
  lists: () => [...challengeKeys.all, 'list'] as const,
  list: (filters: string) => [...challengeKeys.lists(), { filters }] as const,
  details: () => [...challengeKeys.all, 'detail'] as const,
  detail: (id: string) => [...challengeKeys.details(), id] as const,
  active: () => [...challengeKeys.all, 'active'] as const,
  available: () => [...challengeKeys.all, 'available'] as const,
  mine: () => [...challengeKeys.all, 'mine'] as const,
}

export function useChallenges() {
  return useQuery({
    queryKey: challengeKeys.mine(),
    queryFn: async () => {
      const data = await apiClient.get<Challenge[]>('/gamification/challenges')
      return data
    },
    staleTime: 1000 * 60 * 2, 
  })
}

export function useActiveChallenges() {
  return useQuery({
    queryKey: challengeKeys.active(),
    queryFn: async () => {
      const data = await apiClient.get<Challenge[]>('/challenges/active')
      return data
    },
    staleTime: 1000 * 60 * 1, // 1 minuto
  })
}

export function useAvailableChallenges() {
  return useQuery({
    queryKey: challengeKeys.available(),
    queryFn: async () => {
      const data = await apiClient.get<Challenge[]>('/challenges/available')
      return data
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useChallenge(id: string) {
  return useQuery({
    queryKey: challengeKeys.detail(id),
    queryFn: async () => {
      const data = await apiClient.get<Challenge>(`/challenges/${id}`)
      return data
    },
    enabled: !!id,
    staleTime: 1000 * 30, 
  })
}

export function useCreateChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (challengeData: {
      title: string
      description: string
      targetAmount: number
      category: string
      deadline: string
      maxParticipants?: number
      rewardPoints?: number
    }) => {
      const data = await apiClient.post<Challenge>('/challenges', challengeData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.all })
    },
  })
}

export function useJoinChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (challengeId: string) => {
      await apiClient.post(`/challenges/${challengeId}/join`)
    },
    onSuccess: (_, challengeId) => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.all })
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(challengeId) })
    },
  })
}

export function useContributeToChallenge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ challengeId, amount }: { challengeId: string; amount: number }) => {
      const data = await apiClient.post<Challenge>(
        `/challenges/${challengeId}/contribute`,
        { amount }
      )
      return data
    },
    onSuccess: (_, { challengeId }) => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(challengeId) })
      queryClient.invalidateQueries({ queryKey: challengeKeys.all })
    },
  })
}
