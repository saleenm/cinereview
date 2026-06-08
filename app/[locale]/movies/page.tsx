import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import Link from 'next/link'
import { getMovies } from '@/lib/movies'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS } from '@/lib/types'
import AdUnit from '@/components/AdUnit'

const BASE = 'https://cinereview-mu.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  const top = getMovies({ sort: 'rating', limit: 1 })[0]
  const ogImage = top?.backdrop_url || `${BASE}/logos/icon-512.png`
  const title = isAr ? 'جميع الأفلام | سينيريفيو' : 'All Movies | CineReview'
  const description = isAr ? 'تصفّح 1000+ فيلم مع فلاتر النوع والتقييم والعقد الزمني' : 'Browse 1000+ movies with genre, rating, and decade filters'
  return {
    title, description,
    alternates: { canonical: `${BASE}/${locale}/movies` },
    openGraph: { title, description, images: [{ url: ogImage, width: 1280, height: 720 }], siteName: 'CineReview' },
    twitter: { card: 'summary_large_image', title, images: [ogImage] },
  }
}

const PER_PAGE = 48

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ genre?: string; sort?: string; decade?: string; rating?: string; lang?: string; page?: string }>
}

const DECADES = ['1940','1950','1960','1970','1980','1990','2000','2010','2020']
const RATING_OPTIONS = [{ value: '7', label: '7+' }, { value: '8', label: '8+' }, { value: '9', label: '9+' }]
const LANG_OPTIONS = [
  { value: 'en', flag: '🇺🇸', label: 'English' },
  { value: 'ko', flag: '🇰🇷', label: '한국어' },
  { value: 'ja', flag: '🇯🇵', label: '日本語' },
  { value: 'ar', flag: '🇸🇦', label: 'عربي' },
  { value: 'fr', flag: '🇫🇷', label: 'Français' },
  { value: 'it', flag: '🇮🇹', label: 'Italiano' },
  { value: 'tr', flag: '🇹🇷', label: 'Türkçe' },
]

