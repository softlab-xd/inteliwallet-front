"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language, Translations } from "./types"
import { en } from "./translations/en"
import { pt } from "./translations/pt"

interface LanguageContextType {
  language: Language
  setLanguage: (_lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Translations> = {
  en,
  pt,
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt")) {
      setLanguageState(savedLanguage)
    } else {
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith("pt")) {
        setLanguageState("pt")
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  const value = {
    language,
    setLanguage,
    t: translations[language],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
