import { NextRequest, NextResponse } from 'next/server'
import { getMovies } from '@/lib/movies'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.toLowerCase().trim() || ''
  if (q.length < 2) return NextResponse.json([])

  const movies = getMovies()
  const results = movies.filter((m) =>
    m.title.toLowerCase().includes(q) ||
    m.title_ar.includes(q) ||
    m.director.toLowerCase().includes(q) ||
    m.cast.some((c) => c.toLowerCase().includes(q))
  ).slice(0, 8)

  return NextResponse.json(results.map((m) => ({
    slug: m.slug,
    title: m.title,
    title_ar: m.title_ar,
    year: m.year,
    poster_url: m.poster_url,
    rating_overall: m.rating_overall,
    genres: m.genres,
  })))
}
