"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
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

export function SpendingDashboard() {
  const { t } = useLanguage()

  const monthlyData = useMemo(
    () => [
      { month: t.months.jan, income: 4500, expenses: 3200 },
      { month: t.months.feb, income: 4800, expenses: 3400 },
      { month: t.months.mar, income: 4600, expenses: 3100 },
      { month: t.months.apr, income: 5200, expenses: 3800 },
      { month: t.months.may, income: 5000, expenses: 3600 },
      { month: t.months.jun, income: 5400, expenses: 4200 },
    ],
    [t]
  )

  const categoryData = useMemo(
    () => [
      { name: t.transactions.categories.foodDining, value: 850, color: "oklch(0.65 0.25 285)" },
      { name: t.transactions.categories.transportation, value: 420, color: "oklch(0.55 0.22 310)" },
      { name: t.transactions.categories.shopping, value: 680, color: "oklch(0.6 0.2 260)" },
      { name: t.transactions.categories.entertainment, value: 320, color: "oklch(0.7 0.18 200)" },
      { name: t.transactions.categories.billsUtilities, value: 950, color: "oklch(0.75 0.15 160)" },
      { name: t.transactions.categories.other, value: 380, color: "oklch(0.55 0.22 15)" },
    ],
    [t]
  )

  const weeklySpending = useMemo(
    () => [
      { day: t.days.mon, amount: 120 },
      { day: t.days.tue, amount: 85 },
      { day: t.days.wed, amount: 150 },
      { day: t.days.thu, amount: 95 },
      { day: t.days.fri, amount: 180 },
      { day: t.days.sat, amount: 220 },
      { day: t.days.sun, amount: 140 },
    ],
    [t]
  )
  const totalIncome = 5400
  const totalExpenses = 4200
  const balance = totalIncome - totalExpenses
  const savingsRate = ((balance / totalIncome) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.totalBalance}</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-accent font-medium">+{savingsRate}%</span> {t.dashboard.savingsRate}
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
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-accent font-medium">+8%</span> {t.dashboard.fromLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.expenses}</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-destructive font-medium">+10%</span> {t.dashboard.fromLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.thisWeek}</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$990</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-muted-foreground">$141</span> {t.dashboard.dailyAverage}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Income vs Expenses Chart */}
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

        {/* Spending by Category */}
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

      {/* Weekly Spending Bar Chart */}
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

      {/* Quick Insights */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.topSpendingCategory}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">{t.transactions.categories.billsUtilities}</div>
            <p className="text-sm text-muted-foreground mt-1">$950 {t.dashboard.thisMonth}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.averageDailySpend}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-foreground">$140</div>
            <p className="text-sm text-muted-foreground mt-1">{t.dashboard.basedOnLast30Days}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.budgetStatus}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-accent">{t.dashboard.onTrack}</div>
            <p className="text-sm text-muted-foreground mt-1">78% {t.dashboard.ofBudgetUsed}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
