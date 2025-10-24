import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "../config/api"
import type { Friend, FriendInvite } from "../types/user"

export interface AddFriendData {
  username: string
}

export const friendService = {
  async list(): Promise<Friend[]> {
    return apiClient.get<Friend[]>(API_ENDPOINTS.FRIENDS.LIST)
  },

  async add(username: string): Promise<FriendInvite> {
    return apiClient.post<FriendInvite>(
      API_ENDPOINTS.FRIENDS.ADD,
      { username }
    )
  },

  async remove(friendId: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.FRIENDS.REMOVE(friendId))
  },

  async getInvites(): Promise<FriendInvite[]> {
    return apiClient.get<FriendInvite[]>(API_ENDPOINTS.FRIENDS.INVITES)
  },

  async acceptInvite(inviteId: string): Promise<Friend> {
    return apiClient.post<Friend>(API_ENDPOINTS.FRIENDS.ACCEPT(inviteId))
  },

  async declineInvite(inviteId: string): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.FRIENDS.DECLINE(inviteId))
  },
}
