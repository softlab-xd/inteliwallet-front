"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import {
  Wallet,
  TrendingUp,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProps {
  open: boolean;
  onComplete: () => void;
}

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  highlight?: string; // Selector or position hint for highlighting
}

export function Onboarding({ open, onComplete }: OnboardingProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      icon: <Wallet className="h-12 w-12" />,
      title: t.onboarding.step1Title,
      description: t.onboarding.step1Description,
      color: "text-blue-500",
      highlight: "header",
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: t.onboarding.step2Title,
      description: t.onboarding.step2Description,
      color: "text-emerald-500",
      highlight: "dashboard",
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: t.onboarding.step3Title,
      description: t.onboarding.step3Description,
      color: "text-purple-500",
      highlight: "goals",
    },
    {
      icon: <Trophy className="h-12 w-12" />,
      title: t.onboarding.step4Title,
      description: t.onboarding.step4Description,
      color: "text-amber-500",
      highlight: "achievements",
    },
    {
      icon: <Users className="h-12 w-12" />,
      title: t.onboarding.step5Title,
      description: t.onboarding.step5Description,
      color: "text-pink-500",
      highlight: "challenges",
    },
  ];

  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleClose = () => {
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onComplete()}>
      <DialogContent
        className="sm:max-w-[500px] bg-background/95 backdrop-blur-sm border-2 border-primary/20 shadow-2xl p-0 gap-0"
        showCloseButton
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="p-8 pb-6">
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 hover:opacity-80",
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-border"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <div className="text-center space-y-6 min-h-[280px] flex flex-col justify-center">
            <div className={cn("flex justify-center", steps[currentStep].color)}>
              {steps[currentStep].icon}
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-foreground">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 p-6 flex items-center justify-between bg-muted/30">
          <div className="text-sm text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </div>

          <div className="flex gap-2">
            {!isLastStep && (
              <Button
                variant="ghost"
                onClick={handleClose}
                className="text-muted-foreground"
              >
                {t.common.skip}
              </Button>
            )}
            <Button onClick={handleNext} size="default">
              {isLastStep ? t.common.finish : t.common.next}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
