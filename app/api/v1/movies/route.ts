import { NextRequest, NextResponse } from 'next/server'
import { getMovies } from '@/lib/movies'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const genre = searchParams.get('genre')
  const minRating = parseFloat(searchParams.get('min_rating') || '0')
  const year = parseInt(searchParams.get('year') || '0')

  let movies = getMovies()

  if (genre) movies = movies.filter(m => (m.genres as string[]).includes(genre.toLowerCase()))
  if (minRating > 0) movies = movies.filter(m => m.rating_overall >= minRating)
  if (year > 0) movies = movies.filter(m => m.year === year)

  const total = movies.length
  const offset = (page - 1) * limit
  const results = movies.slice(offset, offset + limit).map(m => ({
    slug: m.slug,
    title: m.title,
    title_ar: m.title_ar,
    year: m.year,
    director: m.director,
    genres: m.genres,
    rating_overall: m.rating_overall,
    imdb_rating: m.imdb_rating,
    rotten_tomatoes: m.rotten_tomatoes,
    poster_url: m.poster_url,
    language: m.language,
    duration: m.duration,
  }))

  return NextResponse.json({
    results,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 's-maxage=3600',
    },
  })
}
