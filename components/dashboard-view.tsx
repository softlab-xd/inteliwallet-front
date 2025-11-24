"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet, TrendingUp, Target, Trophy, Plus, Menu, User, LogOut, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpendingDashboard } from "@/components/spending-dashboard"
import { TransactionsList } from "@/components/transactions-list"
import { GoalsTracker } from "@/components/goals-tracker"
import { GamificationPanel } from "@/components/gamification-panel"
import { UserProfile } from "@/components/user-profile"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { Onboarding } from "@/components/onboarding"
import { LanguageSelector } from "@/components/language-selector"
import { AvailableChallenges } from "@/components/available-challenges"
import { MyChallenges } from "@/components/my-challenges"
import { CreateChallengeForm } from "@/components/create-challenge-form"
import { useLanguage } from "@/lib/i18n"
import { useUser } from "@/lib/context/user-context"
import { userService, authService } from "@/lib/services"
import type { Payment } from "@/lib/types/subscription"

type View = "dashboard" | "transactions" | "goals" | "achievements" | "challenges" | "profile"

export function DashboardView() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user, refreshUser } = useUser()
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showCreateChallenge, setShowCreateChallenge] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [paymentData, setPaymentData] = useState<Payment | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleViewChange = (view: View) => {
    setCurrentView(view)
  }

  const handleTransactionChange = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    if (user) {
      console.log("✅ User loaded in dashboard:", user)
      if (!user.hasCompletedOnboarding) {
        console.log("🎯 Showing onboarding for user:", user.username)
        setShowOnboarding(true)
      }
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      router.push("/login")
    }
  }
  const handleCompleteOnboarding = async () => {
    try {
      await userService.updateProfile({ hasCompletedOnboarding: true } as any)
      setShowOnboarding(false)
    } catch (error) {
      console.error("Error completing onboarding:", error)
      setShowOnboarding(false)
    }
  }
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4 max-w-full">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary shrink-0">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-bold text-foreground truncate">{t.dashboard.title}</h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">{t.dashboard.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSelector />
            <Button size="icon" variant="ghost" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r border-border/40 bg-card/50 md:block">
          <nav className="space-y-2 p-4">
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("dashboard")}
            >
              <TrendingUp className="h-5 w-5" />
              {t.navigation.dashboard}
            </Button>
            <Button
              variant={currentView === "transactions" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("transactions")}
            >
              <Wallet className="h-5 w-5" />
              {t.navigation.transactions}
            </Button>
            <Button
              variant={currentView === "goals" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("goals")}
            >
              <Target className="h-5 w-5" />
              {t.navigation.goals}
            </Button>
            <Button
              variant={currentView === "achievements" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("achievements")}
            >
              <Trophy className="h-5 w-5" />
              {t.navigation.achievements}
            </Button>
            <Button
              variant={currentView === "challenges" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("challenges")}
            >
              <Users className="h-5 w-5" />
              Challenges
            </Button>
            <Button
              variant={currentView === "streaks" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("streaks")}
            >
              <Flame className="h-5 w-5" />
              Streaks
            </Button>
            <Button
              variant={currentView === "subscription" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("subscription")}
            >
              <Crown className="h-5 w-5" />
              Plans
            </Button>
            <Button
              variant={currentView === "profile" ? "default" : "ghost"}
              className="w-full justify-start gap-3"
              onClick={() => handleViewChange("profile")}
            >
              <User className="h-5 w-5" />
              {t.navigation.profile}
            </Button>
            <div className="pt-2 border-t border-border/40">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                {t.profile.logout}
              </Button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {currentView === "dashboard" && <SpendingDashboard refreshTrigger={refreshTrigger} />}
            {currentView === "transactions" && <TransactionsList onTransactionChange={handleTransactionChange} />}
            {currentView === "goals" && <GoalsTracker />}
            {currentView === "achievements" && <GamificationPanel />}
            {currentView === "challenges" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Challenges</h1>
                  <Button onClick={() => setShowCreateChallenge(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Challenge
                  </Button>
                </div>
                <Tabs defaultValue="available" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="available">Available</TabsTrigger>
                    <TabsTrigger value="my">My Challenges</TabsTrigger>
                  </TabsList>
                  <TabsContent value="available">
                    <AvailableChallenges key={refreshTrigger} />
                  </TabsContent>
                  <TabsContent value="my">
                    <MyChallenges key={refreshTrigger} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
            {currentView === "profile" && <UserProfile />}
          </div>
        </main>
      </div>
  <Button
  size="icon"
  className="cursor-pointer fixed bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full shadow-lg shadow-primary/50 z-40
             group overflow-hidden outline-none ring-0 focus:ring-0
             hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-all duration-300"
  onClick={() => setShowAddDialog(true)}
>
  <Plus
    className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90
               drop-shadow-[0_0_5px_rgba(255,255,255,0.7)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,1)]"
  />
</Button>
      <AddTransactionDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleTransactionChange}
      />
      <CreateChallengeForm
        open={showCreateChallenge}
        onOpenChange={setShowCreateChallenge}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        paymentData={paymentData}
        onPaymentSuccess={async () => {
          await refreshUser()
          setRefreshTrigger(prev => prev + 1)
          setShowPaymentModal(false)
        }}
      />

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={user?.plan || 'free'}
        onUpgradeClick={() => handleViewChange('subscription')}
      />

      <nav className="sticky bottom-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around p-2 gap-1">
          <Button
            variant={currentView === "dashboard" ? "default" : "ghost"}
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1"
            onClick={() => handleViewChange("dashboard")}
          >
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.dashboard}</span>
          </Button>
          <Button
            variant={currentView === "transactions" ? "default" : "ghost"}
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1"
            onClick={() => handleViewChange("transactions")}
          >
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.transactions}</span>
          </Button>
          <Button
            variant={currentView === "goals" ? "default" : "ghost"}
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1"
            onClick={() => handleViewChange("goals")}
          >
            <Target className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.goals}</span>
          </Button>
          <Button
            variant={currentView === "achievements" ? "default" : "ghost"}
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1"
            onClick={() => handleViewChange("achievements")}
          >
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.achievements}</span>
          </Button>
          <Button
            variant={currentView === "profile" ? "default" : "ghost"}
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1"
            onClick={() => handleViewChange("profile")}
          >
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.profile}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1 text-destructive hover:text-destructive"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.profile.logout}</span>
          </Button>
        </div>
      </nav>

      <Onboarding open={showOnboarding} onComplete={handleCompleteOnboarding} />
    </div>
  )
}
