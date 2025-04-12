import { supabase } from "./supabase"
import type { Vocabulary } from "./supabase"

export async function getAllVocabulary(): Promise<Vocabulary[]> {
  const { data, error } = await supabase.from("vocabulary").select("*").order("word")

  if (error) {
    console.error("Error fetching vocabulary:", error)
    return []
  }

  return data || []
}

export async function getRandomVocabulary(limit = 10): Promise<Vocabulary[]> {
  // Supabase doesn't have a direct random() function, so we'll fetch all and shuffle
  const { data, error } = await supabase.from("vocabulary").select("*")

  if (error) {
    console.error("Error fetching vocabulary:", error)
    return []
  }

  // Shuffle the array
  const shuffled = [...(data || [])].sort(() => Math.random() - 0.5)

  // Return the requested number of items
  return shuffled.slice(0, limit)
}

export async function saveQuizResult(score: number, total: number, name: string, timeSpent?: number) {
  const { error } = await supabase.from("quiz_results").insert([
    {
      score,
      total,
      name: name,
      time_spent: timeSpent,
    },
  ])

  if (error) {
    console.error("Error saving quiz result:", error)
    return false
  }

  return true
}

export async function updateUserProgress(vocabularyId: string, isCorrect: boolean, name: string) {
  // First, check if a record exists
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("vocabulary_id", vocabularyId)
    .eq("name", name)
    .maybeSingle()

  if (error) {
    console.error("Error checking user progress:", error)
    return false
  }

  if (data) {
    // Update existing record
    const { error: updateError } = await supabase
      .from("user_progress")
      .update({
        correct_count: isCorrect ? data.correct_count + 1 : data.correct_count,
        incorrect_count: isCorrect ? data.incorrect_count : data.incorrect_count + 1,
        last_practiced: new Date().toISOString(),
      })
      .eq("id", data.id)

    if (updateError) {
      console.error("Error updating user progress:", updateError)
      return false
    }
  } else {
    // Create new record
    const { error: insertError } = await supabase.from("user_progress").insert([
      {
        vocabulary_id: vocabularyId,
        name: name,
        correct_count: isCorrect ? 1 : 0,
        incorrect_count: isCorrect ? 0 : 1,
      },
    ])

    if (insertError) {
      console.error("Error inserting user progress:", insertError)
      return false
    }
  }

  return true
}

export async function getQuizHistory(): Promise<any[]> {
  const { data, error } = await supabase
    .from("quiz_results")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    console.error("Error fetching quiz history:", error)
    return []
  }

  return data || []
}
