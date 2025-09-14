"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

type ExpenseChartProps = {
  data?: {
    name: string
    value: number
    color: string
  }[]
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Use provided data or fallback to default data
  const chartData =
    data && data.length > 0
      ? data
      : [
          { name: "Housing", value: 1200, color: "#8884d8" },
          { name: "Food", value: 450, color: "#82ca9d" },
          { name: "Transport", value: 300, color: "#ffc658" },
          { name: "Utilities", value: 180, color: "#ff8042" },
          { name: "Entertainment", value: 220, color: "#0088fe" },
          { name: "Healthcare", value: 150, color: "#00C49F" },
          { name: "Other", value: 100, color: "#FFBB28" },
        ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
          <Tooltip
            formatter={(value) => [`$${value}`, "Amount"]}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
