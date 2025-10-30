"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Trophy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { challengeService } from "@/lib/services/challenge.service"
import type { CreateChallengeRequest } from "@/lib/types/challenge"
import { PlanLimitModal } from "@/components/plan-limit-modal"
import type { PlanType } from "@/lib/types/subscription"
import { useUser } from "@/lib/context/user-context"

interface CreateChallengeFormProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  onSuccess?: () => void
}

const categories = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Entretenimento",
  "Saúde",
  "Educação",
  "Investimentos",
  "Outros",
]

export function CreateChallengeForm({ open, onOpenChange, onSuccess }: CreateChallengeFormProps) {
  const { toast } = useToast()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [createdChallengesCount, setCreatedChallengesCount] = useState(0)
  const [formData, setFormData] = useState<Partial<CreateChallengeRequest>>({
    title: "",
    description: "",
    targetAmount: 0,
    category: "",
    deadline: "",
    maxParticipants: 5,
    rewardPoints: 100,
  })

  const handleChange = (field: keyof CreateChallengeRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.category || !formData.deadline) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (formData.targetAmount! <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Target amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    if (formData.maxParticipants! < 2) {
      toast({
        title: "Invalid Participants",
        description: "Must allow at least 2 participants",
        variant: "destructive",
      })
      return
    }

    const deadlineDate = new Date(formData.deadline)
    const today = new Date()
    if (deadlineDate <= today) {
      toast({
        title: "Invalid Deadline",
        description: "Deadline must be in the future",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      await challengeService.createChallenge(formData as CreateChallengeRequest)

      toast({
        title: "Success!",
        description: "Challenge created successfully",
      })

      setFormData({
        title: "",
        description: "",
        targetAmount: 0,
        category: "",
        deadline: "",
        maxParticipants: 5,
        rewardPoints: 100,
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      console.error("Error creating challenge:", err)

      if (err.message?.includes("limite de desafios") || err.message?.includes("limit")) {
        const response = await challengeService.getMyChallenges()
        const createdCount = response.filter((c: any) => c.creator.id === user?.id).length
        setCreatedChallengesCount(createdCount)
        setShowLimitModal(true)
      } else {
        toast({
          title: "Error",
          description: err.message || "Failed to create challenge",
          variant: "destructive",
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <DialogTitle>Create New Challenge</DialogTitle>
          </div>
          <DialogDescription>
            Create a savings challenge and invite others to join you
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Challenge Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Coffee Savings Challenge"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your challenge..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.description?.length || 0}/500 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">
                Target Amount (R$) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.targetAmount || ""}
                onChange={(e) => handleChange('targetAmount', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">
              Deadline <span className="text-destructive">*</span>
            </Label>
            <Input
              id="deadline"
              type="date"
              min={getMinDate()}
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">
                Max Participants <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                min="2"
                max="20"
                value={formData.maxParticipants || ""}
                onChange={(e) => handleChange('maxParticipants', parseInt(e.target.value) || 2)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Between 2 and 20 participants
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rewardPoints">
                Reward Points <span className="text-destructive">*</span>
              </Label>
              <Input
                id="rewardPoints"
                type="number"
                min="1"
                max="1000"
                value={formData.rewardPoints || ""}
                onChange={(e) => handleChange('rewardPoints', parseInt(e.target.value) || 1)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Points awarded upon completion
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Challenge'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <PlanLimitModal
      open={showLimitModal}
      onOpenChange={setShowLimitModal}
      currentPlan={(user?.plan || 'free') as PlanType}
      limitType="challenges"
      currentCount={createdChallengesCount}
    />
  </>
  )
}
