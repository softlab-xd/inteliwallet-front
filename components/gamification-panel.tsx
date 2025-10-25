"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Zap, Target, TrendingUp, Award, Crown, Flame, Lock, CheckCircle2, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { gamificationService, type Achievement as ApiAchievement, type Challenge as ApiChallenge, type LeaderboardEntry } from "@/lib/services/gamification.service"

const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, typeof Trophy> = {
    "trophy": Trophy,
    "star": Star,
    "zap": Zap,
    "target": Target,
    "trending-up": TrendingUp,
    "award": Award,
    "crown": Crown,
    "flame": Flame,
  }
  return iconMap[iconName.toLowerCase()] || Trophy
}

const rarityColors = {
  common: "oklch(0.65 0.02 285)",
  rare: "oklch(0.6 0.2 260)",
  epic: "oklch(0.55 0.22 310)",
  legendary: "oklch(0.75 0.15 45)",
}

export function GamificationPanel() {
  const { t } = useLanguage()
  const [achievements, setAchievements] = useState<ApiAchievement[]>([])
  const [challenges, setChallenges] = useState<ApiChallenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadGamificationData()
  }, [])

  const loadGamificationData = async () => {
    try {
      setIsLoading(true)
      const [achievementsData, challengesData, leaderboardData] = await Promise.all([
        gamificationService.getAchievements(),
        gamificationService.getChallenges(),
        gamificationService.getLeaderboard(),
      ])
      setAchievements(achievementsData)
      setChallenges(challengesData)
      setLeaderboard(leaderboardData)
    } catch (err: any) {
      console.error("Error loading gamification data:", err)
      setAchievements([])
      setChallenges([])
      setLeaderboard([])
    } finally {
      setIsLoading(false)
    }
  }

  const totalPoints = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const level = Math.floor(totalPoints / 100) + 1
  const pointsToNextLevel = level * 100 - totalPoints
  const levelProgress = ((totalPoints % 100) / 100) * 100

  const rarityLabels = {
    common: t.gamification.rarities.common,
    rare: t.gamification.rarities.rare,
    epic: t.gamification.rarities.epic,
    legendary: t.gamification.rarities.legendary,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading gamification data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Player Stats */}
      <Card className="border-border/40 bg-linear-to-br from-primary/20 to-accent/20 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/30 border-4 border-primary">
                <Crown className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{t.gamification.level} {level}</h2>
                <p className="text-sm text-muted-foreground">{t.gamification.financialChampion}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{totalPoints}</div>
              <p className="text-sm text-muted-foreground">{t.gamification.totalPoints}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.gamification.progressTo} {level + 1}</span>
              <span className="font-medium text-foreground">{pointsToNextLevel} {t.gamification.pointsNeeded}</span>
            </div>
            <Progress value={levelProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.gamification.achievements}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {unlockedCount}/{achievements.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {achievements.length > 0 ? ((unlockedCount / achievements.length) * 100).toFixed(0) : 0}% {t.gamification.unlocked}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.gamification.currentStreak}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-destructive" />
              <div className="text-2xl font-bold text-foreground">18 days</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t.gamification.keepGoing}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.gamification.activeChallenges}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{challenges.filter((c) => c.status === "active").length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t.goals.inProgress}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Achievements and Challenges */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">{t.gamification.achievements}</TabsTrigger>
          <TabsTrigger value="challenges">{t.gamification.challenges}</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4 mt-6">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            {achievements.map((achievement) => {
              const Icon = getIconComponent(achievement.icon)

              return (
                <Card
                  key={achievement.id}
                  className={`border-border/40 backdrop-blur relative overflow-hidden ${
                    achievement.unlocked ? "bg-card/50" : "bg-card/30 opacity-75"
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: rarityColors[achievement.rarity] }}
                  />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0 ${
                            achievement.unlocked ? "bg-primary/20 text-primary" : "bg-muted/20 text-muted-foreground"
                          }`}
                        >
                          {achievement.unlocked ? <Icon className="h-5 w-5 sm:h-6 sm:w-6" /> : <Lock className="h-5 w-5 sm:h-6 sm:w-6" />}
                        </div>
                        <div className="space-y-1 min-w-0 flex-1">
                          <CardTitle className="text-sm sm:text-base text-foreground truncate">{achievement.name}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">{achievement.description}</CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs shrink-0"
                        style={{ backgroundColor: rarityColors[achievement.rarity] }}
                      >
                        {rarityLabels[achievement.rarity]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">{achievement.points} {t.gamification.points}</span>
                      </div>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-accent" />
                          {new Date(achievement.unlockedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 mt-6">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">{t.gamification.weeklyChallenges}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t.gamification.completeChallenges}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge) => {
                const progress = (challenge.progress / challenge.target) * 100
                const daysLeft = Math.ceil(
                  (new Date(challenge.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )
                const isCompleted = challenge.status === "completed"

                return (
                  <div
                    key={challenge.id}
                    className={`rounded-lg border border-border/40 p-4 ${
                      isCompleted ? "bg-accent/10" : "bg-background/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                          {isCompleted && <CheckCircle2 className="h-5 w-5 text-accent" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/20 text-primary shrink-0 self-start">
                        +{challenge.reward} pts
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {isCompleted ? t.gamification.completed : `${daysLeft} ${t.gamification.daysLeft}`}
                        </span>
                        <span className="font-medium text-foreground">
                          ${challenge.progress}/${challenge.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-foreground">{t.gamification.leaderboard}</CardTitle>
              <CardDescription className="text-muted-foreground">{t.gamification.topSavers}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between rounded-lg p-3 ${
                      user.rank === 1 ? "bg-primary/20 border border-primary/40" : "bg-background/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          user.rank === 1 ? "bg-accent text-accent-foreground" : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.totalPoints} {t.gamification.points}</p>
                      </div>
                    </div>
                    {user.rank === 1 && <Crown className="h-5 w-5 text-accent" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
