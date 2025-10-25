export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  TIMEOUT: 30000,
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/profile",
    DELETE: "/users/profile",
  },
  TRANSACTIONS: {
    LIST: "/transactions",
    CREATE: "/transactions",
    UPDATE: (id: string) => `/transactions/${id}`,
    DELETE: (id: string) => `/transactions/${id}`,
    STATS: "/transactions/stats",
  },
  GOALS: {
    LIST: "/goals",
    CREATE: "/goals",
    UPDATE: (id: string) => `/goals/${id}`,
    DELETE: (id: string) => `/goals/${id}`,
    CONTRIBUTE: (id: string) => `/goals/${id}/contribute`,
  },
  FRIENDS: {
    LIST: "/friends",
    ADD: "/friends/add",
    REMOVE: (id: string) => `/friends/${id}`,
    INVITES: "/friends/invites",
    ACCEPT: (id: string) => `/friends/invites/${id}/accept`,
    DECLINE: (id: string) => `/friends/invites/${id}/decline`,
  },
  GAMIFICATION: {
    ACHIEVEMENTS: "/gamification/achievements",
    LEADERBOARD: "/gamification/leaderboard",
    CHALLENGES: "/gamification/challenges",
  },
}
