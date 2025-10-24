"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n"
import { useUser } from "@/lib/context/user-context"
import { User, Trash2, UserPlus, X, Check, Crown } from "lucide-react"

export function UserProfile() {
  const { t } = useLanguage()
  const { user, friends, friendInvites, updateUser, deleteAccount, addFriend, removeFriend, acceptInvite, declineInvite } = useUser()

  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [friendUsername, setFriendUsername] = useState("")

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser({ username, email })
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    setShowDeleteDialog(false)
  }

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault()
    if (friendUsername.trim()) {
      addFriend(friendUsername)
      setFriendUsername("")
    }
  }

  const sortedFriends = [...friends].sort((a, b) => b.totalPoints - a.totalPoints)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{t.profile.title}</h2>
        <p className="text-sm text-muted-foreground">{t.profile.subtitle}</p>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <User className="h-5 w-5" />
              {t.profile.personalInfo}
            </CardTitle>
            <CardDescription className="text-muted-foreground">{t.profile.personalInfoDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">
                  {t.profile.username}
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  {t.profile.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    {t.gamification.level} {user?.level}
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">
                    {user?.totalPoints} {t.profile.points}
                  </Badge>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {t.profile.updateProfile}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t.profile.accountSettings}
            </CardTitle>
            <CardDescription className="text-muted-foreground">{t.profile.accountSettingsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">{t.profile.password}</Label>
              <p className="text-sm text-muted-foreground">••••••••</p>
              <Button variant="outline" className="w-full bg-transparent">
                {t.profile.changePassword}
              </Button>
            </div>

            <div className="pt-4 border-t border-border/40">
              <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {t.profile.deleteAccount}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-foreground flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                {t.profile.friends}
              </CardTitle>
              <CardDescription className="text-muted-foreground">{t.profile.friendsDescription}</CardDescription>
            </div>
            <Badge variant="secondary" className="self-start">
              {friends.length} {t.profile.friends}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddFriend} className="flex gap-2">
            <Input
              placeholder={t.profile.searchFriends}
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              className="flex-1 bg-background/50"
            />
            <Button type="submit">
              <UserPlus className="h-4 w-4 mr-2" />
              {t.profile.addFriend}
            </Button>
          </form>

          {friendInvites.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">{t.profile.pendingInvites}</h3>
              <div className="space-y-2">
                {friendInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{invite.fromUser.avatar}</div>
                      <div>
                        <p className="font-medium text-foreground">{invite.fromUser.username}</p>
                        <p className="text-xs text-muted-foreground">{t.profile.friendUsername}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => acceptInvite(invite.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => declineInvite(invite.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">{t.profile.friendsList}</h3>
            {sortedFriends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t.profile.noFriends}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedFriends.map((friend, index) => (
                  <div
                    key={friend.id}
                    className={`flex items-center justify-between p-3 rounded-lg border border-border/40 ${
                      index === 0 ? "bg-primary/10 border-primary/40" : "bg-background/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          index === 0 ? "bg-accent text-accent-foreground" : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="text-2xl">{friend.avatar}</div>
                      <div>
                        <p className="font-medium text-foreground">{friend.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {friend.totalPoints} {t.profile.points}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {index === 0 && <Crown className="h-5 w-5 text-accent" />}
                      <Button size="sm" variant="ghost" onClick={() => removeFriend(friend.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.profile.deleteAccountConfirm}</DialogTitle>
            <DialogDescription className="text-muted-foreground">{t.profile.deleteAccountWarning}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-transparent">
              {t.common.cancel}
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              {t.common.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
