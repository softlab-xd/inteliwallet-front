import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/services/api-client'

export interface GamificationOverview {
  totalAchievements: number
  unlockedAchievements: number
  activeChallenges: number
  userRank: number | null
  userPoints: number
}

export const overviewKeys = {
  all: ['gamification', 'overview'] as const,
}

export function useGamificationOverview() {
  return useQuery({
    queryKey: overviewKeys.all,
    queryFn: async () => {
      const data = await apiClient.get<GamificationOverview>('/gamification/overview')
      return data
    },
    staleTime: 1000 * 60 * 2,
  })
}
