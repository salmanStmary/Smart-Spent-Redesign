"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Plus, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const categories = [
  { value: "housing", label: "Housing" },
  { value: "food", label: "Food" },
  { value: "transport", label: "Transport" },
  { value: "utilities", label: "Utilities" },
  { value: "entertainment", label: "Entertainment" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "shopping", label: "Shopping" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
]

const formSchema = z.object({
  category: z.string({
    required_error: "Please select a category.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  period: z.string({
    required_error: "Please select a period.",
  }),
})

type Budget = {
  _id: string
  category: string
  amount: number
  period: string
  userId: string
  spent: number
}

export function BudgetManager() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      period: "monthly",
    },
  })

  // Fetch budgets and spending data
  useEffect(() => {
    if (user) {
      fetchBudgets()
    }
  }, [user])

  async function fetchBudgets() {
    try {
      setLoading(true)

      // Fetch budgets
      const budgetsResponse = await fetch(`/api/budgets?userId=${user?.id}`)

      if (!budgetsResponse.ok) {
        throw new Error("Failed to fetch budgets")
      }

      const budgetsData = await budgetsResponse.json()

      // Fetch expenses to calculate spending
      const expensesResponse = await fetch(`/api/expenses?userId=${user?.id}`)

      if (!expensesResponse.ok) {
        throw new Error("Failed to fetch expenses")
      }

      const expensesData = await expensesResponse.json()

      // Calculate spending for each budget
      const budgetsWithSpending = budgetsData.map((budget: any) => {
        const categoryExpenses = expensesData.filter(
          (expense: any) => expense.category === budget.category && expense.amount < 0,
        )

        const spent = categoryExpenses.reduce((total: number, expense: any) => total + Math.abs(expense.amount), 0)

        return {
          ...budget,
          spent,
        }
      })

      setBudgets(budgetsWithSpending)
    } catch (error) {
      console.error("Error fetching budgets:", error)
      toast({
        title: "Error",
        description: "Failed to load budgets",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return

    try {
      const budgetData = {
        ...values,
        userId: user.id,
      }

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetData),
      })

      if (!response.ok) {
        throw new Error("Failed to create budget")
      }

      const newBudget = await response.json()

      // Check if this is an update or new budget
      const existingIndex = budgets.findIndex((b) => b.category === values.category)

      if (existingIndex >= 0) {
        // Update existing budget
        const updatedBudgets = [...budgets]
        updatedBudgets[existingIndex] = {
          ...updatedBudgets[existingIndex],
          amount: values.amount,
          period: values.period,
        }

        setBudgets(updatedBudgets)

        toast({
          title: "Budget updated",
          description: `${getCategoryLabel(values.category)} budget updated to $${values.amount}`,
        })
      } else {
        // Add new budget
        setBudgets([...budgets, { ...newBudget, spent: 0 }])

        toast({
          title: "Budget created",
          description: `${getCategoryLabel(values.category)} budget set to $${values.amount}`,
        })
      }

      form.reset()
    } catch (error) {
      console.error("Error creating budget:", error)
      toast({
        title: "Error",
        description: "Failed to create budget",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`/api/budgets?id=${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete budget")
      }

      setBudgets(budgets.filter((budget) => budget._id !== id))

      toast({
        title: "Budget deleted",
        description: "The budget has been removed",
      })
    } catch (error) {
      console.error("Error deleting budget:", error)
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive",
      })
    } finally {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Manager</h1>
        <p className="text-muted-foreground">Create and manage your budgets</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Budget Overview</TabsTrigger>
          <TabsTrigger value="create">Create Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Your Budgets</CardTitle>
              <CardDescription>Track your spending against your budget limits</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Loading budgets...</p>
                </div>
              ) : budgets.length > 0 ? (
                <div className="space-y-6">
                  {budgets.map((budget) => (
                    <div key={budget._id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{getCategoryLabel(budget.category)}</p>
                          <p className="text-xs text-muted-foreground">
                            {budget.period.charAt(0).toUpperCase() + budget.period.slice(1)} budget
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">
                            ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                          </p>
                          <AlertDialog
                            open={deleteId === budget._id}
                            onOpenChange={(open) => !open && setDeleteId(null)}
                          >
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId(budget._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Budget</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this budget? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(budget._id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <Progress
                        value={(budget.spent / budget.amount) * 100}
                        className={`h-2 ${budget.spent > budget.amount ? "bg-rose-100" : "bg-muted"}`}
                        indicatorClassName={`${getBudgetColor(budget.category)} ${budget.spent > budget.amount ? "bg-rose-500" : ""}`}
                      />
                      <p className="text-xs text-right text-muted-foreground">
                        {Math.round((budget.spent / budget.amount) * 100)}% of budget used
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground">No budgets created yet</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => document.querySelector('[data-value="create"]')?.click()}
                  >
                    Create your first budget
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Budget</CardTitle>
              <CardDescription>Set up a new budget for a spending category</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the spending category for this budget</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>Enter the maximum amount for this budget</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Period</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>How often this budget resets</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Create Budget
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getCategoryLabel(category: string) {
  const found = categories.find((c) => c.value === category)
  return found ? found.label : "Other"
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

  return colors[category] || "bg-gray-500"
}
