import { apiClient } from "../client"
import type { User } from "@/lib/types/user"
import type { ApiResponse } from "../types"

export async function getProfile(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>("/users/profile")
  return response.data.data
}
