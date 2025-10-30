import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/services/api-client'
import { leaderboardKeys } from './use-leaderboard'
import { challengeKeys } from './use-challenges'

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  totalPoints: number
  level: number
  hasCompletedOnboarding: boolean
  plan: string
  planDisplayName: string
  createdAt: string
  updatedAt: string
}

export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
}

export function useUserProfile() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const data = await apiClient.get<User>('/users/profile')
      return data
    },
    staleTime: 1000 * 60 * 15, 
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (updates: Partial<User>) => {
      const data = await apiClient.put<User>('/users/profile', updates)
      return data
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(userKeys.profile(), newData)
    },
  })
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (avatar: string) => {
      const data = await apiClient.put<User>('/users/avatar', { avatar })
      return data
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(userKeys.profile(), newData)

      queryClient.invalidateQueries({ queryKey: leaderboardKeys.all })
      queryClient.invalidateQueries({ queryKey: challengeKeys.all })
    },
  })
}
