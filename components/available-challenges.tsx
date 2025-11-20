"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Calendar, Trophy, Loader2, Plus } from "lucide-react"
import { challengeService } from "@/lib/services/challenge.service"
import { useToast } from "@/hooks/use-toast"
import type { Challenge } from "@/lib/types/challenge"


export function AvailableChallenges() {
  const { toast } = useToast()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [joiningId, setJoiningId] = useState<string | null>(null)

  useEffect(() => {
    loadChallenges()
  }, [])

  const loadChallenges = async () => {
    try {
      setIsLoading(true)
      const data = await challengeService.getAvailableChallenges()
      setChallenges(data)
    } catch (err: any) {
      console.error("Error loading available challenges:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to load challenges",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      setJoiningId(challengeId)
      await challengeService.joinChallenge(challengeId)
      toast({
        title: "Success!",
        description: "You joined the challenge successfully",
      })
      await loadChallenges() 
    } catch (err: any) {
      console.error("Error joining challenge:", err)
      toast({
        title: "Error",
        description: err.message || "Failed to join challenge",
        variant: "destructive",
      })
    } finally {
      setJoiningId(null)
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading challenges...</p>
        </div>
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No challenges available</p>
          <p className="text-sm text-muted-foreground">Check back later for new challenges</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Available Challenges</h2>
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
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
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
              <Button
                onClick={() => handleJoinChallenge(challenge.id)}
                disabled={
                  joiningId === challenge.id ||
                  challenge.currentParticipants >= challenge.maxParticipants
                }
                className="w-full"
              >
                {joiningId === challenge.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : challenge.currentParticipants >= challenge.maxParticipants ? (
                  'Full'
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Join Challenge
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
