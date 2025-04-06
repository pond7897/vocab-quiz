import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">English-Thai Vocabulary Quiz</h1>
        <p className="text-muted-foreground max-w-md">
          Test your knowledge of English-Thai vocabulary with this interactive quiz.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Start Learning</CardTitle>
          <CardDescription>Choose a mode to begin your vocabulary practice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <Link href="/quiz" className="w-full">
              <Button className="w-full" size="lg">
                Start Quiz
              </Button>
            </Link>
            <Link href="/practice" className="w-full">
              <Button variant="outline" className="w-full" size="lg">
                Practice Mode
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/admin">
            <Button variant="ghost">Admin Panel</Button>
          </Link>
          <Link href="/stats">
            <Button variant="ghost">View Stats</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

