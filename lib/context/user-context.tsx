"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, Friend, FriendInvite } from "../types/user"
import { userService, friendService } from "../services"

interface UserContextType {
  user: User | null
  friends: Friend[]
  friendInvites: FriendInvite[]
  isLoading: boolean
  updateUser: (userData: Partial<User>) => Promise<void>
  deleteAccount: () => Promise<void>
  addFriend: (username: string) => Promise<void>
  removeFriend: (friendId: string) => Promise<void>
  acceptInvite: (inviteId: string) => Promise<void>
  declineInvite: (inviteId: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendInvites, setFriendInvites] = useState<FriendInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")

      if (!token) {
        setUser(null)
        setFriends([])
        setFriendInvites([])
        return
      }

      // Fetch user profile
      const userProfile = await userService.getProfile()
      setUser(userProfile)
      localStorage.setItem("user", JSON.stringify(userProfile))

      // Fetch friends and invites in parallel
      const [friendsList, invitesList] = await Promise.all([
        friendService.list(),
        friendService.getInvites(),
      ])

      setFriends(friendsList)
      setFriendInvites(invitesList)
    } catch (error) {
      console.error("Error fetching user data:", error)
      // If auth fails, clear everything
      setUser(null)
      setFriends([])
      setFriendInvites([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return

    try {
      const updatedUser = await userService.updateProfile({
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
      })
      setUser(updatedUser)
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      await userService.deleteAccount()
      setUser(null)
      setFriends([])
      setFriendInvites([])
    } catch (error) {
      console.error("Error deleting account:", error)
      throw error
    }
  }

  const addFriend = async (username: string) => {
    try {
      await friendService.add(username)
      // Optionally refresh the friends list to show pending status
      // await refreshUser()
    } catch (error) {
      console.error("Error adding friend:", error)
      throw error
    }
  }

  const removeFriend = async (friendId: string) => {
    try {
      await friendService.remove(friendId)
      setFriends((prev) => prev.filter((f) => f.id !== friendId))
    } catch (error) {
      console.error("Error removing friend:", error)
      throw error
    }
  }

  const acceptInvite = async (inviteId: string) => {
    try {
      const newFriend = await friendService.acceptInvite(inviteId)
      setFriends((prev) => [...prev, newFriend])
      setFriendInvites((prev) => prev.filter((i) => i.id !== inviteId))
    } catch (error) {
      console.error("Error accepting invite:", error)
      throw error
    }
  }

  const declineInvite = async (inviteId: string) => {
    try {
      await friendService.declineInvite(inviteId)
      setFriendInvites((prev) => prev.filter((i) => i.id !== inviteId))
    } catch (error) {
      console.error("Error declining invite:", error)
      throw error
    }
  }

  const value = {
    user,
    friends,
    friendInvites,
    isLoading,
    updateUser,
    deleteAccount,
    addFriend,
    removeFriend,
    acceptInvite,
    declineInvite,
    refreshUser,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
