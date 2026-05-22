import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json([])

  const { data, error } = await supabase
    .from('movie_reviews')
    .select('*')
    .eq('movie_slug', slug)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) return NextResponse.json([]) // table may not exist yet
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { movie_slug, name, locale, rating, comment } = body

  if (!movie_slug || !rating || !comment || comment.length < 10) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('movie_reviews')
    .insert({ movie_slug, name: name || 'Guest', locale: locale || 'en', rating: Number(rating), comment })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
