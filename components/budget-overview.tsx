"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

type Budget = {
  _id?: string
  category: string
  amount: number
  spent: number
  period?: string
  color?: string
}

type BudgetOverviewProps = {
  budgets?: Budget[]
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Use provided budgets or fallback to default data
  const budgetData =
    budgets && budgets.length > 0
      ? budgets
      : [
          {
            category: "Housing",
            spent: 1200,
            amount: 1300,
            color: "bg-purple-500",
          },
          {
            category: "Food",
            spent: 450,
            amount: 500,
            color: "bg-green-500",
          },
          {
            category: "Transport",
            spent: 300,
            amount: 250,
            color: "bg-yellow-500",
          },
          {
            category: "Utilities",
            spent: 180,
            amount: 200,
            color: "bg-orange-500",
          },
          {
            category: "Entertainment",
            spent: 220,
            amount: 200,
            color: "bg-blue-500",
          },
        ]

  return (
    <div className="space-y-4">
      {budgetData.map((item) => (
        <div key={item._id || item.category} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{item.category}</span>
            <span>
              ${item.spent.toFixed(2)} / ${item.amount.toFixed(2)}
            </span>
          </div>
          <Progress
            value={(item.spent / item.amount) * 100}
            className={`h-2 ${item.spent > item.amount ? "bg-rose-100" : "bg-muted"}`}
            indicatorClassName={`${getBudgetColor(item.category)} ${item.spent > item.amount ? "bg-rose-500" : ""}`}
          />
        </div>
      ))}
    </div>
  )
}

function getBudgetColor(category: string) {
  const colors: Record<string, string> = {
    housing: "bg-purple-500",
    food: "bg-green-500",
    transport: "bg-yellow-500",
    utilities: "bg-orange-500",
    entertainment: "bg-blue-500",
    healthcare: "bg-emerald-500",
    education: "bg-indigo-500",
    shopping: "bg-pink-500",
    personal: "bg-cyan-500",
    other: "bg-gray-500",
  }

  return colors[category.toLowerCase()] || "bg-gray-500"
}
