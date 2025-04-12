"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, RotateCcw, Home } from "lucide-react"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const score = Number.parseInt(searchParams.get("score") || "0")
  const total = Number.parseInt(searchParams.get("total") || "10")
  const time = Number.parseInt(searchParams.get("time") || "0")
  const name = searchParams.get("name") || "Anonymous"
  const percentage = Math.round((score / total) * 100)

  // Format time to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  let message = ""
  let color = ""

  if (percentage >= 90) {
    message = "Excellent! You're a vocabulary master!"
    color = "text-green-500"
  } else if (percentage >= 70) {
    message = "Great job! You're doing well!"
    color = "text-emerald-500"
  } else if (percentage >= 50) {
    message = "Good effort! Keep practicing!"
    color = "text-amber-500"
  } else {
    message = "Keep studying! You'll improve with practice."
    color = "text-red-500"
  }

  return (
    <div className="container flex items-center justify-center py-12 mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Results for {name}</CardTitle>
          <CardDescription>See how well you did</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">
              {score} / {total}
            </p>
            <p className={`text-lg font-medium ${color}`}>{message}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Score</span>
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="font-medium mb-2">Quiz Details:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span>Completion Time:</span>
                <span className="text-right">{formatTime(time)}</span>
                <span>Questions:</span>
                <span className="text-right">{total}</span>
                <span>Correct Answers:</span>
                <span className="text-right">{score}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href={`/quiz?name=${encodeURIComponent(name)}`} className="w-full">
            <Button className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}