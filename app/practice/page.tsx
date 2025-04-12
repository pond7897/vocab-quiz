"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { vocabularyData } from "@/lib/vocabulary-data"
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react"

export default function PracticePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const currentWord = vocabularyData[currentIndex]

  const handleCheck = () => {
    const correct = userInput.trim().toLowerCase() === currentWord.translation.toLowerCase()
    setIsCorrect(correct)
    setShowTranslation(true)
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vocabularyData.length)
    setShowTranslation(false)
    setUserInput("")
    setIsCorrect(null)
  }

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + vocabularyData.length) % vocabularyData.length)
    setShowTranslation(false)
    setUserInput("")
    setIsCorrect(null)
  }

  const handleReveal = () => {
    setShowTranslation(true)
  }

  return (
    <div className="container flex items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <CardTitle>Practice Mode</CardTitle>
            <div className="w-9"></div> {/* Spacer for alignment */}
          </div>
          <CardDescription className="text-center">
            Card {currentIndex + 1} of {vocabularyData.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{currentWord.word}</h2>
            <p className="text-muted-foreground">({currentWord.partOfSpeech})</p>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                placeholder="Enter Thai translation..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCheck()
                  }
                }}
                disabled={showTranslation}
              />
            </div>

            {!showTranslation ? (
              <div className="flex gap-2">
                <Button onClick={handleCheck} className="flex-1">
                  Check
                </Button>
                <Button onClick={handleReveal} variant="outline" className="flex-1">
                  Reveal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-md ${
                    isCorrect === null
                      ? "bg-muted"
                      : isCorrect
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect !== null &&
                      (isCorrect ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      ))}
                    <p className="font-medium">{currentWord.translation}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleNext} className="flex-1">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="icon" onClick={handlePrevious} disabled={showTranslation}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Practice mode helps you learn at your own pace
          </div>
          <Button variant="outline" size="icon" onClick={handleNext} disabled={showTranslation}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
