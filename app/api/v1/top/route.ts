import { NextRequest, NextResponse } from 'next/server'
import { getMovies } from '@/lib/movies'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const genre = searchParams.get('genre')

  let movies = getMovies()
  if (genre) movies = movies.filter(m => (m.genres as string[]).includes(genre.toLowerCase()))

  const results = movies
    .sort((a, b) => b.rating_overall - a.rating_overall)
    .slice(0, limit)
    .map((m, i) => ({
      rank: i + 1,
      slug: m.slug,
      title: m.title,
      title_ar: m.title_ar,
      year: m.year,
      director: m.director,
      genres: m.genres,
      rating_overall: m.rating_overall,
      imdb_rating: m.imdb_rating,
      poster_url: m.poster_url,
    }))

  return NextResponse.json({ results }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 's-maxage=3600',
    },
  })
}
