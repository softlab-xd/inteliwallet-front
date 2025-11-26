"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/lib/i18n"
import { useUser } from "@/lib/context/user-context"
import { userService } from "@/lib/services"
import { User, Trash2, UserPlus, X, Check, Crown, Lock, RefreshCw, Smile } from "lucide-react"

export function UserProfile() {
  const { t } = useLanguage()
  const { user, friends, friendInvites, updateUser, deleteAccount, addFriend, removeFriend, acceptInvite, declineInvite, refreshUser } = useUser()

  const [username, setUsername] = useState(user?.username || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatar, setAvatar] = useState(user?.avatar || "😀")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [friendUsername, setFriendUsername] = useState("")
  const [addFriendError, setAddFriendError] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      setUsername(user.username || "")
      setEmail(user.email || "")
      setAvatar(user.avatar || "😀")
    }
  }, [user])

  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordLoading, setPasswordLoading] = useState(false)

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser({ username, email, avatar })
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    setShowDeleteDialog(false)
  }

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddFriendError("")

    if (friendUsername.trim()) {
      try {
        await addFriend(friendUsername)
        setFriendUsername("")
        setAddFriendError("")
        alert(`Friend request sent to ${friendUsername}! They will see it in their pending invites.`)
      } catch (error: any) {
        let errorMessage = error.response?.data?.message || error.message || "Error adding friend"
        if (errorMessage.includes("convite pendente") || errorMessage.includes("pending")) {
          errorMessage = `${errorMessage}\n\n💡 Tip: If you sent the invite, the other user needs to accept it.`
        }
        setAddFriendError(errorMessage)
      }
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refreshUser()
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("A nova senha deve ter no mínimo 6 caracteres")
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("As senhas não coincidem")
      return
    }
    try {
      setPasswordLoading(true)
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordDialog(false)
      alert("Senha alterada com sucesso!")
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || error.message || "Erro ao alterar senha")
    } finally {
      setPasswordLoading(false)
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
                <Label htmlFor="username" className="text-foreground">{t.profile.username}</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-background/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">{t.profile.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background/50" required />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary">{t.gamification.level} {user?.level}</Badge>
                  <Badge variant="secondary" className="bg-accent/20 text-accent">{user?.totalPoints} {t.profile.points}</Badge>
                </div>
              </div>
              <Button type="submit" className="w-full cursor-pointer">{t.profile.updateProfile}</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2"><Lock className="h-5 w-5" />{t.profile.accountSettings}</CardTitle>
            <CardDescription className="text-muted-foreground">{t.profile.accountSettingsDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-3 rounded-lg bg-muted/30 border border-border/40">
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">Account ID</Label><p className="text-sm font-mono text-foreground break-all">{user?.id || 'Loading...'}</p></div>
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">Username</Label><p className="text-sm font-medium text-foreground">@{user?.username || 'Loading...'}</p></div>
            </div>
            <div className="space-y-2 pt-2">
              <Label className="text-foreground">{t.profile.password}</Label>
              <p className="text-sm text-muted-foreground">••••••••</p>
              <Button variant="outline" className="w-full bg-transparent cursor-pointer" onClick={() => setShowPasswordDialog(true)}>{t.profile.changePassword}</Button>
            </div>
            <div className="pt-4 border-t border-border/40">
              <Button variant="destructive" className="w-full cursor-pointer" onClick={() => setShowDeleteDialog(true)}><Trash2 className="h-4 w-4 mr-2" />{t.profile.deleteAccount}</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AMIGOS */}
      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><CardTitle className="text-foreground flex items-center gap-2"><UserPlus className="h-5 w-5" />{t.profile.friends}</CardTitle><CardDescription className="text-muted-foreground">{t.profile.friendsDescription}</CardDescription></div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="gap-2 cursor-pointer"><RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh</Button>
              <Badge variant="secondary">{friends.length} {t.profile.friends}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddFriend} className="space-y-2">
            <div className="flex gap-2">
              <Input placeholder={t.profile.searchFriends} value={friendUsername} onChange={(e) => { setFriendUsername(e.target.value); setAddFriendError("") }} className="flex-1 bg-background/50" />
              <Button type="submit" className="cursor-pointer"><UserPlus className="h-4 w-4 mr-2" />{t.profile.addFriend}</Button>
            </div>
            {addFriendError && <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive text-sm">{addFriendError}</div>}
          </form>
          <div className="space-y-2">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">{t.profile.pendingInvites}</h3><Badge variant="secondary" className="text-xs">{friendInvites.length} pending</Badge></div>
            {friendInvites.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground border border-border/40 rounded-lg bg-background/30"><p>No pending friend invites</p></div>
            ) : (
              <div className="space-y-2">
                {friendInvites.map((invite) => (
                  <div key={invite.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/30">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">👤</div>
                      <div><p className="font-medium text-foreground">{invite.fromUser?.username}</p><p className="text-xs text-muted-foreground">Wants to be your friend</p></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default" onClick={() => acceptInvite(invite.id)} className="cursor-pointer"><Check className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => declineInvite(invite.id)} className="cursor-pointer"><X className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">{t.profile.friendsList}</h3>
            {sortedFriends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground"><p>{t.profile.noFriends}</p></div>
            ) : (
              <div className="space-y-2">
                {sortedFriends.map((friend, index) => (
                  <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/30">
                    <div className="flex items-center gap-3">
                      <div className="font-bold">{index + 1}</div>
                      <div className="text-2xl">👤</div>
                      <div><p className="font-medium text-foreground">{friend.username}</p><p className="text-xs text-muted-foreground">{friend.totalPoints} points</p></div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => removeFriend(friend.id)} className="cursor-pointer"><X className="h-4 w-4" /></Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
          <DialogHeader><DialogTitle className="text-foreground">{t.profile.changePassword}</DialogTitle></DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2"><Label>{t.profile.currentPassword}</Label><Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required disabled={passwordLoading} /></div>
            <div className="space-y-2"><Label>{t.profile.newPassword}</Label><Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required minLength={6} disabled={passwordLoading} /></div>
            <div className="space-y-2"><Label>{t.profile.confirmPassword}</Label><Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required minLength={6} disabled={passwordLoading} /></div>
            {passwordError && <div className="text-destructive text-sm">{passwordError}</div>}
            <DialogFooter><Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>{t.common.cancel}</Button><Button type="submit" disabled={passwordLoading}>{passwordLoading ? "Salvando..." : t.common.save}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
          <DialogHeader><DialogTitle className="text-foreground">{t.profile.deleteAccountConfirm}</DialogTitle><DialogDescription className="text-muted-foreground">{t.profile.deleteAccountWarning}</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setShowDeleteDialog(false)}>{t.common.cancel}</Button><Button variant="destructive" onClick={handleDeleteAccount}>{t.common.confirm}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}