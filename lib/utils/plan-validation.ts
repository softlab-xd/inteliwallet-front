import { PLAN_LIMITS, type PlanType } from '../types/subscription';

/**
 * Check if user can create a new goal based on their plan
 */
export function canCreateGoal(currentPlan: PlanType, activeGoalsCount: number): {
  allowed: boolean;
  limit: number;
  message?: string;
} {
  const limit = PLAN_LIMITS[currentPlan].activeGoals;
  const allowed = activeGoalsCount < limit;

  return {
    allowed,
    limit,
    message: allowed
      ? undefined
      : `You have reached the limit of ${limit} active goals for your ${currentPlan} plan. Upgrade to create more goals.`,
  };
}

/**
 * Check if user can create a new challenge based on their plan
 */
export function canCreateChallenge(currentPlan: PlanType, createdChallengesCount: number): {
  allowed: boolean;
  limit: number;
  message?: string;
} {
  const limit = PLAN_LIMITS[currentPlan].createdChallenges;
  const allowed = createdChallengesCount < limit;

  if (currentPlan === 'free') {
    return {
      allowed: false,
      limit: 0,
      message: 'Free plan users cannot create challenges. Upgrade to Standard or Plus to create challenges.',
    };
  }

  return {
    allowed,
    limit,
    message: allowed
      ? undefined
      : `You have reached the limit of ${limit} created challenges for your ${currentPlan} plan. Upgrade to create more challenges.`,
  };
}

/**
 * Get upgrade suggestion based on current plan
 */
export function getUpgradeSuggestion(currentPlan: PlanType): {
  suggestedPlan: 'standard' | 'plus' | null;
  benefits: string[];
} {
  if (currentPlan === 'free') {
    return {
      suggestedPlan: 'standard',
      benefits: [
        'Create up to 3 challenges',
        '6 active goals (double your current limit)',
        'Full streaks system',
        'Priority support',
      ],
    };
  }

  if (currentPlan === 'standard') {
    return {
      suggestedPlan: 'plus',
      benefits: [
        'Create up to 6 challenges (double your current limit)',
        '10 active goals',
        'Early access to new features',
        'Priority support',
      ],
    };
  }

  return {
    suggestedPlan: null,
    benefits: [],
  };
}

/**
 * Get plan features comparison
 */
export function getPlanFeatures(plan: PlanType) {
  return {
    plan,
    limits: PLAN_LIMITS[plan],
    features: getPlanFeatureList(plan),
  };
}

function getPlanFeatureList(plan: PlanType): string[] {
  const baseFeatures = [
    'Transaction tracking',
    'Spending analytics',
    'Join unlimited challenges',
    'Basic streaks tracking',
  ];

  if (plan === 'free') {
    return [
      ...baseFeatures,
      `${PLAN_LIMITS.free.activeGoals} active goals`,
      'Cannot create challenges',
      'Community support',
    ];
  }

  if (plan === 'standard') {
    return [
      ...baseFeatures,
      `${PLAN_LIMITS.standard.activeGoals} active goals`,
      `Create up to ${PLAN_LIMITS.standard.createdChallenges} challenges`,
      'Full streaks system',
      'Priority support',
    ];
  }

  return [
    ...baseFeatures,
    `${PLAN_LIMITS.plus.activeGoals} active goals`,
    `Create up to ${PLAN_LIMITS.plus.createdChallenges} challenges`,
    'Full streaks system',
    'Priority support',
    'Early access to features',
  ];
}
