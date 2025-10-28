// Subscription & Payment Types

export type PlanType = 'free' | 'standard' | 'plus';

export type SubscriptionStatus = 'pending' | 'active' | 'past_due' | 'canceled' | 'expired';

export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'canceled' | 'refunded' | 'expired';

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentUrl: string;
  pixCode: string | null;
  pixQrCode: string | null;
  paidAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface CreateSubscriptionRequest {
  plan: 'STANDARD' | 'PLUS';
  paymentMethod?: 'PIX';
  returnUrl?: string;
  completionUrl?: string;
}

export interface PlanLimits {
  activeGoals: number;
  createdChallenges: number;
  price: number;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  free: {
    activeGoals: 3,
    createdChallenges: 0,
    price: 0,
  },
  standard: {
    activeGoals: 6,
    createdChallenges: 3,
    price: 5,
  },
  plus: {
    activeGoals: 10,
    createdChallenges: 6,
    price: 20,
  },
};
