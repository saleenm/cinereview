import Link from 'next/link'
import Image from 'next/image'
import { Movie } from '@/lib/types'
import { GENRE_ICONS, GENRE_COLORS } from '@/lib/types'
import { getMovieDescription } from '@/lib/movies'

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

export default function MovieCard({ movie, locale, variant = 'default' }: Props) {
  const href = `/${locale}/movies/${movie.slug}`
  const desc = getMovieDescription(movie, locale)
  const isRTL = locale === 'ar'
  const primaryGenre = movie.genres[0]

  if (variant === 'featured') {
    return (
      <Link href={href} className="group relative block rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10">
        <div className="relative h-56">
          <Image
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
        <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden">
          <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" sizes="48px" />
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

  return (
    <Link href={href} className="group flex flex-col rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5">
      <div className="relative h-64">
        <Image
          src={movie.poster_url}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-2 start-2">
          <RatingBadge value={movie.rating_overall} />
        </div>
        {movie.is_featured && (
          <div className="absolute top-2 end-2">
            <span className="bg-amber-500 text-gray-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">
              {isRTL ? 'مميز' : 'Featured'}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genres.slice(0, 2).map((g) => (
            <span key={g} className={`text-[10px] px-2 py-0.5 rounded-full border ${GENRE_COLORS[g]}`}>
              {GENRE_ICONS[g]}
            </span>
          ))}
        </div>
        <h3 className="font-bold text-white leading-tight mb-1 group-hover:text-amber-400 transition-colors line-clamp-1">
          {isRTL ? movie.title_ar : movie.title}
        </h3>
        {isRTL && (
          <p className="text-gray-500 text-xs mb-1">{movie.title}</p>
        )}
        <p className="text-gray-500 text-xs mb-3">{movie.director} · {movie.year}</p>
        <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
          <span>IMDb {movie.imdb_rating}</span>
          <span>🍅 {movie.rotten_tomatoes}%</span>
        </div>
      </div>
    </Link>
  )
}
