import { createClient as _createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Named factory for client components
export function createClient() {
  return _createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = _createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url: RequestInfo | URL, options?: RequestInit) =>
      fetch(url, { ...options, cache: 'no-store' }),
  },
})

export interface MovieReview {
  id: string
  movie_slug: string
  name: string
  locale: string
  rating: number        // 1-10
  comment: string
  created_at: string
  helpful_count: number
}

export async function getMovieReviews(slug: string): Promise<MovieReview[]> {
  const { data, error } = await supabase
    .from('movie_reviews')
    .select('*')
    .eq('movie_slug', slug)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) return []
  return data as MovieReview[]
}

export async function addMovieReview(review: {
  movie_slug: string
  name: string
  locale: string
  rating: number
  comment: string
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from('movie_reviews').insert(review)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getMovieAvgRating(slug: string): Promise<{ avg: number; count: number }> {
  const { data, error } = await supabase
    .from('movie_reviews')
    .select('rating')
    .eq('movie_slug', slug)
  if (error || !data?.length) return { avg: 0, count: 0 }
  const avg = data.reduce((s, r) => s + r.rating, 0) / data.length
  return { avg: Math.round(avg * 10) / 10, count: data.length }
}

export interface MovieList {
  id: string
  name: string
  description: string
  slugs: string[]
  locale: string
  created_at: string
}

export async function subscribeNewsletter(email: string, locale: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email: email.toLowerCase().trim(), locale, subscribed_at: new Date().toISOString() }, { onConflict: 'email' })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function createMovieList(list: {
  name: string
  description: string
  slugs: string[]
  locale: string
}): Promise<{ id: string | null; error?: string }> {
  const { data, error } = await supabase
    .from('movie_lists')
    .insert({ ...list, slugs: list.slugs })
    .select('id')
    .single()
  if (error) return { id: null, error: error.message }
  return { id: data.id }
}

export async function getMovieList(id: string): Promise<MovieList | null> {
  const { data, error } = await supabase
    .from('movie_lists')
    .select('*')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return data as MovieList
}