export default async function MoviesPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { genre: qGenre, sort: qSort, decade: qDecade, rating: qRating, lang: qLang, page: qPage } = await searchParams
  const t = await getTranslations('home')
  const tg = await getTranslations('genres')
  const tf = await getTranslations('filter')

  const activeGenre  = qGenre  || 'all'
  const activeSort   = (qSort as any) || 'rating'
  const activeDecade = qDecade || 'all'
  const activeRating = qRating || 'all'
  const activeLang   = qLang   || 'all'
  const activePage   = Math.max(1, parseInt(qPage || '1'))

  const allFiltered = getMovies({
    genre:     activeGenre  !== 'all' ? activeGenre  : undefined,
    sort:      activeSort,
    decade:    activeDecade !== 'all' ? activeDecade : undefined,
    minRating: activeRating !== 'all' ? parseFloat(activeRating) : undefined,
    language:  activeLang   !== 'all' ? activeLang   : undefined,
  })
  const totalPages = Math.ceil(allFiltered.length / PER_PAGE)
  const movies = allFiltered.slice((activePage - 1) * PER_PAGE, activePage * PER_PAGE)

  const activeFiltersCount = [
    activeGenre  !== 'all',
    activeDecade !== 'all',
    activeRating !== 'all',
    activeLang   !== 'all',
    activeSort   !== 'rating',
  ].filter(Boolean).length

  function buildUrl(p: Record<string, string>) {
    const merged = {
      ...(activeGenre  !== 'all'    ? { genre:  activeGenre  } : {}),
      ...(activeSort   !== 'rating' ? { sort:   activeSort   } : {}),
      ...(activeDecade !== 'all'    ? { decade: activeDecade } : {}),
      ...(activeRating !== 'all'    ? { rating: activeRating } : {}),
      ...(activeLang   !== 'all'    ? { lang:   activeLang   } : {}),
      ...p,
    }
    const qs = Object.entries(merged)
      .filter(([, v]) => v && v !== 'all' && v !== '1')
      .map(([k, v]) => `${k}=${v}`).join('&')
    return `/${locale}/movies${qs ? '?' + qs : ''}`
  }

  const isRTL = locale === 'ar'

  const BASE = 'https://cinereview-mu.vercel.app'
  const moviesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Movies',
    url: `${BASE}/${locale}/movies`,
    numberOfItems: allFiltered.length,
    itemListElement: movies.slice(0, 50).map((m, i) => ({
      '@type': 'ListItem',
      position: (activePage - 1) * PER_PAGE + i + 1,
      url: `${BASE}/${locale}/movies/${m.slug}`,
      name: m.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(moviesSchema) }} />
      <Header locale={locale} />
      <main className="min-h-screen" style={{ background: '#030712' }}>

        {/* ── Page Header ── */}
        <div className="border-b border-gray-800/50" style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
                  <h1 className="text-3xl font-black text-white">{t('allFilms')}</h1>
                </div>
                <p className="text-gray-500 text-sm ms-3">
                  <span className="text-amber-400 font-bold">{allFiltered.length}</span> {t('filmsUnit')}
                  {activeFiltersCount > 0 && (
                    <span className="ms-2 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-semibold border border-amber-500/25">
                      {activeFiltersCount} {isRTL ? 'فلتر نشط' : 'active filters'}
                    </span>
                  )}
                </p>
              </div>
              {/* Reset */}
              {activeFiltersCount > 0 && (
                <Link href={`/${locale}/movies`}
                  className="px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-700/60 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-all flex items-center gap-2">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  {isRTL ? 'إعادة ضبط' : 'Reset filters'}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">

          {/* ── FILTER PANEL ── */}
          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-5 mb-7 space-y-4">

            {/* Genre row */}
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                {isRTL ? 'النوع' : 'Genre'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Link href={buildUrl({ genre: 'all', page: '1' })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    activeGenre === 'all'
                      ? 'bg-amber-500 text-gray-950 border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white hover:border-gray-600'
                  }`}>
                  {tg('all')}
                </Link>
                {GENRE_KEYS.map((g) => (
                  <Link key={g} href={buildUrl({ genre: g, page: '1' })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                      activeGenre === g
                        ? `${GENRE_COLORS[g]} shadow-lg`
                        : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white hover:border-gray-600'
                    }`}>
                    {GENRE_ICONS[g]} {tg(g)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Decade + Rating + Language + Sort — 2-col on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-gray-800/40">

              {/* Decade */}
              <div>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2.5">
                  {t('decade')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <Link href={buildUrl({ decade: 'all', page: '1' })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      activeDecade === 'all'
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white hover:border-gray-600'
                    }`}>{tg('all')}</Link>
                  {DECADES.map((d) => (
                    <Link key={d} href={buildUrl({ decade: d, page: '1' })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        activeDecade === d
                          ? 'bg-gray-600 text-white border-gray-500'
                          : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white hover:border-gray-600'
                      }`}>{d}s</Link>
                  ))}
                </div>
              </div>

              {/* Rating + Language + Sort */}
              <div className="space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest w-20 flex-shrink-0">
                    {tf('minRating')}
                  </p>
                  <div className="flex gap-1.5">
                    <Link href={buildUrl({ rating: 'all', page: '1' })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        activeRating === 'all'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white'
                      }`}>{tg('all')}</Link>
                    {RATING_OPTIONS.map((r) => (
                      <Link key={r.value} href={buildUrl({ rating: r.value, page: '1' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-0.5 ${
                          activeRating === r.value
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white'
                        }`}>
                        <svg width="9" height="9" fill="currentColor" viewBox="0 0 24 24" className="text-amber-400"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        {r.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest w-20 flex-shrink-0">
                    {tf('language')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <Link href={buildUrl({ lang: 'all', page: '1' })}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                        activeLang === 'all'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                          : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white'
                      }`}>{tg('all')}</Link>
                    {LANG_OPTIONS.map((l) => (
                      <Link key={l.value} href={buildUrl({ lang: l.value, page: '1' })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          activeLang === l.value
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                            : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white'
                        }`}>{l.flag} {l.label}</Link>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest w-20 flex-shrink-0">
                    {t('sortBy')}
                  </p>
                  <div className="flex gap-1.5">
                    <Link href={buildUrl({ sort: 'rating', page: '1' })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                        activeSort === 'rating'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white'
                      }`}>
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {t('topRatedTitle')}
                    </Link>
                    <Link href={buildUrl({ sort: 'year', page: '1' })}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1 ${
                        activeSort === 'year'
                          ? 'bg-gray-700 text-white border-gray-600'
                          : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:text-white'
                      }`}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                      {t('newestSort')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── MOVIE GRID ── */}
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((m) => (
                <MovieCard key={m.slug} movie={m} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-500">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-600">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M7 4v16M17 4v16M2 9h5m10 0h5M2 15h5m10 0h5"/>
                </svg>
              </div>
              <p className="text-lg font-semibold">{t('noFilms')}</p>
              <Link href={`/${locale}/movies`} className="mt-4 inline-block text-amber-400 hover:text-amber-300 text-sm transition-colors">
                {isRTL ? 'عرض جميع الأفلام' : 'Show all films'} →
              </Link>
            </div>
          )}

          <AdUnit slot="0987654321" format="horizontal" className="mt-8 rounded-xl overflow-hidden" />

          {/* ── PAGINATION ── */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              {/* Prev */}
              <Link href={activePage > 1 ? buildUrl({ page: String(activePage - 1) }) : '#'}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${
                  activePage > 1
                    ? 'bg-gray-800/80 text-gray-300 border-gray-700/60 hover:bg-gray-700 hover:text-white'
                    : 'opacity-30 pointer-events-none bg-gray-900 text-gray-600 border-gray-800'
                }`}>
                {isRTL ? '›' : '‹'}
              </Link>

              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                const p = activePage <= 4
                  ? i + 1
                  : activePage >= totalPages - 3
                  ? totalPages - 6 + i
                  : activePage - 3 + i
                if (p < 1 || p > totalPages) return null
                return (
                  <Link key={p} href={buildUrl({ page: String(p) })}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${
                      activePage === p
                        ? 'bg-amber-500 text-gray-950 border-amber-500 shadow-lg shadow-amber-500/25'
                        : 'bg-gray-800/80 text-gray-400 border-gray-700/60 hover:bg-gray-700 hover:text-white'
                    }`}>{p}</Link>
                )
              })}

              {/* Next */}
              <Link href={activePage < totalPages ? buildUrl({ page: String(activePage + 1) }) : '#'}
                className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-all border ${
                  activePage < totalPages
                    ? 'bg-gray-800/80 text-gray-300 border-gray-700/60 hover:bg-gray-700 hover:text-white'
                    : 'opacity-30 pointer-events-none bg-gray-900 text-gray-600 border-gray-800'
                }`}>
                {isRTL ? '‹' : '›'}
              </Link>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <p className="text-center text-xs text-gray-600 mt-3">
              {isRTL
                ? `صفحة ${activePage} من ${totalPages}`
                : `Page ${activePage} of ${totalPages}`}
            </p>
          )}

        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
