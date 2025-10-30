import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/services/api-client'

export interface Streak {
  id: string
  streakType: string
  streakTypeName: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
  totalDaysActive: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const streakKeys = {
  all: ['streaks'] as const,
  lists: () => [...streakKeys.all, 'list'] as const,
  type: (type: string) => [...streakKeys.all, type] as const,
}

export function useStreaks() {
  return useQuery({
    queryKey: streakKeys.lists(),
    queryFn: async () => {
      const data = await apiClient.get<Streak[]>('/streaks')
      return data
    },
    staleTime: 1000 * 60 * 5, 
  })
}

export function useStreakByType(type: 'DAILY_LOGIN' | 'TRANSACTION_LOG' | 'GOAL_PROGRESS') {
  return useQuery({
    queryKey: streakKeys.type(type),
    queryFn: async () => {
      const data = await apiClient.get<Streak>(`/streaks/${type}`)
      return data
    },
    enabled: !!type,
    staleTime: 1000 * 60 * 5,
  })
}
