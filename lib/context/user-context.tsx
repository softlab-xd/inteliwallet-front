"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, Friend, FriendInvite } from "../types/user"
import { userService, friendService } from "../services"
import { streakService } from "../services/streak.service"

interface UserContextType {
  user: User | null
  friends: Friend[]
  friendInvites: FriendInvite[]
  isLoading: boolean
  updateUser: (_userData: Partial<User>) => Promise<void>
  deleteAccount: () => Promise<void>
  addFriend: (_username: string) => Promise<void>
  removeFriend: (_friendId: string) => Promise<void>
  acceptInvite: (_inviteId: string) => Promise<void>
  declineInvite: (_inviteId: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendInvites, setFriendInvites] = useState<FriendInvite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    const startTime = Date.now()
    try {
      setIsLoading(true)
      const token = localStorage.getItem("authToken")

      if (!token) {
        console.log("❌ No auth token found")
        setUser(null)
        setFriends([])
        setFriendInvites([])
        return
      }

      console.log("🔄 Loading user profile...")
      const userProfile = await userService.getProfile()
      console.log("✅ User Profile loaded:", userProfile)

      setUser(userProfile)
      localStorage.setItem("user", JSON.stringify(userProfile))

      const profileLoadTime = Date.now() - startTime
      console.log(`⏱️  Profile loaded in ${profileLoadTime}ms`)

      console.log("🔄 Loading friends and invites...")
      const friendsStartTime = Date.now()

      const [friendsList, invitesList] = await Promise.all([
        friendService.list().catch(err => {
          console.error("❌ Error loading friends:", err)
          console.error("Error details:", err.response?.data)
          return []
        }),
        friendService.getInvites().catch(err => {
          console.error("❌ Error loading invites:", err)
          console.error("Error details:", err.response?.data)

          if (err.response?.data?.message?.includes('LazyInitializationException')) {
            console.error("🔴 Backend Error: Friend invites have a Hibernate LazyInitializationException")
            console.error("💡 This needs to be fixed in the backend by adding @Transactional or fetch join")
          }

          return []
        }),
      ])

      const friendsLoadTime = Date.now() - friendsStartTime
      console.log(`✅ Friends list loaded (${friendsList.length} friends):`, friendsList)
      console.log(`✅ Friend invites loaded (${invitesList.length} invites):`, invitesList)
      console.log(`⏱️  Friends/invites loaded in ${friendsLoadTime}ms`)

      setFriends(friendsList)
      setFriendInvites(invitesList)

      streakService.recordStreak('DAILY_LOGIN').catch((err) => {
        console.debug("Streak already recorded today or error:", err)
      })

      const totalTime = Date.now() - startTime
      console.log(`⏱️  Total load time: ${totalTime}ms`)
    } catch (error) {
      console.error("❌ Error fetching user data:", error)
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
      const result = await friendService.add(username)
      console.log("✅ Friend invite sent:", result)
      await refreshUser()
    } catch (error: any) {
      console.error("❌ Error adding friend:", error)
      console.error("Error details:", error.response?.data)
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
