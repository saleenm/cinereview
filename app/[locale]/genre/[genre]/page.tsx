import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import Link from 'next/link'
import { getMovies } from '@/lib/movies'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS, type Genre } from '@/lib/types'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; genre: string }> }

export async function generateStaticParams() {
  return ['ar','en','fr','es','tr','de','ja','pt'].flatMap((locale) =>
    [...GENRE_KEYS, 'all'].map((genre) => ({ locale, genre }))
  )
}

export default async function GenrePage({ params }: Props) {
  const { locale, genre } = await params
  const t = await getTranslations('home')
  const tg = await getTranslations('genres')
  const tt = await getTranslations('genreTop')

  const isAll = genre === 'all'
  if (!isAll && !GENRE_KEYS.includes(genre as Genre)) notFound()

  const movies = isAll ? getMovies() : getMovies({ genre })
  const genreKey = genre as Genre
  const genreName = isAll ? tg('all') : tg(genreKey)

  return (
    <>
      {!isAll && (
        <BreadcrumbJsonLd crumbs={[
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
          { name: genreName, url: `https://cinereview-mu.vercel.app/${locale}/genre/${genre}` },
        ]} />
      )}
      <Header locale={locale} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            {!isAll && (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-lg font-bold mb-4 ${GENRE_COLORS[genreKey]}`}>
                {GENRE_ICONS[genreKey]} {tg(genreKey)}
              </div>
            )}
            <h1 className="text-3xl font-black text-white">
              {isAll ? t('allFilms') : tg(genreKey)}
            </h1>
            <p className="text-gray-500 mt-1">{movies.length} {t('filmsUnit')}</p>
          </div>
          {!isAll && (
            <Link
              href={`/${locale}/genre/${genre}/top`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm font-bold"
            >
              🏆 {tt('topLabel')}
            </Link>
          )}
        </div>

        {/* Genre tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href={`/${locale}/genre/all`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${isAll ? 'bg-amber-500 text-gray-950 border-amber-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'}`}>
            {tg('all')}
          </Link>
          {GENRE_KEYS.map((g) => (
            <Link key={g} href={`/${locale}/genre/${g}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors flex items-center gap-1 ${genre === g ? `${GENRE_COLORS[g]} font-bold` : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'}`}>
              {GENRE_ICONS[g]} {tg(g)}
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
            <div className="text-5xl mb-4">{GENRE_ICONS[genreKey]}</div>
            <p>{t('noFilmsGenre')}</p>
            <Link href={`/${locale}/movies`} className="mt-4 inline-block text-amber-400 hover:underline text-sm">
              {t('viewAllFilms')}
            </Link>
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
