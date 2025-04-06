"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Calendar, Clock, Trophy } from "lucide-react"

export default function StatsPage() {
  const [quizHistory] = useState([
    { date: "2023-04-06", score: 8, total: 10, timeSpent: "3:24" },
    { date: "2023-04-05", score: 7, total: 10, timeSpent: "4:12" },
    { date: "2023-04-03", score: 9, total: 10, timeSpent: "2:58" },
    { date: "2023-04-01", score: 6, total: 10, timeSpent: "5:01" },
  ])

  const averageScore = quizHistory.reduce((acc, quiz) => acc + (quiz.score / quiz.total) * 100, 0) / quizHistory.length

  return (
    <div className="container py-10">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Your Statistics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+5.2% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizHistory.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3:54</div>
            <p className="text-xs text-muted-foreground">-0:22 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="mt-6">
        <TabsList>
          <TabsTrigger value="history">Quiz History</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quizzes</CardTitle>
              <CardDescription>Your quiz history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {quizHistory.map((quiz, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Quiz on {new Date(quiz.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Score: {quiz.score}/{quiz.total} ({((quiz.score / quiz.total) * 100).toFixed(0)}%)
                      </p>
                    </div>
                    <div className="ml-auto font-medium">{quiz.timeSpent}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your vocabulary learning progress</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Progress chart will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

