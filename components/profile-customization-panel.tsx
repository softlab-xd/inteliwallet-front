"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Zap, Crown, Star, Flame, Smile, Ghost, Heart, Shield, Check, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useUser } from "@/lib/context/user-context" 

const AVAILABLE_ICONS = [
  { id: "default", icon: User, label: "Padrão" },
  { id: "zap", icon: Zap, label: "Rápido" },
  { id: "crown", icon: Crown, label: "Rei" },
  { id: "star", icon: Star, label: "Estrela" },
  { id: "flame", icon: Flame, label: "Fogo" },
  { id: "smile", icon: Smile, label: "Feliz" },
  { id: "ghost", icon: Ghost, label: "Fantasma" },
  { id: "heart", icon: Heart, label: "Amor" },
  { id: "shield", icon: Shield, label: "Guardião" },
]

const AVAILABLE_BANNERS = [
  { id: "purple", class: "bg-gradient-to-r from-purple-600 to-indigo-600", label: "Neon Roxo" },
  { id: "blue", class: "bg-gradient-to-r from-blue-500 to-cyan-500", label: "Oceano" },
  { id: "orange", class: "bg-gradient-to-r from-orange-500 to-red-500", label: "Pôr do Sol" },
  { id: "green", class: "bg-gradient-to-r from-emerald-500 to-green-600", label: "Natureza" },
  { id: "dark", class: "bg-neutral-900 border border-white/10", label: "Meia-noite" },
  { id: "pink", class: "bg-gradient-to-r from-pink-500 to-rose-500", label: "Doce" },
]

export function ProfileCustomizationPanel() {
  const { user, updateUser, refreshUser } = useUser()
  
  const [activeTab, setActiveTab] = useState("icons")
  const [selectedIcon, setSelectedIcon] = useState("default")
  const [selectedBanner, setSelectedBanner] = useState("purple")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const savedBanner = localStorage.getItem("user_banner_preference")
    if (savedBanner) setSelectedBanner(savedBanner)
    if (user?.avatar) {
      const foundIcon = AVAILABLE_ICONS.find(i => i.id === user.avatar)
      if (foundIcon) {
        setSelectedIcon(user.avatar)
      }
    }
  }, [user])

  const currentIconObj = AVAILABLE_ICONS.find(i => i.id === selectedIcon) || AVAILABLE_ICONS[0]
  const currentBannerObj = AVAILABLE_BANNERS.find(b => b.id === selectedBanner) || AVAILABLE_BANNERS[0]
  const CurrentIconComponent = currentIconObj.icon

  const handleSave = async () => {
    setIsSaving(true)
    try {
      localStorage.setItem("user_banner_preference", selectedBanner)

      await updateUser({ 
        avatar: selectedIcon 
      })
      
      await refreshUser()
      
    } catch (error) {
      console.error("Erro ao salvar:", error)
      alert("Erro ao salvar alterações. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      <Card className="border-border/40 bg-card/50 backdrop-blur overflow-hidden">
        <CardHeader>
          <CardTitle>Aparência do Perfil</CardTitle>
          <CardDescription>Como seu perfil aparece para os outros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-2xl">
            <div className={`h-32 w-full transition-colors duration-500 ${currentBannerObj.class}`} />
            <div className="px-6 pb-6 relative">
              <div className="flex justify-between items-end -mt-12">
                <div className="flex items-end gap-4">
                  <div className="h-24 w-24 rounded-full bg-background p-1.5 shadow-xl">
                    <div className="h-full w-full rounded-full bg-muted flex items-center justify-center border-2 border-border relative overflow-hidden">
                      <CurrentIconComponent className="h-10 w-10 text-foreground" />
                    </div>
                  </div>
                  <div className="mb-1 hidden sm:block">
                    <h3 className="text-xl font-bold">{user?.username || "Seu Nome"}</h3>
                    <p className="text-sm text-muted-foreground">
                       Nível {Math.floor((user?.totalPoints || 0) / 100) + 1} • Mestre das Finanças
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="relative grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
          {["icons", "banners"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 flex items-center justify-center py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer outline-none ring-0 focus:ring-0 ${
                activeTab === tab ? "text-white" : "text-muted-foreground hover:text-purple-600"
              }`}
            >
              <span className="relative z-20 capitalize">
                {tab === "icons" ? "Ícones" : "Banners"}
              </span>
              {activeTab === tab && (
                <motion.div
                  layoutId="profile-customization-tab"
                  className="absolute inset-0 bg-purple-600 rounded-lg shadow-md"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "icons" && (
            <motion.div
              key="icons"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/40 bg-card/30">
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {AVAILABLE_ICONS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedIcon(item.id)}
                        className={`group relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 cursor-pointer outline-none ring-0 focus:ring-0
                          ${selectedIcon === item.id 
                            ? "bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                            : "bg-background/50 border-border/50 hover:border-purple-500/50 hover:bg-purple-900/10"
                          }
                        `}
                      >
                        <item.icon className={`h-8 w-8 transition-transform duration-300 group-hover:scale-110 ${selectedIcon === item.id ? "text-purple-400" : "text-muted-foreground"}`} />
                        <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{item.label}</span>
                        {selectedIcon === item.id && (
                          <div className="absolute top-2 right-2 h-4 w-4 bg-purple-500 rounded-full flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "banners" && (
            <motion.div
              key="banners"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/40 bg-card/30">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {AVAILABLE_BANNERS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedBanner(item.id)}
                        className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer h-24 outline-none ring-0 focus:ring-0
                          ${selectedBanner === item.id 
                            ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-2 ring-purple-500/30" 
                            : "border-border/50 hover:border-purple-500/50"
                          }
                        `}
                      >
                        <div className={`absolute inset-0 ${item.class} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors">
                          <span className="font-bold text-white drop-shadow-md">{item.label}</span>
                        </div>
                        {selectedBanner === item.id && (
                          <div className="absolute top-2 right-2 h-5 w-5 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer relative h-12 px-8 rounded-full 
                     bg-purple-800 text-white border-none outline-none ring-0 focus:ring-0
                     shadow-[0_0_15px_rgba(168,85,247,0.5)] 
                     hover:bg-purple-700 hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] 
                     transition-all duration-300 group overflow-hidden"
        >
          <div className="relative z-10 flex items-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-bold">Salvar Alterações</span>
              </>
            )}
          </div>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Button>
      </div>
    </div>
  )
}