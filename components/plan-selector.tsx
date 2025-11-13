"use client";
import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles, Zap, Crown } from "lucide-react";
import { subscriptionService } from "@/lib/services/subscription.service";
import { useToast } from "@/hooks/use-toast";
import { PLAN_LIMITS, type PlanType } from "@/lib/types/subscription";
import { useLanguage } from "@/lib/i18n";

interface PlanOption {
  key: "free" | "standard" | "plus";
  name: string;
  displayName: "STANDARD" | "PLUS";
  price: number;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
}

export function PlanSelector({
  currentPlan = "free",
  onPlanSelected,
}: {
  currentPlan?: PlanType;
  onPlanSelected?: (_paymentData: any) => void;
}) {
  const { t } = useLanguage();
  const tt = t as any;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const plans: PlanOption[] = [
    {
      key: "free",
      name: tt.plans?.freeName || "Free",
      displayName: "STANDARD",
      price: 0,
      icon: <Sparkles className="h-6 w-6" />,
      features: [
        "3 active goals",
        "Cannot create challenges",
        "Join unlimited challenges",
        "Basic streaks tracking",
        "Community support",
      ],
    },
    {
      key: "standard",
      name: tt.plans?.standardName || "Standard",
      displayName: "STANDARD",
      price: 5.0,
      icon: <Zap className="h-6 w-6" />,
      features: [
        "6 active goals",
        "Create up to 3 challenges",
        "Join unlimited challenges",
        "Full streaks system",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      key: "plus",
      name: tt.plans?.plusName || "Plus",
      displayName: "PLUS",
      price: 20.0,
      icon: <Crown className="h-6 w-6" />,
      features: [
        "10 active goals",
        "Create up to 6 challenges",
        "Join unlimited challenges",
        "Full streaks system",
        "Priority support",
        "Early access to features",
      ],
    },
  ];

  const handleUpgrade = async (planKey: "free" | "standard" | "plus") => {
    if (planKey === "free") {
      toast({
        title: tt.plans?.alreadyFreeTitle || "Already on Free Plan",
        description:
          tt.plans?.alreadyFreeDesc || "No payment needed for the free plan",
      });
      return;
    }

    if (planKey === currentPlan) {
      toast({
        title: tt.plans?.alreadyOnPlanTitle || "Already on this Plan",
        description:
          tt.plans?.alreadyOnPlanDesc || "You already have this plan",
      });
      return;
    }

    try {
      setIsLoading(true);

      const planName = planKey === "standard" ? "STANDARD" : "PLUS";

      const baseUrl = window.location.origin;
      const returnUrl = `${baseUrl}/payment/success?paymentId={paymentId}`;
      const completionUrl = `${baseUrl}/payment/complete?paymentId={paymentId}`;

      const paymentData = await subscriptionService.createSubscription({
        plan: planName,
        paymentMethod: "PIX",
        returnUrl,
        completionUrl,
      });

      if (paymentData.paymentUrl) {
        toast({
          title: tt.plans?.redirectingTitle || "Redirecting...",
          description:
            tt.plans?.redirectingDesc || "Taking you to the payment page",
        });

        setTimeout(() => {
          window.location.href = paymentData.paymentUrl;
        }, 1000);
      } else {
        toast({
          title: tt.plans?.successTitle || "Success!",
          description:
            tt.plans?.successDesc ||
            "Payment created. Complete the payment to activate your plan.",
        });

        if (onPlanSelected) {
          onPlanSelected(paymentData);
        }
      }
    } catch (err: any) {
      console.error("Error creating subscription:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create subscription",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const getPlanButtonText = (planKey: PlanType) => {
    if (planKey === currentPlan) return tt.plans?.currentPlan || "Current Plan";

    if (planKey === "free") return tt.plans?.freeForever || "Free Forever";

    return tt.plans?.upgradeNow || "Upgrade Now";
  };

  const isPlanActive = (planKey: PlanType) => {
    return planKey === currentPlan;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">
          {tt.plans?.chooseTitle || "Choose Your Plan"}
        </h2>
        <p className="text-muted-foreground">
          {tt.plans?.chooseSubtitle ||
            "Unlock more features and reach your financial goals faster"}
        </p>
      </div>

      {/* cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.key}
            className={`relative ${
              plan.highlighted ? "border-primary shadow-lg scale-105" : ""
            } ${isPlanActive(plan.key) ? "border-green-500" : ""}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary px-4 py-1">
                  {tt.plans?.mostPopular || "Most Popular"}
                </Badge>
              </div>
            )}

            {isPlanActive(plan.key) && (
              <div className="absolute -top-4 right-4">
                <Badge className="bg-green-500 px-4 py-1">
                  {tt.plans?.active || "Active"}
                </Badge>
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
                    <span className="text-muted-foreground">
                      {tt.plans?.perMonth || "/month"}
                    </span>
                  )}
                </div>

                {plan.price === 0 && (
                  <p className="text-sm text-muted-foreground">
                    {tt.plans?.foreverFree || "Forever free"}
                  </p>
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
                disabled={true}
                className="w-full"
                variant={plan.highlighted ? "default" : "outline"}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tt.plans?.processing || "Processing..."}
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
          <CardTitle>
            {tt.plans?.comparisonTitle || "Plan Limits Comparison"}
          </CardTitle>
          <CardDescription>
            {tt.plans?.comparisonDescription ||
              "See what you can do with each plan"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    {tt.plans?.table?.feature || "Feature"}
                  </th>
                  <th className="text-center py-3 px-4">
                    {tt.plans?.freeName || "Free"}
                  </th>
                  <th className="text-center py-3 px-4">
                    {tt.plans?.standardName || "Standard"}
                  </th>
                  <th className="text-center py-3 px-4">
                    {tt.plans?.plusName || "Plus"}
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">
                    {tt.plans?.table?.activeGoals || "Active Goals"}
                  </td>
                  <td className="text-center py-3 px-4">
                    {PLAN_LIMITS.free.activeGoals}
                  </td>
                  <td className="text-center py-3 px-4">
                    {PLAN_LIMITS.standard.activeGoals}
                  </td>
                  <td className="text-center py-3 px-4">
                    {PLAN_LIMITS.plus.activeGoals}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="py-3 px-4">
                    {tt.plans?.table?.createChallenges || "Create Challenges"}
                  </td>
                  <td className="text-center py-3 px-4">
                    {PLAN_LIMITS.free.createdChallenges}
                  </td>
                  <td className="text-center py-3 px-4">
                    {PLAN_LIMITS.standard.createdChallenges}
                  </td>
                  <td className="text-center py-3 px-4">
                    {PLAN_LIMITS.plus.createdChallenges}
                  </td>
                </tr>

                <tr className="border-b">
                  <td className="py-3 px-4">
                    {tt.plans?.table?.joinChallenges || "Join Challenges"}
                  </td>
                  <td className="text-center py-3 px-4">
                    {tt.plans?.table?.unlimited || "Unlimited"}
                  </td>
                  <td className="text-center py-3 px-4">
                    {tt.plans?.table?.unlimited || "Unlimited"}
                  </td>
                  <td className="text-center py-3 px-4">
                    {tt.plans?.table?.unlimited || "Unlimited"}
                  </td>
                </tr>

                <tr>
                  <td className="py-3 px-4">
                    {tt.plans?.table?.price || "Price"}
                  </td>
                  <td className="text-center py-3 px-4 font-bold">
                    {tt.plans?.table?.free || "Free"}
                  </td>
                  <td className="text-center py-3 px-4 font-bold">
                    R$ {PLAN_LIMITS.standard.price}/mo
                  </td>
                  <td className="text-center py-3 px-4 font-bold">
                    R$ {PLAN_LIMITS.plus.price}/mo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
