"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Zap, Target, TrendingUp, Award, Crown, Flame, Lock, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

type Achievement = {
  id: string
  title: string
  description: string
  icon: typeof Trophy
  points: number
  unlocked: boolean
  unlockedDate?: string
  progress?: number
  maxProgress?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

const achievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Record your first transaction",
    icon: Star,
    points: 10,
    unlocked: true,
    unlockedDate: "2025-01-15",
    rarity: "common",
  },
  {
    id: "2",
    title: "Budget Master",
    description: "Stay under budget for 7 consecutive days",
    icon: Target,
    points: 50,
    unlocked: true,
    unlockedDate: "2025-01-20",
    rarity: "rare",
  },
  {
    id: "3",
    title: "Savings Streak",
    description: "Save money for 30 consecutive days",
    icon: Flame,
    points: 100,
    unlocked: false,
    progress: 18,
    maxProgress: 30,
    rarity: "epic",
  },
  {
    id: "4",
    title: "Goal Crusher",
    description: "Complete your first financial goal",
    icon: Trophy,
    points: 75,
    unlocked: false,
    progress: 1,
    maxProgress: 1,
    rarity: "rare",
  },
  {
    id: "5",
    title: "Transaction Tracker",
    description: "Record 100 transactions",
    icon: TrendingUp,
    points: 50,
    unlocked: false,
    progress: 42,
    maxProgress: 100,
    rarity: "rare",
  },
  {
    id: "6",
    title: "Financial Guru",
    description: "Maintain positive cash flow for 3 months",
    icon: Crown,
    points: 200,
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    rarity: "legendary",
  },
  {
    id: "7",
    title: "Early Bird",
    description: "Check your finances before 8 AM for 7 days",
    icon: Zap,
    points: 25,
    unlocked: true,
    unlockedDate: "2025-01-18",
    rarity: "common",
  },
  {
    id: "8",
    title: "Investment Pioneer",
    description: "Start your first investment goal",
    icon: Award,
    points: 150,
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    rarity: "epic",
  },
]

const rarityColors = {
  common: "oklch(0.65 0.02 285)",
  rare: "oklch(0.6 0.2 260)",
  epic: "oklch(0.55 0.22 310)",
  legendary: "oklch(0.75 0.15 45)",
}

type Challenge = {
  id: string
  title: string
  description: string
  reward: number
  deadline: string
  progress: number
  maxProgress: number
  completed: boolean
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "Weekly Saver",
    description: "Save $200 this week",
    reward: 30,
    deadline: "2025-01-31",
    progress: 145,
    maxProgress: 200,
    completed: false,
  },
  {
    id: "2",
    title: "Budget Conscious",
    description: "Spend less than $50 on dining out this week",
    reward: 20,
    deadline: "2025-01-31",
    progress: 32,
    maxProgress: 50,
    completed: false,
  },
  {
    id: "3",
    title: "Goal Contributor",
    description: "Add $500 to any goal this month",
    reward: 50,
    deadline: "2025-01-31",
    progress: 500,
    maxProgress: 500,
    completed: true,
  },
]

export function GamificationPanel() {
  const { t } = useLanguage()
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

  return (
    <div className="space-y-6">
      {/* Player Stats */}
      <Card className="border-border/40 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur">
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
              {((unlockedCount / achievements.length) * 100).toFixed(0)}% {t.gamification.unlocked}
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
            <div className="text-2xl font-bold text-foreground">{challenges.filter((c) => !c.completed).length}</div>
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
              const Icon = achievement.icon
              const progress =
                achievement.progress && achievement.maxProgress
                  ? (achievement.progress / achievement.maxProgress) * 100
                  : 0

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
                          <CardTitle className="text-sm sm:text-base text-foreground truncate">{achievement.title}</CardTitle>
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
                    {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium text-foreground">
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-foreground">{achievement.points} {t.gamification.points}</span>
                      </div>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-accent" />
                          {new Date(achievement.unlockedDate).toLocaleDateString("en-US", {
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
                const progress = (challenge.progress / challenge.maxProgress) * 100
                const daysLeft = Math.ceil(
                  (new Date(challenge.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                )

                return (
                  <div
                    key={challenge.id}
                    className={`rounded-lg border border-border/40 p-4 ${
                      challenge.completed ? "bg-accent/10" : "bg-background/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{challenge.title}</h3>
                          {challenge.completed && <CheckCircle2 className="h-5 w-5 text-accent" />}
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
                          {challenge.completed ? t.gamification.completed : `${daysLeft} ${t.gamification.daysLeft}`}
                        </span>
                        <span className="font-medium text-foreground">
                          ${challenge.progress}/${challenge.maxProgress}
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
                {[
                  { rank: 1, name: t.gamification.you, points: totalPoints, avatar: "👤" },
                  { rank: 2, name: "Sarah M.", points: 245, avatar: "👩" },
                  { rank: 3, name: "John D.", points: 198, avatar: "👨" },
                  { rank: 4, name: "Emma W.", points: 176, avatar: "👩" },
                  { rank: 5, name: "Mike R.", points: 154, avatar: "👨" },
                ].map((user) => (
                  <div
                    key={user.rank}
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
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.points} {t.gamification.points}</p>
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
