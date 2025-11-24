"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Trophy, Star, Zap, Target, TrendingUp, Award, Crown, Flame, Lock, CheckCircle2, Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { useAchievements } from "@/hooks/use-achievements"
import { useChallenges } from "@/hooks/use-challenges"
import { useLeaderboard, useFriendsLeaderboard } from "@/hooks/use-leaderboard"
import { useState } from "react"
import { motion } from "framer-motion"

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

  const [activeTab, setActiveTab] = useState("achievements")
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState("global")

  const { data: achievements = [], isLoading: achievementsLoading } = useAchievements()
  const { data: challenges = [], isLoading: challengesLoading } = useChallenges()
  const { data: leaderboard = [], isLoading: leaderboardLoading } = useLeaderboard(50)
  const { data: friendsLeaderboard = [], isLoading: friendsLeaderboardLoading } = useFriendsLeaderboard()

  const isLoading = achievementsLoading || challengesLoading || leaderboardLoading || friendsLeaderboardLoading

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        
        <div className="relative grid w-full grid-cols-3 p-1 bg-muted/50 rounded-xl mb-6">
          
          <button
            onClick={() => setActiveTab("achievements")}
            className="relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none focus:ring-0"
          >
            <span className={`relative z-20 ${activeTab === "achievements" ? "text-white" : "text-muted-foreground"}`}>
              {t.gamification.achievements}
            </span>
            {activeTab === "achievements" && (
              <motion.div
                layoutId="gamification-main-tab"
                className="absolute inset-0 bg-purple-600 rounded-lg shadow-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("challenges")}
            className="relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none focus:ring-0"
          >
            <span className={`relative z-20 ${activeTab === "challenges" ? "text-white" : "text-muted-foreground"}`}>
              {t.gamification.challenges}
            </span>
            {activeTab === "challenges" && (
              <motion.div
                layoutId="gamification-main-tab"
                className="absolute inset-0 bg-purple-600 rounded-lg shadow-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className="relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none focus:ring-0"
          >
            <span className={`relative z-20 ${activeTab === "leaderboard" ? "text-white" : "text-muted-foreground"}`}>
              Ranking
            </span>
            {activeTab === "leaderboard" && (
              <motion.div
                layoutId="gamification-main-tab"
                className="absolute inset-0 bg-purple-600 rounded-lg shadow-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        </div>

        <TabsContent value="achievements" className="space-y-4 mt-0 outline-none focus:ring-0">
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
                    style={{ backgroundColor: rarityColors[achievement.rarity as keyof typeof rarityColors] }}
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
        <TabsContent value="challenges" className="space-y-4 mt-0 outline-none focus:ring-0">
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
        </TabsContent>
        <TabsContent value="leaderboard" className="space-y-4 mt-0 outline-none focus:ring-0">
          <Tabs value={activeLeaderboardTab} onValueChange={setActiveLeaderboardTab} className="w-full">
            <div className="relative grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl mb-4">
              <button
                onClick={() => setActiveLeaderboardTab("global")}
                className="relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none focus:ring-0"
              >
                <span className={`relative z-20 ${activeLeaderboardTab === "global" ? "text-white" : "text-muted-foreground"}`}>
                  Global Ranking
                </span>
                {activeLeaderboardTab === "global" && (
                  <motion.div
                    layoutId="gamification-leaderboard-tab"
                    className="absolute inset-0 bg-purple-600 rounded-lg shadow-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveLeaderboardTab("friends")}
                className="relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none focus:ring-0"
              >
                <span className={`relative z-20 ${activeLeaderboardTab === "friends" ? "text-white" : "text-muted-foreground"}`}>
                  Friends Ranking
                </span>
                {activeLeaderboardTab === "friends" && (
                  <motion.div
                    layoutId="gamification-leaderboard-tab"
                    className="absolute inset-0 bg-purple-600 rounded-lg shadow-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </div>

            <TabsContent value="global" className="mt-0 outline-none focus:ring-0">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-foreground">{t.gamification.leaderboard}</CardTitle>
                  <CardDescription className="text-muted-foreground">{t.gamification.topSavers}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboard.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No data available</p>
                      </div>
                    ) : (
                      leaderboard.map((user) => {
                        const avatar = user.avatar
                        const isUrl = avatar?.startsWith('http://') || avatar?.startsWith('https://')

                        return (
                          <div
                            key={user.userId}
                            className={`flex items-center justify-between rounded-lg p-3 ${
                              user.isCurrentUser
                                ? "bg-primary/10 border-2 border-primary/40"
                                : user.rank <= 3
                                  ? "bg-primary/5 border border-primary/20"
                                  : "bg-background/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                                  user.rank === 1
                                    ? "bg-yellow-500 text-yellow-950"
                                    : user.rank === 2
                                      ? "bg-gray-400 text-gray-900"
                                      : user.rank === 3
                                        ? "bg-orange-600 text-orange-50"
                                        : "bg-muted/50 text-muted-foreground"
                                }`}
                              >
                                {user.rank}
                              </div>
                              {isUrl ? (
                                <img
                                  src={avatar}
                                  alt={user.username}
                                  className="h-10 w-10 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null}
                              <div className={`text-2xl ${isUrl ? 'hidden' : ''}`}>
                                {!isUrl && (avatar || "👤")}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">{user.username}</p>
                                  {user.isCurrentUser && (
                                    <Badge variant="secondary" className="text-xs">You</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {user.totalPoints} {t.gamification.points} • Level {user.level}
                                </p>
                              </div>
                            </div>
                            {user.rank === 1 && <Crown className="h-5 w-5 text-yellow-500" />}
                            {user.rank === 2 && <Crown className="h-5 w-5 text-gray-400" />}
                            {user.rank === 3 && <Crown className="h-5 w-5 text-orange-600" />}
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="friends" className="mt-0 outline-none focus:ring-0">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-foreground">Friends Ranking</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Compete with your friends and see who saves the most
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {friendsLeaderboard.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Add friends to see your ranking</p>
                      </div>
                    ) : (
                      friendsLeaderboard.map((user) => {
                        const avatar = user.avatar
                        const isUrl = avatar?.startsWith('http://') || avatar?.startsWith('https://')

                        return (
                          <div
                            key={user.userId}
                            className={`flex items-center justify-between rounded-lg p-3 ${
                              user.isCurrentUser
                                ? "bg-primary/10 border-2 border-primary/40"
                                : user.rank === 1
                                  ? "bg-primary/5 border border-primary/20"
                                  : "bg-background/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                                  user.rank === 1
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-muted/50 text-muted-foreground"
                                }`}
                              >
                                {user.rank}
                              </div>
                              {isUrl ? (
                                <img
                                  src={avatar}
                                  alt={user.username}
                                  className="h-10 w-10 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null}
                              <div className={`text-2xl ${isUrl ? 'hidden' : ''}`}>
                                {!isUrl && (avatar || "👤")}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">{user.username}</p>
                                  {user.isCurrentUser && (
                                    <Badge variant="secondary" className="text-xs">You</Badge>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {user.totalPoints} {t.gamification.points} • Level {user.level}
                                </p>
                              </div>
                            </div>
                            {user.rank === 1 && <Crown className="h-5 w-5 text-accent" />}
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}