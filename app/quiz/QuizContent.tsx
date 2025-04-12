"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Loader2, ArrowLeft, ArrowRight } from "lucide-react"
import { getRandomVocabulary, saveQuizResult } from "@/lib/vocabulary-service"

export default function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("name") || "Anonymous"

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
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

  const handleSelectAnswer = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: answer,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    // Calculate score
    let correctCount = 0
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correctAnswer) {
        correctCount++
      }
    }

    setScore(correctCount)
    setIsSubmitted(true)

    // Calculate time spent
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    // Save quiz result with user name
    await saveQuizResult(correctCount, questions.length, userName, timeSpent)
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center py-12 mx-auto">
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
      <div className="container flex items-center justify-center py-12 mx-auto">
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
    <div className="container flex flex-col items-center justify-center py-12 mx-auto">
      {/* Quiz content */}
    </div>
  )
}