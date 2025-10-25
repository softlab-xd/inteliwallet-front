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

function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )

    if (typeof window !== "undefined" && response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setCookie("authToken", response.token, 7)
    }

    return response
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )

    if (typeof window !== "undefined" && response.token) {
      localStorage.setItem("authToken", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setCookie("authToken", response.token, 7)
    }

    return response
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        localStorage.removeItem("friends")
        localStorage.removeItem("friendInvites")
        deleteCookie("authToken")
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
