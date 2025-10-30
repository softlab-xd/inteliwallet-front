"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Sparkles, Zap, Crown } from "lucide-react"
import { subscriptionService } from "@/lib/services/subscription.service"
import { useToast } from "@/hooks/use-toast"
import { PLAN_LIMITS, type PlanType } from "@/lib/types/subscription"

interface PlanOption {
  key: 'free' | 'standard' | 'plus'
  name: string
  displayName: 'STANDARD' | 'PLUS'
  price: number
  icon: React.ReactNode
  features: string[]
  highlighted?: boolean
}

const plans: PlanOption[] = [
  {
    key: 'free',
    name: 'Free',
    displayName: 'STANDARD', 
    price: 0,
    icon: <Sparkles className="h-6 w-6" />,
    features: [
      '3 active goals',
      'Cannot create challenges',
      'Join unlimited challenges',
      'Basic streaks tracking',
      'Community support',
    ],
  },
  {
    key: 'standard',
    name: 'Standard',
    displayName: 'STANDARD',
    price: 5.00,
    icon: <Zap className="h-6 w-6" />,
    features: [
      '6 active goals',
      'Create up to 3 challenges',
      'Join unlimited challenges',
      'Full streaks system',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    key: 'plus',
    name: 'Plus',
    displayName: 'PLUS',
    price: 20.00,
    icon: <Crown className="h-6 w-6" />,
    features: [
      '10 active goals',
      'Create up to 6 challenges',
      'Join unlimited challenges',
      'Full streaks system',
      'Priority support',
      'Early access to features',
    ],
  },
]

interface PlanSelectorProps {
  currentPlan?: PlanType
  onPlanSelected?: (_paymentData: any) => void
}

export function PlanSelector({ currentPlan = 'free', onPlanSelected }: PlanSelectorProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async (planKey: 'free' | 'standard' | 'plus') => {
    if (planKey === 'free') {
      toast({
        title: "Already on Free Plan",
        description: "No payment needed for the free plan",
      })
      return
    }

    if (planKey === currentPlan) {
      toast({
        title: "Already on this Plan",
        description: "You already have this plan",
      })
      return
    }

    try {
      setIsLoading(true)
      const planName = planKey === 'standard' ? 'STANDARD' : 'PLUS'

      const baseUrl = window.location.origin
      const returnUrl = `${baseUrl}/payment/success?paymentId={paymentId}`
      const completionUrl = `${baseUrl}/payment/complete?paymentId={paymentId}`

      const paymentData = await subscriptionService.createSubscription({
        plan: planName,
        paymentMethod: 'PIX',
        returnUrl,
        completionUrl,
      })

      if (paymentData.paymentUrl) {
        toast({
          title: "Redirecting...",
          description: "Taking you to the payment page",
        })

        setTimeout(() => {
          window.location.href = paymentData.paymentUrl
        }, 1000)
      } else {
        toast({
          title: "Success!",
          description: "Payment created. Complete the payment to activate your plan.",
        })

        if (onPlanSelected) {
          onPlanSelected(paymentData)
        }
      }
    } catch (err: any) {
      console.error("Error creating subscription:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to create subscription",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const getPlanButtonText = (planKey: PlanType) => {
    if (planKey === currentPlan) return 'Current Plan'
    if (planKey === 'free') return 'Free Forever'
    return 'Upgrade Now'
  }

  const isPlanActive = (planKey: PlanType) => {
    return planKey === currentPlan
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Unlock more features and reach your financial goals faster
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.key}
            className={`relative ${
              plan.highlighted
                ? 'border-primary shadow-lg scale-105'
                : ''
            } ${isPlanActive(plan.key) ? 'border-green-500' : ''}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary px-4 py-1">Most Popular</Badge>
              </div>
            )}

            {isPlanActive(plan.key) && (
              <div className="absolute -top-4 right-4">
                <Badge className="bg-green-500 px-4 py-1">Active</Badge>
              </div>
            )}

            <CardHeader className="text-center space-y-4">
              <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit">
                {plan.icon}
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">
                    R$ {plan.price.toFixed(0)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                {plan.price === 0 && (
                  <p className="text-sm text-muted-foreground">Forever free</p>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => handleUpgrade(plan.key)}
                disabled={isLoading || isPlanActive(plan.key)}
                className="w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  getPlanButtonText(plan.key)
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Limits Comparison</CardTitle>
          <CardDescription>See what you can do with each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Feature</th>
                  <th className="text-center py-3 px-4">Free</th>
                  <th className="text-center py-3 px-4">Standard</th>
                  <th className="text-center py-3 px-4">Plus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">Active Goals</td>
                  <td className="text-center py-3 px-4">{PLAN_LIMITS.free.activeGoals}</td>
                  <td className="text-center py-3 px-4">{PLAN_LIMITS.standard.activeGoals}</td>
                  <td className="text-center py-3 px-4">{PLAN_LIMITS.plus.activeGoals}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Create Challenges</td>
                  <td className="text-center py-3 px-4">{PLAN_LIMITS.free.createdChallenges}</td>
                  <td className="text-center py-3 px-4">{PLAN_LIMITS.standard.createdChallenges}</td>
                  <td className="text-center py-3 px-4">{PLAN_LIMITS.plus.createdChallenges}</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">Join Challenges</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                  <td className="text-center py-3 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Price</td>
                  <td className="text-center py-3 px-4 font-bold">Free</td>
                  <td className="text-center py-3 px-4 font-bold">R$ {PLAN_LIMITS.standard.price}/mo</td>
                  <td className="text-center py-3 px-4 font-bold">R$ {PLAN_LIMITS.plus.price}/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
