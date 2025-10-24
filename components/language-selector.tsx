"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"
import { Languages } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "pt" : "en")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
      title={language === "en" ? "Switch to Portuguese" : "Mudar para Inglês"}
    >
      <Languages className="h-5 w-5" />
      <span className="absolute bottom-0 right-0 text-[10px] font-bold uppercase">
        {language}
      </span>
    </Button>
  )
}
