"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/i18n"
import { transactionService, type Transaction } from "@/lib/services/transaction.service"
import {
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Film,
  Heart,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpRight,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react"

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, typeof ShoppingBag> = {
    "Income": ArrowUpRight,
    "Food & Dining": Coffee,
    "Transportation": Car,
    "Bills & Utilities": Home,
    "Entertainment": Film,
    "Health & Fitness": Heart,
    "Shopping": ShoppingBag,
  }
  return iconMap[category] || ShoppingBag
}

interface TransactionsListProps {
  onTransactionChange?: () => void
}

export function TransactionsList({ onTransactionChange }: TransactionsListProps) {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      const data = await transactionService.list()
      setTransactions(data)
    } catch (err: any) {
      console.error("Error loading transactions:", err)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setEditForm({
      title: transaction.title,
      amount: transaction.amount.toString(),
      category: transaction.category,
      type: transaction.type,
    })
    setShowEditDialog(true)
  }

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowDeleteDialog(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTransaction) return

    try {
      await transactionService.update(selectedTransaction.id, {
        title: editForm.title,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
        type: editForm.type,
      })
      await loadTransactions()
      setShowEditDialog(false)
      setSelectedTransaction(null)

      if (onTransactionChange) {
        onTransactionChange()
      }
    } catch (error) {
      console.error("Error updating transaction:", error)
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return

    try {
      await transactionService.delete(selectedTransaction.id)
      await loadTransactions()
      setShowDeleteDialog(false)
      setSelectedTransaction(null)

      if (onTransactionChange) {
        onTransactionChange()
      }
    } catch (error) {
      console.error("Error deleting transaction:", error)
    }
  }

  const categories = Array.from(new Set(transactions.map((t) => t.category)))

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const groupedTransactions = filteredTransactions.reduce(
    (groups, transaction) => {
      const date = new Date(transaction.date)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let label: string
      if (date.toDateString() === today.toDateString()) {
        label = t.transactions.today
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = t.transactions.yesterday
      } else {
        label = date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      }

      if (!groups[label]) {
        groups[label] = []
      }
      groups[label].push(transaction)
      return groups
    },
    {} as Record<string, Transaction[]>,
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.transactions.totalTransactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{t.dashboard.thisMonth}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.transactions.totalIncome}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              $
              {transactions
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === "income").length} {t.navigation.transactions.toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.transactions.totalExpenses}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              $
              {transactions
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {transactions.filter((t) => t.type === "expense").length} {t.navigation.transactions.toLowerCase()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-foreground">{t.transactions.allTransactions}</CardTitle>
          <CardDescription className="text-muted-foreground">{t.transactions.viewAndFilter}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.transactions.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-full sm:w-[140px] bg-background/50">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.navigation.transactions} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.transactions.allTypes}</SelectItem>
                  <SelectItem value="income">{t.transactions.income}</SelectItem>
                  <SelectItem value="expense">{t.transactions.expense}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50">
                  <SelectValue placeholder={t.transactions.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.transactions.allCategories}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">{date}</h3>
                <div className="space-y-2">
                  {dayTransactions.map((transaction) => {
                    const Icon = getCategoryIcon(transaction.category)
                    return (
                      <div
                        key={transaction.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/40 bg-background/30 p-4 transition-colors hover:bg-background/50"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div
                            className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0 ${
                              transaction.type === "income" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                            }`}
                          >
                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{transaction.title}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {transaction.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(transaction.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          <span
                            className={`text-lg sm:text-xl font-bold ${
                              transaction.type === "income" ? "text-accent" : "text-foreground"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem onClick={() => handleEditClick(transaction)} className="cursor-pointer">
                                <Pencil className="h-4 w-4 mr-2" />
                                {t.common.edit}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(transaction)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t.common.delete}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted/50 p-4 mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{t.transactions.noTransactionsFound}</h3>
              <p className="text-sm text-muted-foreground">{t.transactions.tryAdjusting}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.common.edit} Transaction</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update transaction details below
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type" className="text-foreground">
                Type
              </Label>
              <Select value={editForm.type} onValueChange={(value: "income" | "expense") => setEditForm({ ...editForm, type: value })}>
                <SelectTrigger id="edit-type" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">{t.transactions.income}</SelectItem>
                  <SelectItem value="expense">{t.transactions.expense}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-title" className="text-foreground">
                {t.transactions.description}
              </Label>
              <Input
                id="edit-title"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount" className="text-foreground">
                {t.transactions.amount}
              </Label>
              <Input
                id="edit-amount"
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="bg-background/50"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category" className="text-foreground">
                {t.transactions.category}
              </Label>
              <Select value={editForm.category} onValueChange={(value) => setEditForm({ ...editForm, category: value })}>
                <SelectTrigger id="edit-category" className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)} className="bg-transparent">
                {t.common.cancel}
              </Button>
              <Button type="submit">{t.common.save}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
          <DialogHeader>
            <DialogTitle className="text-foreground">{t.common.delete} Transaction</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="py-4">
              <div className="rounded-lg border border-border/40 bg-background/30 p-4">
                <p className="font-medium text-foreground">{selectedTransaction.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedTransaction.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ${selectedTransaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="bg-transparent">
              {t.common.cancel}
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              {t.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
