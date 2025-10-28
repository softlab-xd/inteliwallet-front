import { apiClient } from './api-client';
import type { UserStreak, ChallengeStreak, StreakType } from '../types/streak';

class StreakService {
  /**
   * Get all user streaks
   */
  async getAllStreaks(): Promise<UserStreak[]> {
    return apiClient.get<UserStreak[]>('/streaks');
  }

  /**
   * Get only active user streaks
   */
  async getActiveStreaks(): Promise<UserStreak[]> {
    return apiClient.get<UserStreak[]>('/streaks/active');
  }

  /**
   * Get a specific streak by type
   */
  async getStreakByType(streakType: StreakType): Promise<UserStreak> {
    return apiClient.get<UserStreak>(`/streaks/type/${streakType}`);
  }

  /**
   * Record an activity to increment a streak
   */
  async recordStreak(streakType: StreakType): Promise<UserStreak> {
    return apiClient.post<UserStreak>(`/streaks/record/${streakType}`);
  }

  /**
   * Get all challenge streaks for the user
   */
  async getChallengeStreaks(): Promise<ChallengeStreak[]> {
    return apiClient.get<ChallengeStreak[]>('/streaks/challenges');
  }

  /**
   * Get streaks for a specific challenge
   */
  async getChallengeStreakById(challengeGoalId: string): Promise<ChallengeStreak[]> {
    return apiClient.get<ChallengeStreak[]>(`/streaks/challenges/${challengeGoalId}`);
  }
}

export const streakService = new StreakService();
