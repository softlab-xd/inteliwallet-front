"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, AlertCircle, Target, Trophy, ArrowRight, Check } from "lucide-react"
import type { PlanType } from "@/lib/types/subscription"
import { PLAN_LIMITS } from "@/lib/types/subscription"
import { getUpgradeSuggestion } from "@/lib/utils/plan-validation"
import { useRouter } from "next/navigation"

type LimitType = 'challenges' | 'goals'

interface PlanLimitModalProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  currentPlan: PlanType
  limitType: LimitType
  currentCount: number
}

export function PlanLimitModal({
  open,
  onOpenChange,
  currentPlan,
  limitType,
  currentCount,
}: PlanLimitModalProps) {
  const router = useRouter()
  const { suggestedPlan, benefits } = getUpgradeSuggestion(currentPlan)

  const isChallenge = limitType === 'challenges'
  const Icon = isChallenge ? Trophy : Target
  const limit = isChallenge
    ? PLAN_LIMITS[currentPlan].createdChallenges
    : PLAN_LIMITS[currentPlan].activeGoals

  if (!suggestedPlan) {
    return null
  }

  const planName = suggestedPlan === 'standard' ? 'Standard' : 'Plus'
  const planPrice = suggestedPlan === 'standard' ? 5 : 20

  const title = isChallenge ? 'Challenge Limit Reached' : 'Goal Limit Reached'
  const limitMessage = currentPlan === 'free' && isChallenge
    ? 'Free plan users cannot create challenges. Upgrade to Standard or Plus to start creating your own challenges!'
    : `You've reached your limit of ${limit} ${limitType}. Upgrade your plan to create more!`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>
            Unlock more features with {planName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">{limitMessage}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {currentCount} / {limit === 0 ? '∞' : limit}
                    </Badge>
                    <span className="capitalize">{currentPlan} Plan</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {planName} Plan
                    <Crown className="h-5 w-5 text-primary" />
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">R$ {planPrice}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>
                <Badge className="bg-primary">Recommended</Badge>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">What you'll get:</p>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false)
                router.push('/dashboard/settings')
              }}
              className="flex-1"
            >
              Upgrade Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
