"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { vocabularyData } from "@/lib/vocabulary-data"
import { CheckCircle, XCircle } from "lucide-react"

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [questions, setQuestions] = useState<
    Array<{
      word: string
      partOfSpeech: string
      correctAnswer: string
      options: string[]
    }>
  >([])

  useEffect(() => {
    // Prepare quiz questions
    const prepareQuiz = () => {
      // Shuffle vocabulary data and take first 10 items
      const shuffledVocab = [...vocabularyData].sort(() => Math.random() - 0.5).slice(0, 10)

      const preparedQuestions = shuffledVocab.map((item) => {
        // Get 3 random incorrect options
        const incorrectOptions = vocabularyData
          .filter((vocabItem) => vocabItem.translation !== item.translation)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map((vocabItem) => vocabItem.translation)

        // Combine correct and incorrect options and shuffle
        const options = [item.translation, ...incorrectOptions].sort(() => Math.random() - 0.5)

        return {
          word: item.word,
          partOfSpeech: item.partOfSpeech,
          correctAnswer: item.translation,
          options,
        }
      })

      setQuestions(preparedQuestions)
    }

    prepareQuiz()
  }, [])

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      // Quiz completed, navigate to results
      router.push(`/quiz/results?score=${score}&total=${questions.length}`)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Loading quiz questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
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

