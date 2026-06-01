import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import Link from 'next/link'
import { getMovies } from '@/lib/movies'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS } from '@/lib/types'
import AdUnit from '@/components/AdUnit'

const PER_PAGE = 48

interface Props { params: Promise<{ locale: string }>; searchParams: Promise<{ genre?: string; sort?: string; decade?: string; rating?: string; lang?: string; page?: string }> }

const DECADES = ['1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020']

const RATING_OPTIONS = [
  { value: '7', label: '7+' },
  { value: '8', label: '8+' },
  { value: '9', label: '9+' },
]

const LANG_OPTIONS = [
  { value: 'en', flag: '🇺🇸' },
  { value: 'ko', flag: '🇰🇷' },
  { value: 'ja', flag: '🇯🇵' },
  { value: 'ar', flag: '🇸🇦' },
  { value: 'fr', flag: '🇫🇷' },
  { value: 'it', flag: '🇮🇹' },
  { value: 'tr', flag: '🇹🇷' },
]

export default async function MoviesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { genre: qGenre, sort: qSort, decade: qDecade, rating: qRating, lang: qLang, page: qPage } = await searchParams
  const t = await getTranslations('home')
  const tg = await getTranslations('genres')
  const tf = await getTranslations('filter')

  const activeGenre = qGenre || 'all'
  const activeSort = (qSort as any) || 'rating'
  const activeDecade = qDecade || 'all'
  const activeRating = qRating || 'all'
  const activeLang = qLang || 'all'
  const activePage = Math.max(1, parseInt(qPage || '1'))

  const allFiltered = getMovies({
    genre: activeGenre === 'all' ? undefined : activeGenre,
    sort: activeSort,
    decade: activeDecade === 'all' ? undefined : activeDecade,
    minRating: activeRating !== 'all' ? parseFloat(activeRating) : undefined,
    language: activeLang === 'all' ? undefined : activeLang,
  })
  const totalPages = Math.ceil(allFiltered.length / PER_PAGE)
  const movies = allFiltered.slice((activePage - 1) * PER_PAGE, activePage * PER_PAGE)

  const sortOptions = [
    { value: 'rating', label: t('topRatedTitle') },
    { value: 'year', label: t('newestSort') },
  ]

  function buildUrl(params: Record<string, string>) {
    const merged = {
      ...(activeGenre !== 'all' ? { genre: activeGenre } : {}),
      ...(activeSort !== 'rating' ? { sort: activeSort } : {}),
      ...(activeDecade !== 'all' ? { decade: activeDecade } : {}),
      ...(activeRating !== 'all' ? { rating: activeRating } : {}),
      ...(activeLang !== 'all' ? { lang: activeLang } : {}),
      ...params,
    }
    const qs = Object.entries(merged).filter(([, v]) => v && v !== 'all' && v !== '1').map(([k, v]) => `${k}=${v}`).join('&')
    return `/${locale}/movies${qs ? '?' + qs : ''}`
  }
  const isRTL = locale === 'ar'

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-2">
            🎞️ {t('allFilms')}
          </h1>
          <p className="text-gray-500">{allFiltered.length} {t('filmsUnit')}</p>
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

        {/* Rating Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-gray-500 text-sm self-center">{tf('minRating')}:</span>
          <Link
            href={buildUrl({ rating: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              activeRating === 'all'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            {tg('all')}
          </Link>
          {RATING_OPTIONS.map((r) => (
            <Link
              key={r.value}
              href={buildUrl({ rating: r.value })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                activeRating === r.value
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              ⭐ {r.label}
            </Link>
          ))}
        </div>

        {/* Language Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-gray-500 text-sm self-center">{tf('language')}:</span>
          <Link
            href={buildUrl({ lang: 'all' })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              activeLang === 'all'
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            {tg('all')}
          </Link>
          {LANG_OPTIONS.map((l) => (
            <Link
              key={l.value}
              href={buildUrl({ lang: l.value })}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                activeLang === l.value
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              {l.flag} {tf(l.value)}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            {activePage > 1 && (
              <Link href={buildUrl({ page: String(activePage - 1) })}
                className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm">
                {isRTL ? '→' : '←'}
              </Link>
            )}
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const p = activePage <= 4 ? i + 1 : activePage >= totalPages - 3 ? totalPages - 6 + i : activePage - 3 + i
              if (p < 1 || p > totalPages) return null
              return (
                <Link key={p} href={buildUrl({ page: String(p) })}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${activePage === p ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {p}
                </Link>
              )
            })}
            {activePage < totalPages && (
              <Link href={buildUrl({ page: String(activePage + 1) })}
                className="px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors text-sm">
                {isRTL ? '←' : '→'}
              </Link>
            )}
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
