"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/lib/i18n"
import { transactionService } from "@/lib/services"
import { Loader2 } from "lucide-react"

interface AddTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddTransactionDialog({ open, onOpenChange, onSuccess }: AddTransactionDialogProps) {
  const { t } = useLanguage()
  const [type, setType] = useState<"income" | "expense">("expense")
  const [amount, setAmount] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const expenseCategories = [
    t.transactions.categories.foodDining,
    t.transactions.categories.transportation,
    t.transactions.categories.shopping,
    t.transactions.categories.entertainment,
    t.transactions.categories.billsUtilities,
    t.transactions.categories.healthFitness,
    t.transactions.categories.other,
  ]

  const incomeCategories = [
    t.transactions.categories.salary,
    t.transactions.categories.freelance,
    t.transactions.categories.investment,
    t.transactions.categories.gift,
    t.transactions.categories.other,
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await transactionService.create({
        type,
        amount: parseFloat(amount),
        title,
        category,
        date: new Date().toISOString(),
      })

      setAmount("")
      setTitle("")
      setCategory("")
      onOpenChange(false)

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      console.error("Error creating transaction:", err)
      setError(err.message || "Failed to create transaction. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t.transactions.addTransaction}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t.transactions.addTransactionDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={type} onValueChange={(value: any) => setType(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense">{t.transactions.expense}</TabsTrigger>
              <TabsTrigger value="income">{t.transactions.income}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              {t.transactions.amount}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 bg-background/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">
              {t.transactions.description}
            </Label>
            <Input
              id="title"
              placeholder={t.transactions.descriptionPlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              {t.transactions.category}
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder={t.transactions.selectCategory} />
              </SelectTrigger>
              <SelectContent>
                {(type === "expense" ? expenseCategories : incomeCategories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/40 text-destructive text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                t.transactions.addTransaction
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
