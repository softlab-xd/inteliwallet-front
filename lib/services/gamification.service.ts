import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "../config/api"

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  rarity: "common" | "rare" | "epic" | "legendary"
  points: number
  unlocked: boolean
  unlockedAt?: string
}

export interface LeaderboardEntry {
  id: string
  username: string
  avatar?: string
  totalPoints: number
  rank: number
  level: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  progress: number
  target: number
  reward: number
  deadline: string
  status: "active" | "completed" | "expired"
}

export const gamificationService = {
  async getAchievements(): Promise<Achievement[]> {
    return apiClient.get<Achievement[]>(API_ENDPOINTS.GAMIFICATION.ACHIEVEMENTS)
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return apiClient.get<LeaderboardEntry[]>(API_ENDPOINTS.GAMIFICATION.LEADERBOARD)
  },

  async getChallenges(): Promise<Challenge[]> {
    return apiClient.get<Challenge[]>(API_ENDPOINTS.GAMIFICATION.CHALLENGES)
  },
}
