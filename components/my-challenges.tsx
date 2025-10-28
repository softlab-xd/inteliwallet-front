"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Users, Calendar, Trophy, Loader2, DollarSign, LogOut, Crown } from "lucide-react"
import { useLanguage } from "@/lib/i18n"
import { challengeService } from "@/lib/services/challenge.service"
import { useToast } from "@/hooks/use-toast"
import type { Challenge } from "@/lib/types/challenge"

export function MyChallenges() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showContributeDialog, setShowContributeDialog] = useState(false)
  const [contributionAmount, setContributionAmount] = useState("")
  const [contributionNote, setContributionNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      setIsLoading(true)
      const data = await challengeService.getMyChallenges()
      setChallenges(data)
    } catch (err: any) {
      console.error("Error loading my challenges:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to load your challenges",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChallenge) return

    try {
      setIsSubmitting(true)
      await challengeService.contributeToChallenge(selectedChallenge.id, {
        amount: parseFloat(contributionAmount),
        note: contributionNote || undefined,
      })

      toast({
        title: "Success!",
        description: "Your contribution has been recorded",
      })

      setShowContributeDialog(false)
      setContributionAmount("")
      setContributionNote("")
      setSelectedChallenge(null)
      await loadChallenges()
    } catch (err: any) {
      console.error("Error contributing to challenge:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to contribute",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLeaveChallenge = async (challengeId: string) => {
    try {
      await challengeService.leaveChallenge(challengeId)
      toast({
        title: "Success",
        description: "You left the challenge",
      })
      await loadChallenges()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to leave challenge",
        variant: "destructive",
      })
    }
  }

  const openContributeDialog = (challenge: Challenge) => {
    setSelectedChallenge(challenge)
    setShowContributeDialog(true)
  }

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500'
      case 'completed':
        return 'bg-blue-500/10 text-blue-500'
      case 'failed':
        return 'bg-red-500/10 text-red-500'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const isCreator = (challenge: Challenge) => {
    return challenge.topContributors.some(c => c.isCreator)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your challenges...</p>
        </div>
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No challenges yet</p>
          <p className="text-sm text-muted-foreground">Join a challenge to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Challenges</h2>
        <Badge variant="secondary">
          {challenges.length} {challenges.length === 1 ? 'Challenge' : 'Challenges'}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    {challenge.topContributors.find(c => c.isCreator) && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>{challenge.creator.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      by {challenge.creator.username}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(challenge.status)}>
                  {challenge.status}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {challenge.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {challenge.progressPercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={challenge.progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R$ {challenge.currentAmount.toFixed(2)}</span>
                  <span>R$ {challenge.targetAmount.toFixed(2)}</span>
                </div>
              </div>

              {challenge.topContributors.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Top Contributors</p>
                  <div className="flex -space-x-2">
                    {challenge.topContributors.slice(0, 3).map((contributor) => (
                      <Avatar key={contributor.id} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback>{contributor.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                    {challenge.topContributors.length > 3 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-background">
                        <span className="text-xs">+{challenge.topContributors.length - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {challenge.currentParticipants}/{challenge.maxParticipants}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    {formatDeadline(challenge.deadline)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {challenge.rewardPoints} points
                  </span>
                </div>
                <Badge variant="outline">{challenge.category}</Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => openContributeDialog(challenge)}
                  disabled={challenge.status !== 'active'}
                  className="flex-1"
                  size="sm"
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Contribute
                </Button>
                {!challenge.topContributors.find(c => c.isCreator) && (
                  <Button
                    onClick={() => handleLeaveChallenge(challenge.id)}
                    variant="outline"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showContributeDialog} onOpenChange={setShowContributeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribute to Challenge</DialogTitle>
            <DialogDescription>
              Add your contribution to {selectedChallenge?.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleContribute} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                placeholder="e.g., Saved on coffee today!"
                value={contributionNote}
                onChange={(e) => setContributionNote(e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowContributeDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Contribute'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
