import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "../config/api"

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  title: string
  category: string
  date: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionData {
  type: "income" | "expense"
  amount: number
  title: string
  category: string
  date?: string
}

export interface TransactionStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  savingsRate: number
  monthlyData: Array<{
    month: string
    income: number
    expenses: number
  }>
  categoryData: Array<{
    name: string
    value: number
    color: string
  }>
  weeklySpending: Array<{
    day: string
    amount: number
  }>
}

export interface TransactionFilters {
  type?: "income" | "expense"
  category?: string
  startDate?: string
  endDate?: string
  search?: string
}

export const transactionService = {
  async list(filters?: TransactionFilters): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>(API_ENDPOINTS.TRANSACTIONS.LIST, {
      params: filters as Record<string, string>,
    })
  },

  async create(data: CreateTransactionData): Promise<Transaction> {
    return apiClient.post<Transaction>(API_ENDPOINTS.TRANSACTIONS.CREATE, data)
  },

  async update(id: string, data: Partial<CreateTransactionData>): Promise<Transaction> {
    return apiClient.put<Transaction>(API_ENDPOINTS.TRANSACTIONS.UPDATE(id), data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.TRANSACTIONS.DELETE(id))
  },

  async getStats(): Promise<TransactionStats> {
    return apiClient.get<TransactionStats>(API_ENDPOINTS.TRANSACTIONS.STATS)
  },
}
