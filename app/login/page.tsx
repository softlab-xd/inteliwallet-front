"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/i18n"
import { authService } from "@/lib/services"
import { Wallet, TrendingUp, Target, Trophy, Check, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [isLogin, setIsLogin] = useState(true)
  const [isFlipping, setIsFlipping] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleFlip = () => {
    setIsFlipping(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
    }, 250)
    setTimeout(() => {
      setIsFlipping(false)
    }, 500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login
        await authService.login({ email, password })
        router.push("/")
      } else {
        // Register
        if (password !== confirmPassword) {
          setError(t.auth.passwordMismatch)
          setIsLoading(false)
          return
        }

        await authService.register({ username, email, password })
        router.push("/")
      }
    } catch (err: any) {
      console.error("Auth error:", err)
      setError(err.message || "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center perspective-[2000px]">
        <div
          className={`w-full lg:w-1/2 transition-all duration-500 ease-in-out ${
            isFlipping ? "opacity-0 scale-95 rotate-y-12" : "opacity-100 scale-100 rotate-y-0"
          } ${!isLogin ? "lg:order-2" : "lg:order-1"}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="bg-card/50 backdrop-blur border border-border/40 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                  <Wallet className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{t.auth.appName}</h1>
                  <p className="text-sm text-muted-foreground">{t.auth.appTagline}</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {isLogin ? t.auth.welcomeBack : t.auth.createAccount}
              </h2>
              <p className="text-sm text-muted-foreground">{t.auth.appDescription}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground">
                    {t.profile.username}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t.auth.usernamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background/50"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  {t.profile.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  {t.profile.password}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    {t.profile.confirmPassword}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t.auth.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background/50"
                    required
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-primary hover:underline">
                    {t.auth.forgotPassword}
                  </button>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isLogin ? "Logging in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? t.auth.login : t.auth.register
                )}
              </Button>

              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? t.auth.dontHaveAccount : t.auth.alreadyHaveAccount}{" "}
                  <button type="button" onClick={handleFlip} className="text-primary font-medium hover:underline">
                    {isLogin ? t.auth.register : t.auth.login}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div
          className={`w-full lg:w-1/2 transition-all duration-500 ease-in-out ${
            isFlipping ? "opacity-0 scale-95 -rotate-y-12" : "opacity-100 scale-100 rotate-y-0"
          } ${!isLogin ? "lg:order-1" : "lg:order-2"}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur border border-border/40 rounded-2xl p-8 sm:p-12 shadow-2xl">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3">
                  {t.auth.appName}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.auth.appDescription}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.auth.feature1}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 shrink-0">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.auth.feature2}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 shrink-0">
                    <Trophy className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.auth.feature3}</h3>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 shrink-0">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t.auth.feature4}</h3>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border/40">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">10k+</div>
                    <div className="text-sm text-muted-foreground">Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">50k+</div>
                    <div className="text-sm text-muted-foreground">Goals</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">100k+</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
