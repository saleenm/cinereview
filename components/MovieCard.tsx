'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Movie } from '@/lib/types'
import { GENRE_ICONS, GENRE_COLORS } from '@/lib/types'
import { getMovieDescription } from '@/lib/movies'
import StarRating from '@/components/StarRating'

const FALLBACK_POSTER = 'https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'

interface Props {
  movie: Movie
  locale: string
  variant?: 'default' | 'compact' | 'featured'
}

function RatingBadge({ value }: { value: number }) {
  const color = value >= 9 ? 'bg-green-500' : value >= 7.5 ? 'bg-yellow-500' : value >= 6 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <span className={`${color} text-white text-xs font-black px-2 py-0.5 rounded-md tabular-nums`}>
      ★ {value.toFixed(1)}
    </span>
  )
}

function MovieImage({ src, alt, fill, className, sizes, width, height }: {
  src: string; alt: string; fill?: boolean; className?: string; sizes?: string; width?: number; height?: number
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_POSTER)

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        onError={() => setImgSrc(FALLBACK_POSTER)}
        unoptimized={imgSrc.includes('wikimedia') || imgSrc.includes('imgur')}
      />
    )
  }
  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 200}
      height={height || 300}
      className={className}
      onError={() => setImgSrc(FALLBACK_POSTER)}
      unoptimized={imgSrc.includes('wikimedia') || imgSrc.includes('imgur')}
    />
  )
}

export default function MovieCard({ movie, locale, variant = 'default' }: Props) {
  const href = `/${locale}/movies/${movie.slug}`
  const desc = getMovieDescription(movie, locale)
  const isRTL = locale === 'ar'
  const primaryGenre = movie.genres[0]

  if (variant === 'featured') {
    return (
      <Link href={href} className="group relative block rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
        <div className="relative h-56">
          <MovieImage
            src={movie.backdrop_url || movie.poster_url}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          <div className="absolute top-3 start-3 flex gap-2">
            <RatingBadge value={movie.rating_overall} />
            <span className={`text-xs px-2 py-0.5 rounded-md border ${GENRE_COLORS[primaryGenre]} font-medium`}>
              {GENRE_ICONS[primaryGenre]}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-amber-400 transition-colors">
            {isRTL ? movie.title_ar : movie.title}
          </h3>
          <p className="text-gray-500 text-xs mb-2">{movie.director} · {movie.year}</p>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{desc}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
            <span>IMDb {movie.imdb_rating}</span>
            <span>🍅 {movie.rotten_tomatoes}%</span>
            <span>{movie.duration} {locale === 'ar' ? 'دقيقة' : locale === 'ja' ? '分' : 'min'}</span>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-all">
        <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
          <MovieImage src={movie.poster_url} alt={movie.title} fill className="object-cover" sizes="48px" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors truncate">
            {isRTL ? movie.title_ar : movie.title}
          </h4>
          <p className="text-gray-500 text-xs">{movie.year} · {movie.director.split(' ').pop()}</p>
          <RatingBadge value={movie.rating_overall} />
        </div>
      </Link>
    )
  }

  // default variant — improved card
  return (
    <Link href={href} className="group flex flex-col rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5">
      {/* Poster — taller for better visual */}
      <div className="relative w-full" style={{ aspectRatio: '2/3' }}>
        <MovieImage
          src={movie.poster_url}
          alt={isRTL ? movie.title_ar : movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
        {/* Rating badge */}
        <div className="absolute top-2 start-2">
          <RatingBadge value={movie.rating_overall} />
        </div>
        {/* Featured badge */}
        {movie.is_featured && (
          <div className="absolute top-2 end-2">
            <span className="bg-amber-500 text-gray-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
              {isRTL ? 'مميز' : 'Featured'}
            </span>
          </div>
        )}
        {/* Genre icons at bottom of poster */}
        <div className="absolute bottom-2 start-2 flex gap-1">
          {movie.genres.slice(0, 2).map((g) => (
            <span key={g} className={`text-[10px] px-1.5 py-0.5 rounded border bg-gray-900/70 ${GENRE_COLORS[g]}`}>
              {GENRE_ICONS[g]}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-bold text-white text-sm leading-tight mb-0.5 group-hover:text-amber-400 transition-colors line-clamp-2">
          {isRTL ? movie.title_ar : movie.title}
        </h3>
        {isRTL && (
          <p className="text-gray-600 text-xs mb-0.5 truncate">{movie.title}</p>
        )}
        <p className="text-gray-500 text-xs mb-2 truncate">{movie.director} · {movie.year}</p>
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">IMDb {movie.imdb_rating}</span>
            <span className={`font-bold ${movie.rotten_tomatoes >= 75 ? 'text-green-400' : movie.rotten_tomatoes >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              🍅 {movie.rotten_tomatoes}%
            </span>
          </div>
          <StarRating movieSlug={movie.slug} size="sm" />
        </div>
      </div>
    </Link>
  )
}
