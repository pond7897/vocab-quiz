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
    </div>
  )
}