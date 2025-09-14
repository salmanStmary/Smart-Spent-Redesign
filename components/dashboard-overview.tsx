"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Bell, DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { ExpenseChart } from "@/components/expense-chart"
import { BudgetOverview } from "@/components/budget-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { SavingsGoals } from "@/components/savings-goals"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

export function DashboardOverview() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [dashboardData, setDashboardData] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0,
    recentTransactions: [],
    expenseBreakdown: [],
    budgetProgress: [],
    savingsGoals: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  async function fetchDashboardData() {
    try {
      setLoading(true)

      // Fetch expenses
      const expensesResponse = await fetch(`/api/expenses?userId=${user?.id}`)
      if (!expensesResponse.ok) throw new Error("Failed to fetch expenses")
      const expenses = await expensesResponse.json()

      // Fetch budgets
      const budgetsResponse = await fetch(`/api/budgets?userId=${user?.id}`)
      if (!budgetsResponse.ok) throw new Error("Failed to fetch budgets")
      const budgets = await budgetsResponse.json()

      // Fetch analytics
      const analyticsResponse = await fetch(`/api/analytics?userId=${user?.id}`)
      if (!analyticsResponse.ok) throw new Error("Failed to fetch analytics")
      const analytics = await analyticsResponse.json()

      // Calculate dashboard metrics
      const totalIncome = expenses.filter((e) => e.amount > 0).reduce((sum, e) => sum + e.amount, 0)

      const totalExpenses = expenses.filter((e) => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0)

      const totalBalance = totalIncome - totalExpenses

      // Get recent transactions
      const recentTransactions = expenses
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

      setDashboardData({
        totalBalance,
        monthlyIncome: totalIncome,
        monthlyExpenses: totalExpenses,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
        recentTransactions,
        expenseBreakdown: analytics.categoryData || [],
        budgetProgress: budgets.map((budget) => {
          const spent = expenses
            .filter((e) => e.category === budget.category && e.amount < 0)
            .reduce((sum, e) => sum + Math.abs(e.amount), 0)

          return {
            ...budget,
            spent,
          }
        }),
        savingsGoals: [
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
        ],
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's an overview of your finances.</p>
        </div>
        <Button className="gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${dashboardData.totalBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${dashboardData.monthlyIncome.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${dashboardData.monthlyExpenses.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">+10.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.savingsRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">+7.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                    <CardDescription>Your spending patterns for the current month</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ExpenseChart data={dashboardData.expenseBreakdown} />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Budget Overview</CardTitle>
                    <CardDescription>Your budget progress for major categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BudgetOverview budgets={dashboardData.budgetProgress} />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentTransactions transactions={dashboardData.recentTransactions} />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Savings Goals</CardTitle>
                    <CardDescription>Track your progress towards financial goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SavingsGoals goals={dashboardData.savingsGoals} />
                  </CardContent>
                </Card>
              </div>
              <Alert>
                <AlertTitle>Smart Recommendation</AlertTitle>
                <AlertDescription>
                  Based on your spending patterns, you could save $150 more per month by reducing dining out expenses.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Analytics</CardTitle>
                  <CardDescription>In-depth analysis of your financial data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Analytics content will be displayed here. This section will include detailed charts, trends, and
                    financial insights.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Reports</CardTitle>
                  <CardDescription>Generate and download financial reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Reports content will be displayed here. This section will allow you to generate custom reports and
                    export your financial data.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
