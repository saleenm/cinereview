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
  const cls = value >= 9 ? 'rating-excellent' : value >= 7.5 ? 'rating-good' : value >= 6 ? 'rating-ok' : 'rating-poor'
  return (
    <span className={`${cls} text-white text-xs font-black px-2 py-0.5 rounded-lg shadow-lg tabular-nums flex items-center gap-0.5`}>
      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24" className="opacity-90">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
      {value.toFixed(1)}
    </span>
  )
}

function MovieImage({ src, alt, fill, className, sizes, width, height }: {
  src: string; alt: string; fill?: boolean; className?: string; sizes?: string; width?: number; height?: number
}) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_POSTER)
  if (fill) {
    return (
      <Image src={imgSrc} alt={alt} fill className={className} sizes={sizes}
        onError={() => setImgSrc(FALLBACK_POSTER)}
        unoptimized={imgSrc.includes('wikimedia') || imgSrc.includes('imgur')} />
    )
  }
  return (
    <Image src={imgSrc} alt={alt} width={width || 200} height={height || 300} className={className}
      onError={() => setImgSrc(FALLBACK_POSTER)}
      unoptimized={imgSrc.includes('wikimedia') || imgSrc.includes('imgur')} />
  )
}

export default function MovieCard({ movie, locale, variant = 'default' }: Props) {
  const href = `/${locale}/movies/${movie.slug}`
  const desc = getMovieDescription(movie, locale)
  const isRTL = locale === 'ar'
  const primaryGenre = movie.genres[0]
  const durationLabel = locale === 'ar' ? 'د' : locale === 'ja' ? '分' : 'm'

  // ── Featured variant ──────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link href={href} className="group relative block rounded-2xl overflow-hidden border border-gray-800/80 hover:border-amber-500/50 transition-all duration-300 shine-card card-glow bg-gray-900">
        <div className="relative h-52">
          <MovieImage
            src={movie.backdrop_url || movie.poster_url}
            alt={movie.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
          {/* Top badges */}
          <div className="absolute top-3 start-3 flex gap-2 items-center">
            <RatingBadge value={movie.rating_overall} />
            {movie.is_featured && (
              <span className="bg-amber-500/90 text-gray-950 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                {isRTL ? 'مميز' : 'Top'}
              </span>
            )}
          </div>
          {/* Genre tag */}
          <div className="absolute top-3 end-3">
            <span className={`text-xs px-2 py-0.5 rounded-md border ${GENRE_COLORS[primaryGenre]} backdrop-blur-sm`}>
              {GENRE_ICONS[primaryGenre]}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-white text-base leading-tight mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">
            {isRTL ? movie.title_ar : movie.title}
          </h3>
          <p className="text-gray-500 text-xs mb-2 flex items-center gap-1.5">
            <span>{movie.director}</span>
            <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
            <span>{movie.year}</span>
            <span className="w-1 h-1 rounded-full bg-gray-700 flex-shrink-0" />
            <span>{movie.duration}{durationLabel}</span>
          </p>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{desc}</p>
          <div className="mt-3 flex items-center gap-3 pt-3 border-t border-gray-800/60">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {movie.imdb_rating}
            </span>
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${movie.rotten_tomatoes >= 75 ? 'text-green-400' : movie.rotten_tomatoes >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              🍅 {movie.rotten_tomatoes}%
            </span>
            <span className={`ms-auto text-xs px-2 py-0.5 rounded-full border ${GENRE_COLORS[primaryGenre]}`}>
              {GENRE_ICONS[primaryGenre]} {primaryGenre}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  // ── Compact variant ──────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex gap-3 p-3 rounded-xl bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 transition-all card-glow">
        <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
          <MovieImage src={movie.poster_url} alt={movie.title} fill className="object-cover" sizes="48px" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors truncate">
            {isRTL ? movie.title_ar : movie.title}
          </h4>
          <p className="text-gray-500 text-xs mt-0.5">{movie.year} · {movie.director.split(' ').pop()}</p>
          <div className="mt-1">
            <RatingBadge value={movie.rating_overall} />
          </div>
        </div>
      </Link>
    )
  }

  // ── Default variant ──────────────────────────────────────────
  return (
    <Link href={href} aria-label={`${isRTL ? movie.title_ar : movie.title} — ${movie.year}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 transition-all duration-300 shine-card card-glow cin-stagger-child" style={{ willChange:'transform' }}>
      {/* Poster */}
      <div className="relative w-full bg-gray-800" style={{ aspectRatio: '2/3' }} data-cursor="play">
        <MovieImage
          src={movie.poster_url}
          alt={isRTL ? movie.title_ar : movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />
        {/* Rating badge */}
        <div className="absolute top-2 start-2">
          <RatingBadge value={movie.rating_overall} />
        </div>
        {/* Featured tag */}
        {movie.is_featured && (
          <div className="absolute top-2 end-2">
            <span className="bg-amber-500 text-gray-950 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide shadow-lg">
              {isRTL ? 'مميز' : 'TOP'}
            </span>
          </div>
        )}
        {/* Genre at bottom of poster */}
        <div className="absolute bottom-2 start-2 flex gap-1">
          {movie.genres.slice(0, 2).map((g) => (
            <span key={g} className={`text-[10px] px-1.5 py-0.5 rounded-md border bg-gray-900/80 backdrop-blur-sm ${GENRE_COLORS[g]}`}>
              {GENRE_ICONS[g]}
            </span>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-0.5">
        <h3 className="font-bold text-white text-sm leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">
          {isRTL ? movie.title_ar : movie.title}
        </h3>
        {isRTL && (
          <p className="text-gray-600 text-[11px] truncate">{movie.title}</p>
        )}
        <p className="text-gray-500 text-xs truncate">{movie.director} · {movie.year}</p>
        <div className="mt-auto pt-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 flex items-center gap-0.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {movie.imdb_rating}
            </span>
            <span className={`font-semibold ${movie.rotten_tomatoes >= 75 ? 'text-green-400' : movie.rotten_tomatoes >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              🍅 {movie.rotten_tomatoes}%
            </span>
          </div>
          <StarRating movieSlug={movie.slug} size="sm" />
        </div>
      </div>
    </Link>
  )
}
