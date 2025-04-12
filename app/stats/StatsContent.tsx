"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BarChart3, Calendar, Clock, Trophy, Loader2 } from "lucide-react"
import { getQuizHistory } from "@/lib/vocabulary-service"
import type { QuizResult } from "@/lib/supabase"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts"



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

  const progressData = [
    {date: "2023-10-01", averageScore: 75},
    {date: "2023-10-02", averageScore: 80},
    {date: "2023-10-03", averageScore: 85},
    {date: "2023-10-04", averageScore: 90},
    {date: "2023-10-05", averageScore: 95},
    {date: "2023-10-06", averageScore: 100},
    {date: "2023-10-07", averageScore: 105},
    {date: "2023-10-08", averageScore: 110},
    {date: "2023-10-09", averageScore: 115},
    {date: "2023-10-10", averageScore: 120},
    
  ]

  // const progressData = Object.values(
  //   quizHistory.reduce((acc, quiz) => {
  //     const date = new Date(quiz.created_at).toLocaleDateString()
  //     if (!acc[date]) {
  //       acc[date] = { date, totalScore: 0, count: 0 }
  //     }
  //     acc[date].totalScore += quiz.score
  //     acc[date].count += 1
  //     return acc
  //   }, {} as Record<string, { date: string; totalScore: number; count: number }>)
  // ).map((entry) => ({
  //   date: entry.date,
  //   averageScore: entry.totalScore / entry.count,
  // }))

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
            <CardContent className="h-[300px]">
              {progressData.length === 0 ? (
                <p className="text-muted-foreground text-center">No progress data available</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={400}
                    data={progressData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}