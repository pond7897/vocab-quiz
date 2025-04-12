"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { getRandomVocabulary, saveQuizResult, updateUserProgress } from "@/lib/vocabulary-service"

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState<number>(0)
  const [questions, setQuestions] = useState<
    Array<{
      id: string
      word: string
      partOfSpeech: string
      correctAnswer: string
      options: string[]
    }>
  >([])

  useEffect(() => {
    // Start the timer when quiz starts
    setStartTime(Date.now())

    // Prepare quiz questions
    const prepareQuiz = async () => {
      setIsLoading(true)
      try {
        const vocabularyData = await getRandomVocabulary(10)

        if (vocabularyData.length === 0) {
          router.push("/admin")
          return
        }

        const preparedQuestions = await Promise.all(
          vocabularyData.map(async (item) => {
            // Get 3 random incorrect options
            const allVocab = await getRandomVocabulary(20) // Get more than we need
            const incorrectOptions = allVocab
              .filter((vocabItem) => vocabItem.translation !== item.translation)
              .slice(0, 3)
              .map((vocabItem) => vocabItem.translation)

            // Combine correct and incorrect options and shuffle
            const options = [item.translation, ...incorrectOptions].sort(() => Math.random() - 0.5)

            return {
              id: item.id,
              word: item.word,
              partOfSpeech: item.part_of_speech,
              correctAnswer: item.translation,
              options,
            }
          }),
        )

        setQuestions(preparedQuestions)
        setIsLoading(false)
      } catch (error) {
        console.error("Error preparing quiz:", error)
        setIsLoading(false)
      }
    }

    prepareQuiz()
  }, [router])

  const handleSelectAnswer = async (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer

    if (isCorrect) {
      setScore(score + 1)
    }

    // Update user progress for this vocabulary item
    await updateUserProgress(questions[currentQuestionIndex].id, isCorrect)
  }

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      // Calculate time spent
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      // Save quiz result
      await saveQuizResult(score, questions.length, timeSpent)

      // Quiz completed, navigate to results
      router.push(`/quiz/results?score=${score}&total=${questions.length}&time=${timeSpent}`)
    }
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center">Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="container flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">No vocabulary found. Please go to Admin Panel and add vocabulary.</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.push("/admin")}>Go to Admin Panel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Vocabulary Quiz</CardTitle>
              <CardDescription>
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="font-medium">Score: {score}</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{currentQuestion.word}</h2>
            <p className="text-muted-foreground">({currentQuestion.partOfSpeech})</p>
            <p className="text-lg mt-4">What is the Thai translation?</p>
          </div>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={
                  isAnswered
                    ? option === currentQuestion.correctAnswer
                      ? "default"
                      : option === selectedAnswer
                        ? "destructive"
                        : "outline"
                    : "outline"
                }
                className={`justify-start h-auto py-4 px-4 text-left ${
                  isAnswered && option === currentQuestion.correctAnswer ? "border-green-500" : ""
                }`}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
              >
                <div className="flex items-center w-full">
                  <span className="flex-1">{option}</span>
                  {isAnswered && option === currentQuestion.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  {isAnswered && option === selectedAnswer && option !== currentQuestion.correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleNextQuestion} disabled={!isAnswered}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
