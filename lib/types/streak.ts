// Streak Types

export type StreakType =
  | 'DAILY_LOGIN'
  | 'MONTHLY_SAVINGS'
  | 'TRANSACTION_LOG'
  | 'CHALLENGE_PARTICIPATION'
  | 'GOAL_PROGRESS';

export interface UserStreak {
  id: string;
  streakType: StreakType;
  streakTypeName: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalDaysActive: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeStreak {
  id: string;
  participantId: string;
  challengeGoalId: string;
  challengeTitle: string;
  currentStreak: number;
  longestStreak: number;
  lastContributionDate: string;
  totalContributions: number;
  streakActive: boolean;
  bonusPointsEarned: number;
  currentStreakBonus: number;
  createdAt: string;
  updatedAt: string;
}
