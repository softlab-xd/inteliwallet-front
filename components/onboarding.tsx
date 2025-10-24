"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"
import {
  Wallet,
  TrendingUp,
  Target,
  Trophy,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react"

interface OnboardingProps {
  open: boolean
  onComplete: () => void
}

interface Step {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

export function Onboarding({ open, onComplete }: OnboardingProps) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)

  const steps: Step[] = [
    {
      icon: <Wallet className="h-16 w-16" />,
      title: t.onboarding?.step1Title || "Bem-vindo ao InteliWallet!",
      description: t.onboarding?.step1Description || "Sua carteira financeira gamificada. Transforme o controle de finanças em algo divertido e envolvente.",
      color: "text-primary",
    },
    {
      icon: <Plus className="h-16 w-16" />,
      title: t.onboarding?.step2Title || "Adicione Transações",
      description: t.onboarding?.step2Description || "Clique no botão + para registrar suas receitas e despesas. Categorize e acompanhe para onde seu dinheiro está indo.",
      color: "text-accent",
    },
    {
      icon: <Target className="h-16 w-16" />,
      title: t.onboarding?.step3Title || "Defina Metas",
      description: t.onboarding?.step3Description || "Crie metas de economia e acompanhe seu progresso. Seja um fundo de emergência ou aquela viagem dos sonhos!",
      color: "text-primary",
    },
    {
      icon: <Trophy className="h-16 w-16" />,
      title: t.onboarding?.step4Title || "Ganhe Conquistas",
      description: t.onboarding?.step4Description || "Complete desafios, desbloqueie conquistas e suba de nível. Quanto mais você gerencia, mais recompensas ganha!",
      color: "text-accent",
    },
    {
      icon: <TrendingUp className="h-16 w-16" />,
      title: t.onboarding?.step5Title || "Você está pronto!",
      description: t.onboarding?.step5Description || "Comece agora a transformar suas finanças. Acompanhe gastos, alcance metas e divirta-se no processo!",
      color: "text-primary",
    },
  ]

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[600px] bg-card border-border/40"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="py-8">
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : index < currentStep
                    ? "w-2 bg-primary/50"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="text-center space-y-6 px-4 min-h-[300px] flex flex-col justify-center">
            <div className={`flex justify-center ${steps[currentStep].color}`}>
              {steps[currentStep].icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            {isLastStep ? "" : t.common?.skip || "Pular"}
          </Button>

          <div className="flex gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.common?.back || "Voltar"}
              </Button>
            )}
            <Button onClick={handleNext}>
              {isLastStep ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {t.common?.finish || "Começar"}
                </>
              ) : (
                <>
                  {t.common?.next || "Próximo"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
