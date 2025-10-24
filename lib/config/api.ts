// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  TIMEOUT: 30000,
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  // Users
  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/profile",
    DELETE: "/users/profile",
  },
  // Transactions
  TRANSACTIONS: {
    LIST: "/transactions",
    CREATE: "/transactions",
    UPDATE: (id: string) => `/transactions/${id}`,
    DELETE: (id: string) => `/transactions/${id}`,
    STATS: "/transactions/stats",
  },
  // Goals
  GOALS: {
    LIST: "/goals",
    CREATE: "/goals",
    UPDATE: (id: string) => `/goals/${id}`,
    DELETE: (id: string) => `/goals/${id}`,
    CONTRIBUTE: (id: string) => `/goals/${id}/contribute`,
  },
  // Friends
  FRIENDS: {
    LIST: "/friends",
    ADD: "/friends/add",
    REMOVE: (id: string) => `/friends/${id}`,
    INVITES: "/friends/invites",
    ACCEPT: (id: string) => `/friends/invites/${id}/accept`,
    DECLINE: (id: string) => `/friends/invites/${id}/decline`,
  },
  // Gamification
  GAMIFICATION: {
    ACHIEVEMENTS: "/gamification/achievements",
    LEADERBOARD: "/gamification/leaderboard",
    CHALLENGES: "/gamification/challenges",
  },
}
