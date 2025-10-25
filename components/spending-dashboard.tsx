"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { transactionService, type TransactionStats, type Transaction } from "@/lib/services/transaction.service"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const EMPTY_STATS: TransactionStats = {
  totalIncome: 0,
  totalExpenses: 0,
  balance: 0,
  savingsRate: 0,
  monthlyData: [
    { month: "Jan", income: 0, expenses: 0 },
    { month: "Feb", income: 0, expenses: 0 },
    { month: "Mar", income: 0, expenses: 0 },
    { month: "Apr", income: 0, expenses: 0 },
    { month: "May", income: 0, expenses: 0 },
    { month: "Jun", income: 0, expenses: 0 },
  ],
  categoryData: [],
  weeklySpending: [
    { day: "Mon", amount: 0 },
    { day: "Tue", amount: 0 },
    { day: "Wed", amount: 0 },
    { day: "Thu", amount: 0 },
    { day: "Fri", amount: 0 },
    { day: "Sat", amount: 0 },
    { day: "Sun", amount: 0 },
  ],
}

interface SpendingDashboardProps {
  refreshTrigger?: number
}

export function SpendingDashboard({ refreshTrigger }: SpendingDashboardProps) {
  const { t } = useLanguage()
  const [stats, setStats] = useState<TransactionStats>(EMPTY_STATS)
  const [firstTransactionDate, setFirstTransactionDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true)

      const transactions = await transactionService.list()

      if (transactions.length > 0) {
        const dates = transactions.map(t => new Date(t.date))
        const earliestDate = new Date(Math.min(...dates.map(d => d.getTime())))
        setFirstTransactionDate(earliestDate)
      } else {
        setFirstTransactionDate(null)
      }

      try {
        const statsData = await transactionService.getStats()
        setStats(statsData)
      } catch (statsError) {
        console.warn("Stats API failed, calculating locally:", statsError)
        const calculatedStats = calculateStatsFromTransactions(transactions)
        setStats(calculatedStats)
      }
    } catch (err: any) {
      console.error("Error loading transactions:", err)
      setStats(EMPTY_STATS)
      setFirstTransactionDate(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const calculateStatsFromTransactions = (transactions: Transaction[]): TransactionStats => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    })

    const totalIncome = currentMonthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = currentMonthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100) : 0

    const categoryMap = new Map<string, number>()
    currentMonthTransactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        categoryMap.set(t.category, (categoryMap.get(t.category) || 0) + t.amount)
      })

    const categoryData = Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: `oklch(${0.55 + (index * 0.05)} ${0.22 + (index * 0.02)} ${280 + (index * 30)})`,
    }))

    const weeklySpending = []
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.date)
        return tDate.toDateString() === date.toDateString() && t.type === "expense"
      })
      const amount = dayTransactions.reduce((sum, t) => sum + t.amount, 0)
      weeklySpending.push({
        day: dayNames[date.getDay()],
        amount,
      })
    }

    const monthlyData = []
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1)
      const month = date.getMonth()
      const year = date.getFullYear()

      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date)
        return tDate.getMonth() === month && tDate.getFullYear() === year
      })

      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)

      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

      monthlyData.push({
        month: monthNames[month],
        income,
        expenses,
      })
    }

    return {
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
      monthlyData,
      categoryData,
      weeklySpending,
    }
  }

  useEffect(() => {
    loadStats()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadStats()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [loadStats])

  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      loadStats()
    }
  }, [refreshTrigger, loadStats])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const { totalIncome, totalExpenses, balance, savingsRate, monthlyData, categoryData, weeklySpending } = stats

  const weeklyTotal = weeklySpending.reduce((sum, day) => sum + day.amount, 0)

  let daysToCalculate = 1
  if (firstTransactionDate) {
    const today = new Date()
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    const endDate = today < endOfMonth ? today : endOfMonth

    const timeDiff = endDate.getTime() - firstTransactionDate.getTime()
    daysToCalculate = Math.max(1, Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1) 
  } else {
    daysToCalculate = new Date().getDate()
  }

  const dailyAverageFromMonth = totalExpenses / daysToCalculate

  const topCategory = categoryData.length > 0
    ? categoryData.reduce((max, cat) => cat.value > max.value ? cat : max, categoryData[0])
    : null

  const budgetStatus = balance >= 0 ? "healthy" : "overspending"
  const budgetPercentage = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.totalBalance}</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-accent font-medium">+{savingsRate.toFixed(1)}%</span> {t.dashboard.savingsRate}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.income}</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t.dashboard.thisMonth}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.expenses}</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t.dashboard.thisMonth}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.thisWeek}</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${weeklyTotal.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-muted-foreground">${dailyAverageFromMonth.toFixed(2)}</span> {t.dashboard.dailyAverage}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">{t.dashboard.incomeVsExpenses}</CardTitle>
            <CardDescription className="text-muted-foreground">{t.dashboard.lastSixMonths}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ChartContainer
              config={{
                income: {
                  label: "Income",
                  color: "oklch(0.65 0.25 285)",
                },
                expenses: {
                  label: "Expenses",
                  color: "oklch(0.55 0.22 310)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.65 0.25 285)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.65 0.25 285)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.22 310)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.55 0.22 310)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.06 285)" />
                  <XAxis dataKey="month" stroke="oklch(0.65 0.02 285)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0.02 285)" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="oklch(0.65 0.25 285)"
                    fill="url(#incomeGradient)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="oklch(0.55 0.22 310)"
                    fill="url(#expensesGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">{t.dashboard.spendingByCategory}</CardTitle>
            <CardDescription className="text-muted-foreground">{t.dashboard.thisMonthBreakdown}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ChartContainer
              config={{
                value: {
                  label: "Amount",
                  color: "oklch(0.65 0.25 285)",
                },
              }}
              className="h-[250px] sm:h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius="70%"
                    fill="oklch(0.65 0.25 285)"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RePieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-foreground">{t.dashboard.weeklySpendingPattern}</CardTitle>
          <CardDescription className="text-muted-foreground">{t.dashboard.dailyExpenses}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <ChartContainer
            config={{
              amount: {
                label: "Amount",
                color: "oklch(0.65 0.25 285)",
              },
            }}
            className="h-[250px] sm:h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySpending} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.06 285)" />
                <XAxis dataKey="day" stroke="oklch(0.65 0.02 285)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0.02 285)" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="amount" fill="oklch(0.65 0.25 285)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.topSpendingCategory}</CardTitle>
          </CardHeader>
          <CardContent>
            {topCategory ? (
              <>
                <div className="text-xl font-bold text-foreground">{topCategory.name}</div>
                <p className="text-sm text-muted-foreground mt-1">${topCategory.value.toFixed(2)} {t.dashboard.thisMonth}</p>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-muted-foreground">No data</div>
                <p className="text-sm text-muted-foreground mt-1">Add transactions to see insights</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.averageDailySpend}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">${dailyAverageFromMonth.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground mt-1">{t.dashboard.basedOnLast30Days}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.budgetStatus}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xl font-bold ${budgetStatus === "healthy" ? "text-accent" : "text-destructive"}`}>
              {budgetStatus === "healthy" ? t.dashboard.onTrack : "Overspending"}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {budgetPercentage.toFixed(1)}% {t.dashboard.ofBudgetUsed}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
