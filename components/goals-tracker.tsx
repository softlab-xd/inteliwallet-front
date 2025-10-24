"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Target, Plus, TrendingUp, Calendar, DollarSign, Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

type Goal = {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  color: string
}

const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: "2025-12-31",
    category: "Savings",
    color: "oklch(0.65 0.25 285)",
  },
  {
    id: "2",
    title: "Vacation to Japan",
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: "2025-08-15",
    category: "Travel",
    color: "oklch(0.55 0.22 310)",
  },
  {
    id: "3",
    title: "New Laptop",
    targetAmount: 2500,
    currentAmount: 1950,
    deadline: "2025-03-30",
    category: "Technology",
    color: "oklch(0.6 0.2 260)",
  },
  {
    id: "4",
    title: "Investment Portfolio",
    targetAmount: 15000,
    currentAmount: 4200,
    deadline: "2026-01-01",
    category: "Investment",
    color: "oklch(0.7 0.18 200)",
  },
]

export function GoalsTracker() {
  const { t } = useLanguage()
  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
    category: "",
  })

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = (totalCurrentAmount / totalTargetAmount) * 100

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault()
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: Number.parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      category: newGoal.category,
      color: "oklch(0.65 0.25 285)",
    }
    setGoals([...goals, goal])
    setShowAddDialog(false)
    setNewGoal({ title: "", targetAmount: "", deadline: "", category: "" })
  }

  const getDaysRemaining = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.goals.activeGoals}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{goals.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t.goals.inProgress}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.goals.totalTarget}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalTargetAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{t.goals.combinedGoals}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.goals.totalSaved}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${totalCurrentAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">{overallProgress.toFixed(1)}% {t.goals.ofTarget}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.goals.remaining}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              ${(totalTargetAmount - totalCurrentAmount).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t.goals.toReachAll}</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-foreground">{t.goals.overallProgress}</CardTitle>
          <CardDescription className="text-muted-foreground">{t.goals.combinedProgress}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.goals.totalProgress}</span>
              <span className="font-bold text-foreground">{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">{t.goals.saved}: ${totalCurrentAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{t.goals.target}: ${totalTargetAmount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{t.goals.yourGoals}</h2>
          <p className="text-sm text-muted-foreground">{t.goals.trackAndManage}</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          {t.goals.addGoal}
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const daysRemaining = getDaysRemaining(goal.deadline)
          const isUrgent = daysRemaining < 30 && daysRemaining > 0

          return (
            <Card key={goal.id} className="border-border/40 bg-card/50 backdrop-blur overflow-hidden">
              <div className="h-2" style={{ backgroundColor: goal.color }} />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-foreground">{goal.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {goal.category}
                      </Badge>
                      {isUrgent && (
                        <Badge variant="destructive" className="text-xs">
                          {t.goals.urgent}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t.goals.progress}</span>
                    <span className="font-bold text-foreground">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t.goals.current}</p>
                    <p className="text-lg font-bold text-accent">${goal.currentAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t.goals.target}</p>
                    <p className="text-lg font-bold text-foreground">${goal.targetAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-border/40">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(goal.deadline).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {daysRemaining > 0 ? (
                      <>
                        <TrendingUp className={`h-4 w-4 ${isUrgent ? "text-destructive" : "text-accent"}`} />
                        <span className={`text-sm font-medium ${isUrgent ? "text-destructive" : "text-accent"}`}>
                          {daysRemaining} {t.goals.daysLeft}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-destructive">{t.goals.overdue}</span>
                    )}
                  </div>
                </div>

                <Button className="w-full bg-transparent" variant="outline">
                  {t.goals.addContribution}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.goals.createNewGoal}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t.goals.setNewGoal}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title" className="text-foreground">
                {t.goals.goalTitle}
              </Label>
              <Input
                id="goal-title"
                placeholder={t.goals.goalTitlePlaceholder}
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-amount" className="text-foreground">
                {t.goals.targetAmount}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="goal-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="pl-7 bg-background/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-category" className="text-foreground">
                {t.transactions.category}
              </Label>
              <Input
                id="goal-category"
                placeholder={t.goals.categoryPlaceholder}
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-deadline" className="text-foreground">
                {t.goals.deadline}
              </Label>
              <Input
                id="goal-deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => setShowAddDialog(false)}
              >
                {t.common.cancel}
              </Button>
              <Button type="submit" className="flex-1">
                {t.goals.createGoal}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
