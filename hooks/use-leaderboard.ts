import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/services/api-client'

export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  totalPoints: number
  level: number
  achievementsUnlocked: number
  isCurrentUser: boolean
}

export const leaderboardKeys = {
  all: ['leaderboard'] as const,
  global: (limit: number) => [...leaderboardKeys.all, 'global', limit] as const,
  friends: () => [...leaderboardKeys.all, 'friends'] as const,
}

export function useLeaderboard(limit = 50) {
  return useQuery({
    queryKey: leaderboardKeys.global(limit),
    queryFn: async () => {
      const data = await apiClient.get<LeaderboardEntry[]>(
        `/gamification/leaderboard?limit=${limit}`
      )
      return data
    },
    staleTime: 1000 * 30, 
  })
}

export function useFriendsLeaderboard() {
  return useQuery({
    queryKey: leaderboardKeys.friends(),
    queryFn: async () => {
      const data = await apiClient.get<LeaderboardEntry[]>('/leaderboard/friends')
      return data
    },
    staleTime: 1000 * 60,
  })
}
