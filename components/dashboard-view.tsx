"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Wallet, TrendingUp, Target, Trophy, Plus, User, LogOut, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

type View = "dashboard" | "transactions" | "goals" | "achievements" | "challenges" | "profile"

export function DashboardView() {
  const router = useRouter()
  const { t } = useLanguage()
  const { user } = useUser()
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showCreateChallenge, setShowCreateChallenge] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
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
              <h1 className="text-base sm:text-lg font-bold text-foreground truncate">{t.dashboard.title}</h1>
              <p className="text-xs text-muted-foreground truncate hidden sm:block">{t.dashboard.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSelector />
          
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <Button
          size="icon"
          variant="ghost"
          className="hidden md:flex fixed left-0 top-20 z-50 transition-all duration-300 hover:bg-transparent"
          style={{ left: isSidebarOpen ? '240px' : '0px' }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>

        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 256, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="hidden border-r border-border/40 bg-card/50 md:block overflow-hidden fixed left-0 top-16 h-[calc(100vh-4rem)] z-40"
            >
              <div className="relative h-full">
                <nav className="space-y-2 p-4 w-64 h-full">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 cursor-pointer transition-all duration-200 ${
                      currentView === "dashboard" 
                        ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20"
                        : "hover:bg-[#9F55FF]/10 text-muted-foreground" 
                    }`}
                    onClick={() => handleViewChange("dashboard")}
                  >
                    <TrendingUp className={`h-5 w-5 ${currentView === "dashboard" ? "text-white" : ""}`} />
                    {t.navigation.dashboard}
                  </Button>

                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 cursor-pointer transition-all duration-200 ${
                      currentView === "transactions" 
                        ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                        : "hover:bg-[#9F55FF]/10 text-muted-foreground"
                    }`}
                    onClick={() => handleViewChange("transactions")}
                  >
                    <Wallet className={`h-5 w-5 ${currentView === "transactions" ? "text-white" : ""}`} />
                    {t.navigation.transactions}
                  </Button>

                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 cursor-pointer transition-all duration-200 ${
                      currentView === "goals" 
                        ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                        : "hover:bg-[#9F55FF]/10 text-muted-foreground"
                    }`}
                    onClick={() => handleViewChange("goals")}
                  >
                    <Target className={`h-5 w-5 ${currentView === "goals" ? "text-white" : ""}`} />
                    {t.navigation.goals}
                  </Button>

                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 cursor-pointer transition-all duration-200 ${
                      currentView === "achievements" 
                        ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                        : "hover:bg-[#9F55FF]/10 text-muted-foreground"
                    }`}
                    onClick={() => handleViewChange("achievements")}
                  >
                    <Trophy className={`h-5 w-5 ${currentView === "achievements" ? "text-white" : ""}`} />
                    {t.navigation.achievements}
                  </Button>

                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 cursor-pointer transition-all duration-200 ${
                      currentView === "challenges" 
                        ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                        : "hover:bg-[#9F55FF]/10 text-muted-foreground"
                    }`}
                    onClick={() => handleViewChange("challenges")}
                  >
                    <Users className={`h-5 w-5 ${currentView === "challenges" ? "text-white" : ""}`} />
                    {t.navigation.challenges}
                  </Button>

                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 cursor-pointer transition-all duration-200 ${
                      currentView === "profile" 
                        ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                        : "hover:bg-[#9F55FF]/10 text-muted-foreground"
                    }`}
                    onClick={() => handleViewChange("profile")}
                  >
                    <User className={`h-5 w-5 ${currentView === "profile" ? "text-white" : ""}`} />
                    {t.navigation.profile}
                  </Button>

                  <div className="pt-2 border-t border-border/40">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
                      onClick={() => setShowLogoutConfirm(true)}
                    >
                      <LogOut className="h-5 w-5" />
                      {t.profile.logout}
                    </Button>
                  </div>
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className={`flex-1 pt-16 overflow-auto transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
          <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
            {currentView === "dashboard" && <SpendingDashboard refreshTrigger={refreshTrigger} />}
            {currentView === "transactions" && <TransactionsList onTransactionChange={handleTransactionChange} />}
            {currentView === "goals" && <GoalsTracker />}
            {currentView === "achievements" && <GamificationPanel />}
            {currentView === "challenges" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{t.navigation.challenges}</h1>
                  <Button onClick={() => setShowCreateChallenge(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.challenges?.createChallenge || "Create Challenge"}
                  </Button>
                </div>
                <Tabs defaultValue="available" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="available">{t.challenges?.available || "Available"}</TabsTrigger>
                    <TabsTrigger value="my">{t.challenges?.myChallenges || "My Challenges"}</TabsTrigger>
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

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around p-2 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-200 ${
              currentView === "dashboard" 
                ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                : "text-muted-foreground hover:text-[#9F55FF] hover:bg-[#9F55FF]/10"
            }`}
            onClick={() => handleViewChange("dashboard")}
          >
            <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "dashboard" ? "text-white" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.dashboard}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-200 ${
              currentView === "transactions" 
                ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                : "text-muted-foreground hover:text-[#9F55FF] hover:bg-[#9F55FF]/10"
            }`}
            onClick={() => handleViewChange("transactions")}
          >
            <Wallet className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "transactions" ? "text-white" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.transactions}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-200 ${
              currentView === "goals" 
                ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                : "text-muted-foreground hover:text-[#9F55FF] hover:bg-[#9F55FF]/10"
            }`}
            onClick={() => handleViewChange("goals")}
          >
            <Target className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "goals" ? "text-white" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.goals}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-200 ${
              currentView === "achievements" 
                ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                : "text-muted-foreground hover:text-[#9F55FF] hover:bg-[#9F55FF]/10"
            }`}
            onClick={() => handleViewChange("achievements")}
          >
            <Trophy className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "achievements" ? "text-white" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.achievements}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={`flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer transition-all duration-200 ${
              currentView === "profile" 
                ? "bg-[#9F55FF] text-white hover:bg-[#8B45E6] shadow-md shadow-[#9F55FF]/20" 
                : "text-muted-foreground hover:text-[#9F55FF] hover:bg-[#9F55FF]/10"
            }`}
            onClick={() => handleViewChange("profile")}
          >
            <User className={`h-4 w-4 sm:h-5 sm:w-5 ${currentView === "profile" ? "text-white" : ""}`} />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.navigation.profile}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex-col gap-0.5 h-auto py-2 px-1 flex-1 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-[9px] sm:text-xs truncate max-w-full">{t.profile.logout}</span>
          </Button>
        </div>
      </nav>

      <Onboarding open={showOnboarding} onComplete={handleCompleteOnboarding} />

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.profile?.logoutConfirm?.title || "Confirm Logout"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.profile?.logoutConfirm?.description || "Are you sure you want to log out? You'll need to sign in again to access your account."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.common?.cancel || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await authService.logout()
                  router.push("/login")
                } catch (error) {
                  console.error("Error logging out:", error)
                  router.push("/login")
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.profile?.logout || "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}