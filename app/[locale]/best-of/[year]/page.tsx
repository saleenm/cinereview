import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getMoviesByYear, getAvailableYears } from '@/lib/movies'
import { LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import AdUnit from '@/components/AdUnit'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; year: string }> }

export async function generateStaticParams() {
  const years = getAvailableYears()
  return LOCALES.flatMap((locale) => years.map((year) => ({ locale, year: String(year) })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, year } = await params
  const t = await getTranslations('bestOf')
  const title = `${t('title')} ${year}`
  const movies = getMoviesByYear(parseInt(year))
  const topPoster = movies[0]?.backdrop_url || movies[0]?.poster_url
  return {
    title,
    description: `${title} — ${t('subtitle')}`,
    openGraph: {
      title,
      type: 'website',
      ...(topPoster ? { images: [{ url: topPoster }] } : {}),
    },
  }
}

function BestOfJsonLd({ year, movies, locale }: { year: string; movies: ReturnType<typeof getMoviesByYear>; locale: string }) {
  const isAr = locale === 'ar'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best Films of ${year}`,
    numberOfItems: movies.length,
    itemListElement: movies.slice(0, 10).map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Movie',
        name: isAr ? m.title_ar : m.title,
        dateCreated: String(m.year),
        url: `https://cinereview-mu.vercel.app/${locale}/movies/${m.slug}`,
        aggregateRating: { '@type': 'AggregateRating', ratingValue: m.rating_overall, bestRating: 10 },
      },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default async function BestOfYearPage({ params }: Props) {
  const { locale, year } = await params
  const yearNum = parseInt(year)
  if (isNaN(yearNum)) notFound()

  const movies = getMoviesByYear(yearNum)
  const t = await getTranslations('bestOf')
  const tm = await getTranslations('movie')
  const isRTL = locale === 'ar'

  const allYears = getAvailableYears()
  const currentIndex = allYears.indexOf(yearNum)
  const prevYear = allYears[currentIndex + 1]
  const nextYear = allYears[currentIndex - 1]

  return (
    <>
      <BestOfJsonLd year={year} movies={movies} locale={locale} />
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: locale === 'ar' ? 'حسب السنة' : 'By Year', url: `https://cinereview-mu.vercel.app/${locale}/best-of` },
        { name: year, url: `https://cinereview-mu.vercel.app/${locale}/best-of/${year}` },
      ]} />
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{tm('breadcrumbHome')}</Link>
          <span>/</span>
          <Link href={`/${locale}/best-of`} className="hover:text-white transition-colors">{t('backToYears')}</Link>
          <span>/</span>
          <span className="text-white">{year}</span>
        </nav>

        {/* Stats bar */}
        {movies.length > 0 && (() => {
          const avg = (movies.reduce((s, m) => s + m.rating_overall, 0) / movies.length).toFixed(1)
          const topGenres = Object.entries(
            movies.flatMap(m => m.genres).reduce((acc: Record<string, number>, g) => { acc[g] = (acc[g] || 0) + 1; return acc }, {})
          ).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g]) => g)
          return (
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-amber-400">{movies.length}</div>
                <div className="text-gray-500 text-xs mt-1">{isRTL ? 'فيلم' : 'Films'}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-green-400">⭐ {avg}</div>
                <div className="text-gray-500 text-xs mt-1">{isRTL ? 'متوسط التقييم' : 'Avg Rating'}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                <div className="text-sm font-bold text-blue-400 leading-tight">{topGenres.join(' · ')}</div>
                <div className="text-gray-500 text-xs mt-1">{isRTL ? 'أبرز الأنواع' : 'Top Genres'}</div>
              </div>
            </div>
          )
        })()}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">📅 {t('title')} {year}</h1>
            <p className="text-gray-500">{movies.length} {isRTL ? 'فيلم' : 'films'} · {t('subtitle')}</p>
          </div>
          {/* Year navigation */}
          <div className="flex gap-2">
            {prevYear && (
              <Link href={`/${locale}/best-of/${prevYear}`}
                className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors">
                ← {prevYear}
              </Link>
            )}
            {nextYear && (
              <Link href={`/${locale}/best-of/${nextYear}`}
                className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:text-white text-sm transition-colors">
                {nextYear} →
              </Link>
            )}
          </div>
        </div>

        {/* Ad */}
        <AdUnit slot="5678901234" format="horizontal" className="rounded-xl overflow-hidden mb-8" />

        {movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📅</div>
            <p>{t('noFilms')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, i) => (
              <div key={movie.slug} className="relative">
                {i < 3 && (
                  <div className={`absolute top-2 start-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                    ${i === 0 ? 'bg-amber-500 text-gray-950' : i === 1 ? 'bg-gray-400 text-gray-950' : 'bg-amber-700 text-white'}`}>
                    {i + 1}
                  </div>
                )}
                <MovieCard movie={movie} locale={locale} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
