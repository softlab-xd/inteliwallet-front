import { apiClient } from './api-client';
import type {
  Subscription,
  Payment,
  CreateSubscriptionRequest,
} from '../types/subscription';

class SubscriptionService {
  /**
   * Create a new subscription (upgrade plan)
   */
  async createSubscription(data: CreateSubscriptionRequest): Promise<Payment> {
    return apiClient.post<Payment>('/subscriptions', data);
  }

  /**
   * Get all user subscriptions
   */
  async getSubscriptions(): Promise<Subscription[]> {
    return apiClient.get<Subscription[]>('/subscriptions');
  }

  /**
   * Get active subscription
   */
  async getActiveSubscription(): Promise<Subscription> {
    return apiClient.get<Subscription>('/subscriptions/active');
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    return apiClient.post<void>(`/subscriptions/${subscriptionId}/cancel`);
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<Payment[]> {
    return apiClient.get<Payment[]>('/subscriptions/payments');
  }

  /**
   * Get payment details
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    return apiClient.get<Payment>(`/subscriptions/payments/${paymentId}`);
  }
}

export const subscriptionService = new SubscriptionService();
