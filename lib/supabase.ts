import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
export const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Create a type-safe client for the server-side
export const createServerSupabaseClient = () => {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Types for our Supabase tables
export type Vocabulary = {
  id: string
  word: string
  part_of_speech: string
  translation: string
  created_at: string
  updated_at: string
}

export type QuizResult = {
  id: string
  user_id: string | null
  score: number
  total: number
  time_spent: number | null
  created_at: string
}

export type UserProgress = {
  id: string
  user_id: string | null
  vocabulary_id: string
  correct_count: number
  incorrect_count: number
  last_practiced: string
  created_at: string
  updated_at: string
}
