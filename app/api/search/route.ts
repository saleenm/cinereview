import { NextRequest, NextResponse } from 'next/server'
import { getMovies } from '@/lib/movies'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() || ''
  const genre = req.nextUrl.searchParams.get('genre')?.toLowerCase().trim() || ''
  const limit = Math.min(200, parseInt(req.nextUrl.searchParams.get('limit') || '8'))

  let movies = getMovies()

  // Filter by genre
  if (genre) {
    movies = movies.filter(m => (m.genres as string[]).includes(genre))
  }

  // Filter by query
  if (q.length >= 2) {
    movies = movies.filter((m) =>
      m.title.toLowerCase().includes(q) ||
      m.title_ar.includes(q) ||
      m.director.toLowerCase().includes(q) ||
      (m.director_ar && m.director_ar.includes(q)) ||
      m.cast.some((c) => c.toLowerCase().includes(q))
    )
  } else if (!genre) {
    // No query and no genre — return top rated
    movies = movies.sort((a, b) => b.rating_overall - a.rating_overall)
  }

  const results = movies.slice(0, limit).map((m) => ({
    slug: m.slug,
    title: m.title,
    title_ar: m.title_ar,
    year: m.year,
    director: m.director,
    director_ar: m.director_ar,
    poster_url: m.poster_url,
    rating_overall: m.rating_overall,
    imdb_rating: m.imdb_rating,
    genres: m.genres,
    language: m.language,
    duration: m.duration,
  }))

  return NextResponse.json({ results, total: results.length })
}
