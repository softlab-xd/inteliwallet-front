import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "../config/api"
import type { User } from "../types/user"

export interface UpdateUserData {
  username?: string
  email?: string
  avatar?: string
}

export const userService = {
  async getProfile(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.USERS.PROFILE)
  },

  async updateProfile(data: UpdateUserData): Promise<User> {
    const updatedUser = await apiClient.put<User>(
      API_ENDPOINTS.USERS.UPDATE,
      data
    )

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }

    return updatedUser
  },

  async deleteAccount(): Promise<void> {
    await apiClient.delete<void>(API_ENDPOINTS.USERS.DELETE)

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      localStorage.removeItem("friends")
      localStorage.removeItem("friendInvites")
    }
  },
}
