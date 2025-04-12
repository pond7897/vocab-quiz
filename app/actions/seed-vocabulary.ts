"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { vocabularyData } from "@/lib/vocabulary-data"

export async function seedVocabulary() {
  try {
    const supabase = createServerSupabaseClient()

    // Check if vocabulary table already has data
    const { count } = await supabase.from("vocabulary").select("*", { count: "exact", head: true })

    // If we already have data, don't seed again
    if (count && count > 0) {
      return { success: true, message: "Vocabulary data already exists", count }
    }

    // Format data for insertion
    const seedData = vocabularyData.map((item) => ({
      word: item.word,
      part_of_speech: item.partOfSpeech,
      translation: item.translation,
    }))

    // Insert data
    const { error } = await supabase.from("vocabulary").insert(seedData)

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, message: `Seeded ${seedData.length} vocabulary items` }
  } catch (error: any) {
    console.error("Error seeding vocabulary:", error.message)
    return { success: false, message: error.message }
  }
}
