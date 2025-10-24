import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "../config/api"

export interface Goal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  category: string
  deadline: string
  status: "active" | "completed" | "overdue"
  createdAt: string
  updatedAt: string
}

export interface CreateGoalData {
  title: string
  targetAmount: number
  currentAmount?: number
  category: string
  deadline: string
}

export interface ContributeData {
  amount: number
}

export const goalService = {
  async list(): Promise<Goal[]> {
    return apiClient.get<Goal[]>(API_ENDPOINTS.GOALS.LIST)
  },

  async create(data: CreateGoalData): Promise<Goal> {
    return apiClient.post<Goal>(API_ENDPOINTS.GOALS.CREATE, data)
  },

  async update(id: string, data: Partial<CreateGoalData>): Promise<Goal> {
    return apiClient.put<Goal>(API_ENDPOINTS.GOALS.UPDATE(id), data)
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.GOALS.DELETE(id))
  },

  async contribute(id: string, amount: number): Promise<Goal> {
    return apiClient.post<Goal>(
      API_ENDPOINTS.GOALS.CONTRIBUTE(id),
      { amount }
    )
  },
}
