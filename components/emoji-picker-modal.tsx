"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Smile, Activity, Heart, Briefcase, Trophy, Star } from "lucide-react"

interface EmojiPickerModalProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  currentEmoji?: string
  onEmojiSelect: (_emoji: string) => void
}

const emojiCategories = {
  smileys: {
    label: "Smileys",
    icon: Smile,
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
      "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙",
      "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
      "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥",
      "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮",
    ],
  },
  activities: {
    label: "Activities",
    icon: Activity,
    emojis: [
      "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
      "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🏹", "🎣",
      "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿",
      "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "🤺", "⛹️", "🤾", "🏌️",
      "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴", "🏎️",
    ],
  },
  nature: {
    label: "Nature",
    icon: Heart,
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
      "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆",
      "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋",
      "🐌", "🐞", "🐜", "🦟", "🦗", "🕷️", "🦂", "🐢", "🐍", "🦎",
      "🦖", "🦕", "🐙", "🦑", "🦐", "🦀", "🐡", "🐠", "🐟", "🐬",
    ],
  },
  objects: {
    label: "Objects",
    icon: Briefcase,
    emojis: [
      "⌚", "📱", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️",
      "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️",
      "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭",
      "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💡",
      "🔦", "🕯️", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "💰",
    ],
  },
  symbols: {
    label: "Symbols",
    icon: Star,
    emojis: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️",
      "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐",
      "⭐", "🌟", "✨", "⚡", "💫", "🔥", "💥", "☄️", "🌈", "☀️",
      "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️",
    ],
  },
  achievement: {
    label: "Achievement",
    icon: Trophy,
    emojis: [
      "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🎗️", "🎫", "🎟️", "🎪",
      "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺",
      "🎸", "🎻", "🎲", "♟️", "🎯", "🎳", "🎮", "🎰", "🧩", "🚀",
      "🛸", "🛰️", "💺", "🚁", "🛶", "⛵", "🛥️", "🚤", "⛴️", "🛳️",
      "🚢", "✈️", "🛩️", "🛫", "🛬", "🪂", "💎", "🔮", "🧿", "📿",
    ],
  },
}

export function EmojiPickerModal({
  open,
  onOpenChange,
  currentEmoji,
  onEmojiSelect,
}: EmojiPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState(currentEmoji || "😀")

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji)
  }

  const handleSave = () => {
    onEmojiSelect(selectedEmoji)
    onOpenChange(false)
  }

  const getFilteredEmojis = (emojis: string[]) => {
    if (!searchTerm) return emojis
    return emojis.filter((emoji) =>
      emoji.includes(searchTerm)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            Choose Your Avatar
          </DialogTitle>
          <DialogDescription>
            Select an emoji to represent your profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Selection</p>
            <div className="text-6xl">{selectedEmoji}</div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emojis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs defaultValue="smileys" className="w-full">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
              {Object.entries(emojiCategories).map(([key, category]) => {
                const Icon = category.icon
                return (
                  <TabsTrigger key={key} value={key} className="gap-1">
                    <Icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{category.label}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {Object.entries(emojiCategories).map(([key, category]) => (
              <TabsContent key={key} value={key}>
                <ScrollArea className="h-[240px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-8 gap-2">
                    {getFilteredEmojis(category.emojis).map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className={`text-2xl p-2 rounded-md hover:bg-muted transition-colors ${
                          selectedEmoji === emoji ? "bg-primary/20 ring-2 ring-primary" : ""
                        }`}
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  {getFilteredEmojis(category.emojis).length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-8">
                      No emojis found
                    </p>
                  )}
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Avatar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
