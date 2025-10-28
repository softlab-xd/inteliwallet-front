// Challenge Types

export interface Contributor {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  contributedAmount: number;
  contributionPercentage: number;
  isCreator: boolean;
}

export interface Challenge {
  id: string;
  creator: {
    id: string;
    username: string;
    avatar: string;
  };
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline: string;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
  rewardPoints: number;
  progressPercentage: number;
  topContributors: Contributor[];
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeParticipant {
  id: string;
  challengeGoalId: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    totalPoints: number;
  };
  contributedAmount: number;
  status: 'active' | 'completed' | 'left';
  isCreator: boolean;
  rewardClaimed: boolean;
  contributionPercentage: number;
  joinedAt: string;
}

export interface CreateChallengeRequest {
  title: string;
  description: string;
  targetAmount: number;
  category: string;
  deadline: string;
  maxParticipants: number;
  rewardPoints: number;
}

export interface UpdateChallengeRequest {
  title?: string;
  description?: string;
  targetAmount?: number;
  deadline?: string;
  maxParticipants?: number;
  rewardPoints?: number;
}

export interface ContributeChallengeRequest {
  amount: number;
  note?: string;
}

export interface JoinChallengeResponse {
  id: string;
  challengeGoalId: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    totalPoints: number;
  };
  contributedAmount: number;
  status: 'active' | 'completed' | 'left';
  isCreator: boolean;
  rewardClaimed: boolean;
  contributionPercentage: number;
  joinedAt: string;
}
