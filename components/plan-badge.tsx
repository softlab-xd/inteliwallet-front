"use client"

import { Badge } from "@/components/ui/badge"
import { Crown, Zap } from "lucide-react"

interface PlanBadgeProps {
  plan: 'free' | 'standard' | 'plus'
  className?: string
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  const getPlanConfig = () => {
    switch (plan) {
      case 'plus':
        return {
          label: 'PLUS',
          className: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 hover:from-amber-600 hover:to-yellow-600',
          icon: <Crown className="h-3 w-3 mr-1" />
        }
      case 'standard':
        return {
          label: 'STANDARD',
          className: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 hover:from-blue-600 hover:to-indigo-600',
          icon: <Zap className="h-3 w-3 mr-1" />
        }
      case 'free':
      default:
        return {
          label: 'FREE',
          className: 'bg-gray-500 text-white border-0 hover:bg-gray-600',
          icon: null
        }
    }
  }

  const config = getPlanConfig()

  return (
    <Badge className={`${config.className} ${className} font-semibold text-[10px] sm:text-xs flex items-center`}>
      {config.icon}
      {config.label}
    </Badge>
  )
}
