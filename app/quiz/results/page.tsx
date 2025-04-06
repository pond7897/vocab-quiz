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
  const percentage = Math.round((score / total) * 100)

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
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Results</CardTitle>
          <CardDescription>See how well you did</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">
              {score} / {total}
            </p>
            <p className={`text-lg font-medium ${color}`}>{message}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/quiz" className="w-full">
            <Button className="w-full" startIcon={<RotateCcw className="mr-2 h-4 w-4" />}>
              Try Again
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full" startIcon={<Home className="mr-2 h-4 w-4" />}>
              Back to Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

