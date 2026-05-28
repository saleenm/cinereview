'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const FALLBACK_POSTER = 'https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'

interface Movie {
  slug: string
  title: string
  title_ar: string
  year: number
  poster_url: string
  rating_overall: number
}

function WatchlistImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_POSTER)
  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover group-hover:scale-105 transition-transform duration-300"
      sizes="(max-width:640px) 50vw, 25vw"
      onError={() => setImgSrc(FALLBACK_POSTER)}
      unoptimized={imgSrc.includes('wikimedia') || imgSrc.includes('imgur')}
    />
  )
}

export default function WatchlistPageClient({ locale }: { locale: string }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loaded, setLoaded] = useState(false)
  const isRTL = locale === 'ar'

  useEffect(() => {
    const slugs: string[] = JSON.parse(localStorage.getItem('watchlist') || '[]')
    if (slugs.length === 0) { setLoaded(true); return }

    fetch(`/api/watchlist?slugs=${slugs.join(',')}`)
      .then((r) => r.json())
      .then((data) => { setMovies(data); setLoaded(true) })
  }, [])

  const remove = (slug: string) => {
    const list: string[] = JSON.parse(localStorage.getItem('watchlist') || '[]')
    localStorage.setItem('watchlist', JSON.stringify(list.filter((s) => s !== slug)))
    setMovies((prev) => prev.filter((m) => m.slug !== slug))
  }

  if (!loaded) return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</main>
  )

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">
          {isRTL ? '★ قائمة المشاهدة' : '★ Watchlist'}
        </h1>
        <p className="text-gray-500 text-sm">
          {movies.length} {isRTL ? 'فيلم' : 'films'}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-gray-500 text-lg mb-6">
            {isRTL ? 'قائمتك فارغة' : 'Your watchlist is empty'}
          </p>
          <Link href={`/${locale}/movies`}
            className="px-6 py-3 bg-amber-500 text-gray-950 rounded-xl font-bold hover:bg-amber-400 transition-colors">
            {isRTL ? 'تصفح الأفلام' : 'Browse Movies'}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((m) => (
            <div key={m.slug} className="relative group">
              <Link href={`/${locale}/movies/${m.slug}`}>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800">
                  <WatchlistImage src={m.poster_url} alt={m.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
                  <div className="absolute bottom-2 start-2 bg-amber-500 text-gray-950 font-black text-xs px-2 py-0.5 rounded-md">★ {m.rating_overall}</div>
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-300 truncate">
                  {isRTL ? m.title_ar : m.title}
                </p>
                <p className="text-xs text-gray-600">{m.year}</p>
              </Link>
              <button
                onClick={() => remove(m.slug)}
                className="absolute top-2 end-2 w-7 h-7 bg-gray-950/80 rounded-full text-red-400 hover:text-red-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                title="Remove"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
