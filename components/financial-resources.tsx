"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ExternalLink, Search } from "lucide-react"
import { useState } from "react"

const articles = [
  {
    id: "1",
    title: "10 Tips for Better Budgeting",
    description: "Learn how to create and stick to a budget that works for your lifestyle.",
    category: "Budgeting",
    readTime: "5 min read",
    date: "Apr 15, 2023",
  },
  {
    id: "2",
    title: "Understanding Emergency Funds",
    description: "Why you need an emergency fund and how to build one quickly.",
    category: "Saving",
    readTime: "7 min read",
    date: "Mar 22, 2023",
  },
  {
    id: "3",
    title: "Investing for Beginners",
    description: "A simple guide to start your investment journey with minimal risk.",
    category: "Investing",
    readTime: "10 min read",
    date: "Feb 10, 2023",
  },
  {
    id: "4",
    title: "How to Reduce Monthly Expenses",
    description: "Practical strategies to cut down your monthly spending without sacrificing quality of life.",
    category: "Budgeting",
    readTime: "6 min read",
    date: "Jan 5, 2023",
  },
  {
    id: "5",
    title: "Debt Repayment Strategies",
    description: "Different approaches to paying off debt and becoming financially free.",
    category: "Debt",
    readTime: "8 min read",
    date: "Dec 12, 2022",
  },
  {
    id: "6",
    title: "Retirement Planning 101",
    description: "Start planning for retirement early with these essential tips.",
    category: "Planning",
    readTime: "9 min read",
    date: "Nov 8, 2022",
  },
]

export function FinancialResources() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Resources</h1>
        <p className="text-muted-foreground">Educational content to improve your financial knowledge</p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search articles..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="budgeting">Budgeting</TabsTrigger>
          <TabsTrigger value="saving">Saving</TabsTrigger>
          <TabsTrigger value="investing">Investing</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{article.category}</Badge>
                    <span className="text-xs text-muted-foreground">{article.date}</span>
                  </div>
                  <CardTitle className="mt-2">{article.title}</CardTitle>
                  <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BookOpen className="mr-1 h-3 w-3" />
                    {article.readTime}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Read Article <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredArticles.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground">No articles found matching your search</p>
                <Button variant="link" className="mt-2" onClick={() => setSearchQuery("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="budgeting" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles
              .filter((article) => article.category === "Budgeting")
              .map((article) => (
                <Card key={article.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <CardTitle className="mt-2">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Read Article <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="saving" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles
              .filter((article) => article.category === "Saving")
              .map((article) => (
                <Card key={article.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <CardTitle className="mt-2">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Read Article <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="investing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles
              .filter((article) => article.category === "Investing")
              .map((article) => (
                <Card key={article.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <CardTitle className="mt-2">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Read Article <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="debt" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles
              .filter((article) => article.category === "Debt")
              .map((article) => (
                <Card key={article.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{article.category}</Badge>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>
                    <CardTitle className="mt-2">{article.title}</CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <BookOpen className="mr-1 h-3 w-3" />
                      {article.readTime}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Read Article <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
