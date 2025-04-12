"use client"

import { Suspense } from "react"
import QuizContent from "./QuizContent"

export default function QuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QuizContent />
    </Suspense>
  )
}