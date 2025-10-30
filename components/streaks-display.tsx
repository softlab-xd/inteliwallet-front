"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Zap, TrendingUp, Calendar, Award, Loader2 } from "lucide-react"
import { streakService } from "@/lib/services/streak.service"
import { useToast } from "@/hooks/use-toast"
import type { UserStreak } from "@/lib/types/streak"

export function StreaksDisplay() {
  const { toast } = useToast()
  const [streaks, setStreaks] = useState<UserStreak[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStreaks()
  }, [])

  const loadStreaks = async () => {
    try {
      setIsLoading(true)
      const data = await streakService.getAllStreaks()
      setStreaks(data)
    } catch (err: any) {
      console.error("Error loading streaks:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to load streaks",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStreakEmoji = (current: number) => {
    if (current >= 30) return '🔥🔥🔥'
    if (current >= 14) return '🔥🔥'
    if (current >= 7) return '🔥'
    return '✨'
  }

  const getStreakIcon = (streakType: string) => {
    switch (streakType) {
      case 'DAILY_LOGIN':
        return <Calendar className="h-5 w-5" />
      case 'MONTHLY_SAVINGS':
        return <TrendingUp className="h-5 w-5" />
      case 'TRANSACTION_LOG':
        return <Zap className="h-5 w-5" />
      case 'CHALLENGE_PARTICIPATION':
        return <Award className="h-5 w-5" />
      case 'GOAL_PROGRESS':
        return <TrendingUp className="h-5 w-5" />
      default:
        return <Flame className="h-5 w-5" />
    }
  }

  const getStreakColor = (current: number, isActive: boolean) => {
    if (!isActive) return 'text-muted-foreground'
    if (current >= 30) return 'text-orange-500'
    if (current >= 14) return 'text-red-500'
    if (current >= 7) return 'text-yellow-500'
    return 'text-primary'
  }

  const formatLastActivity = (date: string) => {
    const activityDate = new Date(date)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - activityDate.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays} days ago`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading streaks...</p>
        </div>
      </div>
    )
  }

  if (streaks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Flame className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No streaks yet</p>
          <p className="text-sm text-muted-foreground">Start using the app to build streaks!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Streaks</h2>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-sm font-medium">
            {streaks.filter(s => s.isActive).length} Active
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {streaks.map((streak) => (
          <Card
            key={streak.id}
            className={`hover:shadow-lg transition-shadow ${
              !streak.isActive ? 'opacity-60' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={getStreakColor(streak.currentStreak, streak.isActive)}>
                      {getStreakIcon(streak.streakType)}
                    </div>
                    <CardTitle className="text-lg">{streak.streakTypeName}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Last activity: {formatLastActivity(streak.lastActivityDate)}
                  </CardDescription>
                </div>
                <Badge variant={streak.isActive ? 'default' : 'secondary'}>
                  {streak.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-3xl font-bold flex items-center gap-2">
                    {streak.currentStreak}
                    <span className="text-2xl">{getStreakEmoji(streak.currentStreak)}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-2xl font-bold text-muted-foreground">
                    {streak.longestStreak}
                  </p>
                  <p className="text-xs text-muted-foreground">Best Streak</p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Active Days</span>
                  <span className="font-medium">{streak.totalDaysActive}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium">
                    {new Date(streak.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex gap-1 pt-2">
                {[...Array(7)].map((_, i) => {
                  const isActive = i < Math.min(streak.currentStreak, 7)
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-red-500'
                          : 'bg-muted'
                      }`}
                    />
                  )
                })}
              </div>
              {streak.currentStreak >= 7 && (
                <p className="text-xs text-center text-muted-foreground">
                  7+ day streak! Keep it going!
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
