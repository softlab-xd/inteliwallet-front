import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/services/api-client'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  points: number
  code: string
  category: string
  targetValue: number
  currentProgress: number
  progressPercentage: number
  unlocked: boolean
  unlockedAt?: string
  createdAt: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

export const achievementKeys = {
  all: ['achievements'] as const,
  lists: () => [...achievementKeys.all, 'list'] as const,
  list: (filters: string) => [...achievementKeys.lists(), { filters }] as const,
  details: () => [...achievementKeys.all, 'detail'] as const,
  detail: (id: string) => [...achievementKeys.details(), id] as const,
  unlocked: () => [...achievementKeys.all, 'unlocked'] as const,
  category: (category: string) => [...achievementKeys.all, 'category', category] as const,
}

export function useAchievements() {
  return useQuery({
    queryKey: achievementKeys.lists(),
    queryFn: async () => {
      const data = await apiClient.get<Achievement[]>('/gamification/achievements')
      return data
    },
    staleTime: 1000 * 60 * 10, 
  })
}

export function useUnlockedAchievements() {
  return useQuery({
    queryKey: achievementKeys.unlocked(),
    queryFn: async () => {
      const data = await apiClient.get<Achievement[]>('/achievements/unlocked')
      return data
    },
    staleTime: 1000 * 60 * 5, 
  })
}

export function useAchievementsByCategory(category: string) {
  return useQuery({
    queryKey: achievementKeys.category(category),
    queryFn: async () => {
      const data = await apiClient.get<Achievement[]>(`/achievements/category/${category}`)
      return data
    },
    enabled: !!category, 
    staleTime: 1000 * 60 * 10,
  })
}

export function useInitializeAchievements() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/achievements/initialize')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: achievementKeys.all })
    },
  })
}
