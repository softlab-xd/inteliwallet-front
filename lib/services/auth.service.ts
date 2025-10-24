import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "../config/api"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    avatar?: string
    createdAt: string
    totalPoints: number
    level: number
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )

    // Save token to localStorage
    if (typeof window !== "undefined" && response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    return response
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )

    // Save token to localStorage
    if (typeof window !== "undefined" && response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    return response
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      // Clear local storage regardless of API response
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        localStorage.removeItem("friends")
        localStorage.removeItem("friendInvites")
      }
    }
  },

  async getMe(): Promise<AuthResponse["user"]> {
    return apiClient.get<AuthResponse["user"]>(API_ENDPOINTS.AUTH.ME)
  },

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>(
      API_ENDPOINTS.AUTH.REFRESH
    )

    if (typeof window !== "undefined" && response.token) {
      localStorage.setItem("authToken", response.token)
    }

    return response
  },
}
