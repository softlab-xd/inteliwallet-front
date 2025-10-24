import { apiClient } from "../client"
import type { User } from "@/lib/types/user"

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiClient.post<RegisterResponse>("/auth/register", userData)
  return response.data
}
