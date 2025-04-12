"use client"

import { Suspense } from "react"
import StatsContent from "./StatsContent"

export default function StatsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatsContent />
    </Suspense>
  )
}