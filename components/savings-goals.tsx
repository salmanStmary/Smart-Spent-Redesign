"use client"

import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

type SavingsGoal = {
  name: string
  current: number
  target: number
  color: string
}

type SavingsGoalsProps = {
  goals?: SavingsGoal[]
}

export function SavingsGoals({ goals }: SavingsGoalsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Use provided goals or fallback to default data
  const savingsGoals =
    goals && goals.length > 0
      ? goals
      : [
          {
            name: "Emergency Fund",
            current: 5000,
            target: 10000,
            color: "bg-emerald-500",
          },
          {
            name: "Vacation",
            current: 1200,
            target: 3000,
            color: "bg-blue-500",
          },
          {
            name: "New Car",
            current: 3500,
            target: 15000,
            color: "bg-purple-500",
          },
        ]

  return (
    <div className="space-y-4">
      {savingsGoals.map((goal) => (
        <div key={goal.name} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>{goal.name}</span>
            <span>
              ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
            </span>
          </div>
          <Progress
            value={(goal.current / goal.target) * 100}
            className="h-2 bg-muted"
            indicatorClassName={goal.color}
          />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round((goal.current / goal.target) * 100)}% complete
          </p>
        </div>
      ))}
    </div>
  )
}
