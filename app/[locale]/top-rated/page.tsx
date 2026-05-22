import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RatingCircle from '@/components/RatingCircle'
import { getMovies } from '@/lib/movies'
import { GENRE_ICONS, GENRE_COLORS } from '@/lib/types'

interface Props { params: Promise<{ locale: string }> }

export default async function TopRatedPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('topRated')
  const tm = await getTranslations('movie')
  const tg = await getTranslations('genres')
  const isRTL = locale === 'ar'

  const movies = getMovies({ sort: 'rating' })

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-black text-white mb-2">{t('title')}</h1>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>

        {/* List */}
        <div className="space-y-3">
          {movies.map((movie, i) => (
            <Link key={movie.slug} href={`/${locale}/movies/${movie.slug}`}
              className="group flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/5">

              {/* Rank */}
              <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full font-black text-lg
                ${i === 0 ? 'bg-amber-500 text-gray-950' : i === 1 ? 'bg-gray-400 text-gray-950' : i === 2 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-500'}`}>
                {i + 1}
              </div>

              {/* Poster */}
              <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" sizes="48px" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <h2 className="font-bold text-white group-hover:text-amber-400 transition-colors truncate">
                    {isRTL ? movie.title_ar : movie.title}
                  </h2>
                  {movie.genres.slice(0, 1).map((g) => (
                    <span key={g} className={`text-[10px] px-2 py-0.5 rounded-full border hidden sm:inline ${GENRE_COLORS[g]}`}>
                      {GENRE_ICONS[g]} {tg(g)}
                    </span>
                  ))}
                </div>
                <p className="text-gray-500 text-xs">{isRTL ? movie.director_ar : movie.director} · {movie.year}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>⭐ IMDb {movie.imdb_rating}</span>
                  <span>🍅 {movie.rotten_tomatoes}%</span>
                  {movie.awards && <span className="hidden md:inline text-amber-600 truncate">🏆 {movie.awards.split('،')[0]}</span>}
                </div>
              </div>

              {/* Rating */}
              <div className="flex-shrink-0">
                <RatingCircle value={movie.rating_overall} size="md" />
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
