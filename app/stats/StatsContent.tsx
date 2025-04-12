"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Calendar, Clock, Trophy, Loader2 } from "lucide-react"
import { getQuizHistory } from "@/lib/vocabulary-service"
import type { QuizResult } from "@/lib/supabase"

export default function StatsContent() {
  const searchParams = useSearchParams()
  const userName = searchParams.get("name") || "Anonymous"

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const history = await getQuizHistory() // ดึงข้อมูลทุกคน
        setQuizHistory(history)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const averageScore =
    quizHistory.length > 0
      ? quizHistory.reduce((acc, quiz) => acc + (quiz.score / quiz.total) * 100, 0) / quizHistory.length
      : 0

  const averageTime =
    quizHistory.length > 0 && quizHistory.some((q) => q.time_spent)
      ? quizHistory.reduce((acc, quiz) => acc + (quiz.time_spent || 0), 0) /
        quizHistory.filter((q) => q.time_spent).length
      : 0

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <div className="container py-10 mx-auto">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-3xl font-bold">All Players' Statistics</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">{quizHistory.length} quizzes completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quizHistory.length}</div>
            <p className="text-xs text-muted-foreground">Total practice sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(averageTime)}</div>
            <p className="text-xs text-muted-foreground">Average quiz completion time</p>
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
              <CardTitle>Recent Quizzes for {userName}</CardTitle>
              <CardDescription>Your quiz history and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {quizHistory.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No quiz history yet. Complete some quizzes to see your stats!
                </p>
              ) : (
                <div className="space-y-8">
                  {quizHistory.map((quiz, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {quiz.name || "Anonymous"} - {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Score: {quiz.score}/{quiz.total} ({((quiz.score / quiz.total) * 100).toFixed(0)}%)
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {quiz.time_spent ? `${Math.floor(quiz.time_spent / 60)}:${(quiz.time_spent % 60).toString().padStart(2, "0")}` : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <p className="text-muted-foreground">Progress chart will be displayed here in a future update</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}