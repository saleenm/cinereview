import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import Link from 'next/link'
import { getMovies } from '@/lib/movies'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS } from '@/lib/types'
import AdUnit from '@/components/AdUnit'

interface Props { params: Promise<{ locale: string }>; searchParams: Promise<{ genre?: string; sort?: string; decade?: string }> }

const DECADES = ['1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020']

export default async function MoviesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { genre: qGenre, sort: qSort, decade: qDecade } = await searchParams
  const t = await getTranslations('home')
  const tg = await getTranslations('genres')

  const activeGenre = qGenre || 'all'
  const activeSort = (qSort as any) || 'rating'
  const activeDecade = qDecade || 'all'

  const movies = getMovies({
    genre: activeGenre === 'all' ? undefined : activeGenre,
    sort: activeSort,
    decade: activeDecade === 'all' ? undefined : activeDecade,
  })

  const sortOptions = [
    { value: 'rating', label: t('topRatedTitle') },
    { value: 'year', label: t('newestSort') },
  ]

  function buildUrl(params: Record<string, string>) {
    const merged = {
      ...(activeGenre !== 'all' ? { genre: activeGenre } : {}),
      ...(activeSort !== 'rating' ? { sort: activeSort } : {}),
      ...(activeDecade !== 'all' ? { decade: activeDecade } : {}),
      ...params,
    }
    const qs = Object.entries(merged).filter(([, v]) => v && v !== 'all').map(([k, v]) => `${k}=${v}`).join('&')
    return `/${locale}/movies${qs ? '?' + qs : ''}`
  }

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            🎞️ {t('allFilms')}
          </h1>
          <p className="text-gray-500">{movies.length} {t('filmsUnit')}</p>
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link
            href={buildUrl({ genre: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              activeGenre === 'all'
                ? 'bg-amber-500 text-gray-950 border-amber-500'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            {tg('all')}
          </Link>
          {GENRE_KEYS.map((g) => (
            <Link
              key={g}
              href={buildUrl({ genre: g })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border flex items-center gap-1.5 ${
                activeGenre === g
                  ? `${GENRE_COLORS[g]} font-bold`
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              {GENRE_ICONS[g]} {tg(g)}
            </Link>
          ))}
        </div>

        {/* Decade Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-gray-500 text-sm self-center">{t('decade')}:</span>
          <Link
            href={buildUrl({ decade: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              activeDecade === 'all'
                ? 'bg-gray-600 text-white border-gray-500'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            {tg('all')}
          </Link>
          {DECADES.map((d) => (
            <Link
              key={d}
              href={buildUrl({ decade: d })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                activeDecade === d
                  ? 'bg-gray-600 text-white border-gray-500'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              {d}s
            </Link>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-gray-500 text-sm">{t('sortBy')}:</span>
          {sortOptions.map((s) => (
            <Link
              key={s.value}
              href={buildUrl({ sort: s.value })}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                activeSort === s.value
                  ? 'bg-gray-700 text-white font-semibold'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((m) => (
              <MovieCard key={m.slug} movie={m} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🎬</div>
            <p>{t('noFilms')}</p>
          </div>
        )}
        <AdUnit slot="0987654321" format="horizontal" className="mt-8" />
      </main>
      <Footer locale={locale} />
    </>
  )
}
