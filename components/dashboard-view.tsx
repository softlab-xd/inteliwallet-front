"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet, TrendingUp, Target, Trophy, Plus, Menu, User, LogOut, Users, Flame, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent } from "@/components/ui/tabs"
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
import { StreaksDisplay } from "@/components/streaks-display"
import { PlanSelector } from "@/components/plan-selector"
import { PaymentModal } from "@/components/payment-modal"
import { UpgradeModal } from "@/components/upgrade-modal"
import { PlanBadge } from "@/components/plan-badge"
import { useLanguage } from "@/lib/i18n"
import { useUser } from "@/lib/context/user-context"
import { userService, authService } from "@/lib/services"
import type { Payment } from "@/lib/types/subscription"
import { motion, AnimatePresence } from "framer-motion";

type View = "dashboard" | "transactions" | "goals" | "achievements" | "challenges" | "streaks" | "subscription" | "profile"

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
  const [hoveredView, setHoveredView] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [activeTab, setActiveTab] = useState("available");
  
  const navItems = [
    { id: "dashboard", label: t.navigation.dashboard, icon: TrendingUp },
    { id: "transactions", label: t.navigation.transactions, icon: Wallet },
    { id: "goals", label: t.navigation.goals, icon: Target },
    { id: "achievements", label: t.navigation.achievements, icon: Trophy },
    { id: "challenges", label: "Challenges", icon: Users }, 
    { id: "streaks", label: "Streaks", icon: Flame },       
    { id: "subscription", label: "Plans", icon: Crown },    
    { id: "profile", label: t.navigation.profile, icon: User } 
  ]

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
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 h-16 transition-all">
        <div className="flex h-16 items-center justify-between px-4 max-w-full">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary shrink-0">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-foreground truncate">{t.dashboard.title}</h1>
                {user ? (
                  <PlanBadge plan={user.plan} />
                ) : (
                  <div className="h-5 w-12 bg-muted/50 animate-pulse rounded" />
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">{t.dashboard.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSelector />
          
          </div>
        </div>
      </header>
      <div className="flex flex-1 pt-16">
        <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-64 border-r border-border/40 bg-card/50 overflow-y-auto z-40">
          <nav className="space-y-2 p-4">
            <div className="grid gap-1">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setHoveredView(item.id)}
                  onMouseLeave={() => setHoveredView(null)}
                >
                  <AnimatePresence>
                    {hoveredView === item.id && (
                      <motion.div
                        layoutId="hover-bg"
                        className="absolute inset-0 bg-purple-900 rounded-md"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                      />
                    )}
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    className={`cursor-pointer border-none outline-none ring-0 focus:ring-0 relative w-full justify-start gap-3 z-10 transition-all duration-300 
                      ${currentView === item.id
                        ? "bg-purple-800 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-purple-800"
                        : "hover:bg-transparent text-muted-foreground hover:text-foreground"
                      }
                    `}
                    onClick={() => handleViewChange(item.id as any)}
                  >
                    <item.icon className={`h-5 w-5 ${currentView === item.id ? "text-yellow-300 drop-shadow-[0_0_2px_rgba(253,224,71,0.8)]" : ""}`} />
                    <span className={currentView === item.id ? "font-bold" : ""}>
                      {item.label}
                    </span>
                  </Button>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border/40 mt-2">
              <Button
                variant="ghost"
                className="cursor-pointer border-none outline-none ring-0 focus:ring-0 w-full justify-start gap-3 mt-2 transition-all duration-300 group
                  text-muted-foreground
                  hover:text-white
                  hover:bg-red-500/70
                  hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,1)]" />
                <span className="group-hover:font-bold group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
                  {t.profile.logout}
                </span>
              </Button>
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto md:ml-64 pb-24 md:pb-6">
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {currentView === "dashboard" && <SpendingDashboard refreshTrigger={refreshTrigger} />}
            {currentView === "transactions" && <TransactionsList onTransactionChange={handleTransactionChange} />}
            {currentView === "goals" && <GoalsTracker />}
            {currentView === "achievements" && <GamificationPanel />}
            {currentView === "challenges" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Challenges</h1>
                  <Button 
                    onClick={() => setShowCreateChallenge(true)}
                    className="cursor-pointer group"
                  >
                    <Plus 
                      className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" 
                    />
                    Create Challenge
                  </Button>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="relative grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl mb-6">
                    <button
                      onClick={() => setActiveTab("available")}
                      className="relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none"
                    >
                      <span className={`relative z-20 ${activeTab === "available" ? "text-white" : "text-muted-foreground"}`}>
                        Available
                      </span>
                      {activeTab === "available" && (
                        <motion.div
                          layoutId="active-tab-bg"
                          className="absolute inset-0 bg-purple-800 rounded-lg shadow-md"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("my")}
                      className="relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-colors cursor-pointer outline-none"
                    >
                      <span className={`relative z-20 ${activeTab === "my" ? "text-white" : "text-muted-foreground"}`}>
                        My Challenges
                      </span>
                      {activeTab === "my" && (
                        <motion.div
                          layoutId="active-tab-bg"
                          className="absolute inset-0 bg-purple-800 rounded-lg shadow-md"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  </div>
                  <TabsContent value="available" className="mt-0 outline-none focus:ring-0">
                    <AvailableChallenges key={refreshTrigger} />
                  </TabsContent>
                  <TabsContent value="my" className="mt-0 outline-none focus:ring-0">
                    <MyChallenges key={refreshTrigger} />
                  </TabsContent>
                </Tabs>
              </div>
            )}
            {currentView === "streaks" && <StreaksDisplay key={refreshTrigger} />}
            {currentView === "subscription" && (
              <PlanSelector
                currentPlan={user?.plan || 'free'}
                onPlanSelected={(payment) => {
                  setPaymentData(payment)
                  setShowPaymentModal(true)
                }}
              />
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around p-2 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-300 ${
              currentView === "dashboard" 
                ? "bg-purple-800 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-purple-900" 
                : "text-muted-foreground hover:text-purple-600 hover:bg-transparent"
            }`}
            onClick={() => handleViewChange("dashboard")}
          >
            <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "dashboard" ? "text-yellow-300" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.dashboard}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-300 ${
              currentView === "transactions" 
                ? "bg-purple-800 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-purple-900" 
                : "text-muted-foreground hover:text-purple-600 hover:bg-transparent"
            }`}
            onClick={() => handleViewChange("transactions")}
          >
            <Wallet className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "transactions" ? "text-yellow-300" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.transactions}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-300 ${
              currentView === "goals" 
                ? "bg-purple-800 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-purple-900" 
                : "text-muted-foreground hover:text-purple-600 hover:bg-transparent"
            }`}
            onClick={() => handleViewChange("goals")}
          >
            <Target className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "goals" ? "text-yellow-300" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.goals}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-300 ${
              currentView === "achievements" 
                ? "bg-purple-800 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-purple-900" 
                : "text-muted-foreground hover:text-purple-600 hover:bg-transparent"
            }`}
            onClick={() => handleViewChange("achievements")}
          >
            <Trophy className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "achievements" ? "text-yellow-300" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.achievements}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-300 ${
              currentView === "profile" 
                ? "bg-purple-800 text-white shadow-[0_0_10px_rgba(168,85,247,0.6)] hover:bg-purple-900" 
                : "text-muted-foreground hover:text-purple-600 hover:bg-transparent"
            }`}
            onClick={() => handleViewChange("profile")}
          >
            <User className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "profile" ? "text-yellow-300" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.profile}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.profile.logout}</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}