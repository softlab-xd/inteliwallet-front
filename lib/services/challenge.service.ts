import { apiClient } from './api-client';
import type {
  Challenge,
  ChallengeParticipant,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  ContributeChallengeRequest,
  JoinChallengeResponse,
} from '../types/challenge';

class ChallengeService {
  /**
   * Get all available challenges (not participating)
   */
  async getAvailableChallenges(): Promise<Challenge[]> {
    return apiClient.get<Challenge[]>('/challenges/available');
  }

  /**
   * Get all challenges the user participates in
   */
  async getMyChallenges(): Promise<Challenge[]> {
    return apiClient.get<Challenge[]>('/challenges');
  }

  /**
   * Get only active challenges the user participates in
   */
  async getActiveChallenges(): Promise<Challenge[]> {
    return apiClient.get<Challenge[]>('/challenges/active');
  }

  /**
   * Get details of a specific challenge
   */
  async getChallengeById(challengeId: string): Promise<Challenge> {
    return apiClient.get<Challenge>(`/challenges/${challengeId}`);
  }

  /**
   * Create a new challenge
   */
  async createChallenge(data: CreateChallengeRequest): Promise<Challenge> {
    return apiClient.post<Challenge>('/challenges', data);
  }

  /**
   * Join a challenge
   */
  async joinChallenge(challengeId: string): Promise<JoinChallengeResponse> {
    return apiClient.post<JoinChallengeResponse>(`/challenges/${challengeId}/join`);
  }

  /**
   * Contribute to a challenge
   */
  async contributeToChallenge(
    challengeId: string,
    data: ContributeChallengeRequest
  ): Promise<Challenge> {
    return apiClient.post<Challenge>(`/challenges/${challengeId}/contribute`, data);
  }

  /**
   * Leave a challenge
   */
  async leaveChallenge(challengeId: string): Promise<void> {
    return apiClient.post<void>(`/challenges/${challengeId}/leave`);
  }

  /**
   * Get all participants of a challenge
   */
  async getChallengeParticipants(challengeId: string): Promise<ChallengeParticipant[]> {
    return apiClient.get<ChallengeParticipant[]>(`/challenges/${challengeId}/participants`);
  }

  /**
   * Update a challenge (creator only)
   */
  async updateChallenge(
    challengeId: string,
    data: UpdateChallengeRequest
  ): Promise<Challenge> {
    return apiClient.put<Challenge>(`/challenges/${challengeId}`, data);
  }

  /**
   * Delete a challenge (creator only)
   */
  async deleteChallenge(challengeId: string): Promise<void> {
    return apiClient.delete<void>(`/challenges/${challengeId}`);
  }
}

export const challengeService = new ChallengeService();
