import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getMovies } from '@/lib/movies'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS, LOCALES, type Genre } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; genre: string }> }

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    GENRE_KEYS.map((genre) => ({ locale, genre }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, genre } = await params
  const tg = await getTranslations('genres')
  const tt = await getTranslations('genreTop')
  const genreName = tg(genre as Genre)
  const title = `${tt('titlePrefix')} ${genreName}`
  return {
    title,
    description: `${title} — ${tt('subtitle')}`,
    openGraph: { title, type: 'website' },
  }
}

function GenreTopJsonLd({ genre, movies, locale }: { genre: string; movies: ReturnType<typeof getMovies>; locale: string }) {
  const isAr = locale === 'ar'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Top ${genre} Films`,
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

const MEDAL = ['🥇', '🥈', '🥉']

export default async function GenreTopPage({ params }: Props) {
  const { locale, genre } = await params
  if (!GENRE_KEYS.includes(genre as Genre)) notFound()

  const genreKey = genre as Genre
  const movies = getMovies({ genre, sort: 'rating' })

  const t = await getTranslations('home')
  const tg = await getTranslations('genres')
  const tt = await getTranslations('genreTop')
  const tm = await getTranslations('movie')

  const genreName = tg(genreKey)
  const pageTitle = `${tt('titlePrefix')} ${genreName}`

  return (
    <>
      <GenreTopJsonLd genre={genre} movies={movies} locale={locale} />
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: genreName, url: `https://cinereview-mu.vercel.app/${locale}/genre/${genre}` },
        { name: tt('topLabel'), url: `https://cinereview-mu.vercel.app/${locale}/genre/${genre}/top` },
      ]} />
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{tm('breadcrumbHome')}</Link>
          <span>/</span>
          <Link href={`/${locale}/genre/${genre}`} className="hover:text-white transition-colors">{genreName}</Link>
          <span>/</span>
          <span className="text-white">{tt('topLabel')}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-lg font-bold mb-4 ${GENRE_COLORS[genreKey]}`}>
            {GENRE_ICONS[genreKey]} {genreName}
          </div>
          <h1 className="text-3xl font-black text-white mb-1">🏆 {pageTitle}</h1>
          <p className="text-gray-500">{movies.length} {t('filmsUnit')} · {tt('subtitle')}</p>
        </div>

        {/* Genre switcher */}
        <div className="flex flex-wrap gap-2 mb-8">
          {GENRE_KEYS.map((g) => (
            <Link
              key={g}
              href={`/${locale}/genre/${g}/top`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1 ${
                g === genreKey
                  ? `${GENRE_COLORS[g]} font-bold`
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'
              }`}
            >
              {GENRE_ICONS[g]} {tg(g)}
            </Link>
          ))}
        </div>

        {/* Top 3 podium */}
        {movies.length >= 3 && (
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {movies.slice(0, 3).map((movie, i) => {
              const title = locale === 'ar' ? movie.title_ar : movie.title
              return (
                <Link
                  key={movie.slug}
                  href={`/${locale}/movies/${movie.slug}`}
                  className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-transform hover:-translate-y-1 ${
                    i === 0 ? 'bg-amber-500/10 border-amber-500/40' :
                    i === 1 ? 'bg-gray-400/10 border-gray-400/30' :
                    'bg-amber-700/10 border-amber-700/30'
                  }`}
                >
                  <span className="text-4xl mb-2">{MEDAL[i]}</span>
                  <p className="text-white font-bold text-sm mb-1 line-clamp-2">{title}</p>
                  <p className="text-gray-500 text-xs">{movie.year}</p>
                  <span className={`mt-2 text-lg font-black ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-gray-300' : 'text-amber-600'}`}>
                    {movie.rating_overall}
                  </span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Full ranked list */}
        {movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">{GENRE_ICONS[genreKey]}</div>
            <p>{t('noFilmsGenre')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, i) => (
              <div key={movie.slug} className="relative">
                <div className={`absolute top-2 start-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                  ${i === 0 ? 'bg-amber-500 text-gray-950' : i === 1 ? 'bg-gray-400 text-gray-950' : i === 2 ? 'bg-amber-700 text-white' : 'bg-gray-700 text-gray-300'}`}>
                  {i + 1}
                </div>
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
