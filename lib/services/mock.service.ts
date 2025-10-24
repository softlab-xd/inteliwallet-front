/**
 * Mock Service para Desenvolvimento Local
 *
 * Este serviço fornece dados mock para desenvolvimento e testes do frontend
 * sem necessidade de um backend rodando.
 *
 * Para usar o mock service:
 * 1. Defina NEXT_PUBLIC_USE_MOCK=true no seu .env.local
 * 2. O aplicativo usará automaticamente os dados mock ao invés de fazer chamadas reais à API
 */

import type { User, Friend, FriendInvite } from "../types/user"
import type { Transaction, TransactionStats } from "./transaction.service"
import type { Goal } from "./goal.service"
import type { Achievement, LeaderboardEntry, Challenge } from "./gamification.service"
import type { AuthResponse, LoginCredentials, RegisterData } from "./auth.service"

// Mock User
export const mockUser: User = {
  id: "mock-user-1",
  username: "UsuárioDemo",
  email: "demo@inteliwallet.com",
  avatar: "👤",
  createdAt: new Date().toISOString(),
  totalPoints: 850,
  level: 8,
  hasCompletedOnboarding: false, // Mude para true se quiser pular o onboarding
}

// Mock Friends
export const mockFriends: Friend[] = [
  {
    id: "friend-1",
    username: "Maria Silva",
    avatar: "👩",
    totalPoints: 1250,
    rank: 1,
    status: "active",
  },
  {
    id: "friend-2",
    username: "João Santos",
    avatar: "👨",
    totalPoints: 680,
    rank: 3,
    status: "active",
  },
  {
    id: "friend-3",
    username: "Ana Costa",
    avatar: "👩‍💼",
    totalPoints: 420,
    rank: 5,
    status: "active",
  },
]

// Mock Friend Invites
export const mockFriendInvites: FriendInvite[] = [
  {
    id: "invite-1",
    fromUser: {
      id: "user-4",
      username: "Pedro Oliveira",
      avatar: "👨‍💻",
    },
    toUserId: "mock-user-1",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
]

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "expense",
    amount: 85.50,
    title: "Supermercado",
    category: "Alimentação",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tx-2",
    type: "income",
    amount: 5000,
    title: "Salário",
    category: "Salário",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tx-3",
    type: "expense",
    amount: 45.00,
    title: "Uber",
    category: "Transporte",
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock Transaction Stats
export const mockTransactionStats: TransactionStats = {
  totalIncome: 5400,
  totalExpenses: 4200,
  balance: 1200,
  savingsRate: 22.2,
  monthlyData: [
    { month: "Jan", income: 4500, expenses: 3200 },
    { month: "Fev", income: 4800, expenses: 3400 },
    { month: "Mar", income: 4600, expenses: 3100 },
    { month: "Abr", income: 5200, expenses: 3800 },
    { month: "Mai", income: 5000, expenses: 3600 },
    { month: "Jun", income: 5400, expenses: 4200 },
  ],
  categoryData: [
    { name: "Alimentação", value: 850, color: "oklch(0.65 0.25 285)" },
    { name: "Transporte", value: 420, color: "oklch(0.55 0.22 310)" },
    { name: "Compras", value: 680, color: "oklch(0.6 0.2 260)" },
    { name: "Entretenimento", value: 320, color: "oklch(0.7 0.18 200)" },
    { name: "Contas e Utilidades", value: 950, color: "oklch(0.75 0.15 160)" },
    { name: "Outros", value: 380, color: "oklch(0.55 0.22 15)" },
  ],
  weeklySpending: [
    { day: "Seg", amount: 120 },
    { day: "Ter", amount: 85 },
    { day: "Qua", amount: 150 },
    { day: "Qui", amount: 95 },
    { day: "Sex", amount: 180 },
    { day: "Sáb", amount: 220 },
    { day: "Dom", amount: 140 },
  ],
}

// Mock Goals
export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Fundo de Emergência",
    targetAmount: 10000,
    currentAmount: 5500,
    category: "Poupança",
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "goal-2",
    title: "Viagem para Europa",
    targetAmount: 15000,
    currentAmount: 8200,
    category: "Viagem",
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// Mock Achievements
export const mockAchievements: Achievement[] = [
  {
    id: "ach-1",
    name: "Primeira Transação",
    description: "Registre sua primeira transação",
    icon: "🎯",
    rarity: "common",
    points: 10,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: "ach-2",
    name: "Meta Alcançada",
    description: "Complete sua primeira meta financeira",
    icon: "🏆",
    rarity: "rare",
    points: 50,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: "ach-3",
    name: "Mestre das Finanças",
    description: "Atinja 1000 pontos totais",
    icon: "👑",
    rarity: "epic",
    points: 100,
    unlocked: false,
  },
  {
    id: "ach-4",
    name: "Lenda da Economia",
    description: "Economize R$ 50.000 no total",
    icon: "💎",
    rarity: "legendary",
    points: 500,
    unlocked: false,
  },
]

// Mock Leaderboard
export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "friend-1",
    username: "Maria Silva",
    avatar: "👩",
    totalPoints: 1250,
    rank: 1,
    level: 12,
  },
  {
    id: "mock-user-1",
    username: "UsuárioDemo",
    avatar: "👤",
    totalPoints: 850,
    rank: 2,
    level: 8,
  },
  {
    id: "friend-2",
    username: "João Santos",
    avatar: "👨",
    totalPoints: 680,
    rank: 3,
    level: 7,
  },
]

// Mock Challenges
export const mockChallenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Economize R$ 1000",
    description: "Economize pelo menos R$ 1000 este mês",
    progress: 750,
    target: 1000,
    reward: 100,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "challenge-2",
    title: "Registro Diário",
    description: "Registre transações por 7 dias consecutivos",
    progress: 5,
    target: 7,
    reward: 50,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "active",
  },
]

// Mock Service com delay para simular requisições de rede
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

export const mockService = {
  // Auth
  async login(_credentials: LoginCredentials): Promise<AuthResponse> {
    await delay()
    return {
      token: "mock-jwt-token-" + Date.now(),
      user: mockUser,
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay()
    return {
      token: "mock-jwt-token-" + Date.now(),
      user: { ...mockUser, username: data.username, email: data.email },
    }
  },

  async getMe(): Promise<User> {
    await delay()
    return mockUser
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    await delay()
    return mockTransactions
  },

  async getTransactionStats(): Promise<TransactionStats> {
    await delay()
    return mockTransactionStats
  },

  async createTransaction(data: any): Promise<Transaction> {
    await delay()
    const newTransaction: Transaction = {
      id: "tx-" + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newTransaction
  },

  // Goals
  async getGoals(): Promise<Goal[]> {
    await delay()
    return mockGoals
  },

  async createGoal(data: any): Promise<Goal> {
    await delay()
    const newGoal: Goal = {
      id: "goal-" + Date.now(),
      ...data,
      currentAmount: 0,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newGoal
  },

  // Friends
  async getFriends(): Promise<Friend[]> {
    await delay()
    return mockFriends
  },

  async getFriendInvites(): Promise<FriendInvite[]> {
    await delay()
    return mockFriendInvites
  },

  // Gamification
  async getAchievements(): Promise<Achievement[]> {
    await delay()
    return mockAchievements
  },

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    await delay()
    return mockLeaderboard
  },

  async getChallenges(): Promise<Challenge[]> {
    await delay()
    return mockChallenges
  },
}
