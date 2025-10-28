export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  totalPoints: number
  level: number
  hasCompletedOnboarding?: boolean
  plan: 'free' | 'standard' | 'plus'
}

export interface Friend {
  id: string
  username: string
  avatar?: string
  totalPoints: number
  rank: number
  status: "active" | "pending"
}

export interface FriendInvite {
  id: string
  fromUser: {
    id: string
    username: string
    avatar?: string
  }
  toUserId: string
  status: "pending" | "accepted" | "declined"
  createdAt: string
}
