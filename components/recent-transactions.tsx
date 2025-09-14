"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { format } from "date-fns"

type Transaction = {
  _id: string
  description: string
  amount: number
  date: string | Date
  category: string
}

type RecentTransactionsProps = {
  transactions?: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Use provided transactions or fallback to default data
  const transactionData =
    transactions && transactions.length > 0
      ? transactions
      : [
          {
            _id: "t1",
            description: "Grocery Store",
            amount: -120.5,
            date: new Date(),
            category: "food",
          },
          {
            _id: "t2",
            description: "Salary Deposit",
            amount: 3450.0,
            date: new Date(Date.now() - 86400000), // Yesterday
            category: "income",
          },
          {
            _id: "t3",
            description: "Electric Bill",
            amount: -85.2,
            date: new Date(Date.now() - 86400000 * 2), // 2 days ago
            category: "utilities",
          },
          {
            _id: "t4",
            description: "Restaurant",
            amount: -64.3,
            date: new Date(Date.now() - 86400000 * 3), // 3 days ago
            category: "food",
          },
          {
            _id: "t5",
            description: "Gas Station",
            amount: -45.0,
            date: new Date(Date.now() - 86400000 * 4), // 4 days ago
            category: "transport",
          },
        ]

  return (
    <div className="space-y-4">
      {transactionData.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No recent transactions</p>
      ) : (
        transactionData.map((transaction) => (
          <div key={transaction._id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{getCategoryIcon(transaction.category)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-xs text-muted-foreground">
                  {getRelativeDate(transaction.date)} · {getCategoryLabel(transaction.category)}
                </p>
              </div>
            </div>
            <div className={`text-sm font-medium ${transaction.amount > 0 ? "text-emerald-500" : ""}`}>
              {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    housing: "🏠",
    food: "🍔",
    transport: "🚗",
    utilities: "💡",
    entertainment: "🎬",
    healthcare: "🏥",
    education: "📚",
    shopping: "🛍️",
    personal: "👤",
    income: "💰",
    other: "📦",
  }

  return icons[category.toLowerCase()] || "📦"
}

function getCategoryLabel(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1)
}

function getRelativeDate(date: Date | string) {
  const txDate = new Date(date)
  const now = new Date()

  const diffDays = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`

  return format(txDate, "MMM d, yyyy")
}
