"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { seedVocabulary } from "@/app/actions/seed-vocabulary"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function SeedButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSeed = async () => {
    setIsLoading(true)
    try {
      const result = await seedVocabulary()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed vocabulary data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSeed} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Seed Vocabulary Data
    </Button>
  )
}
