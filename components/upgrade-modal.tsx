"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, ArrowRight, Check } from "lucide-react"
import type { PlanType } from "@/lib/types/subscription"
import { getUpgradeSuggestion } from "@/lib/utils/plan-validation"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: PlanType
  reason?: string
  onUpgradeClick?: () => void
}

export function UpgradeModal({
  open,
  onOpenChange,
  currentPlan,
  reason,
  onUpgradeClick,
}: UpgradeModalProps) {
  const { suggestedPlan, benefits } = getUpgradeSuggestion(currentPlan)

  if (!suggestedPlan) {
    return null 
  }

  const planName = suggestedPlan === 'standard' ? 'Standard' : 'Plus'
  const planPrice = suggestedPlan === 'standard' ? 5 : 20

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <DialogTitle>Upgrade Your Plan</DialogTitle>
          </div>
          <DialogDescription>
            {reason || `Unlock more features with ${planName}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {reason && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <p className="text-sm text-center">{reason}</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{planName} Plan</h3>
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

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Current plan: <span className="font-medium capitalize">{currentPlan}</span>
            </p>
          </div>

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
                onUpgradeClick?.()
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
