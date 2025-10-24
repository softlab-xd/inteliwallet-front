import { apiClient } from "../client"
import type { PaginatedResponse } from "../types"

export interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  title: string
  category: string
  date: string
  createdAt: string
}

export interface GetTransactionsParams {
  page?: number
  limit?: number
  type?: "income" | "expense" | "all"
  category?: string
  startDate?: string
  endDate?: string
}

export async function getTransactions(params: GetTransactionsParams = {}): Promise<PaginatedResponse<Transaction>> {
  const response = await apiClient.get<PaginatedResponse<Transaction>>("/transactions", { params })
  return response.data
}
