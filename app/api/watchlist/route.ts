import { NextRequest, NextResponse } from 'next/server'
import { getMovieBySlug } from '@/lib/movies'

export async function GET(req: NextRequest) {
  const slugsParam = req.nextUrl.searchParams.get('slugs') || ''
  const slugs = slugsParam.split(',').filter(Boolean).slice(0, 100)

  const movies = slugs
    .map((slug) => getMovieBySlug(slug))
    .filter(Boolean)
    .map((m) => ({
      slug: m!.slug,
      title: m!.title,
      title_ar: m!.title_ar,
      year: m!.year,
      poster_url: m!.poster_url,
      rating_overall: m!.rating_overall,
    }))

  return NextResponse.json(movies)
}
