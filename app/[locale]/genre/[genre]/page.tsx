import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import Link from 'next/link'
import { getMovies } from '@/lib/movies'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS, type Genre } from '@/lib/types'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import VPNBanner from '@/components/VPNBanner'
import AdUnit from '@/components/AdUnit'

interface Props { params: Promise<{ locale: string; genre: string }> }

const BASE = 'https://cinereview-mu.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, genre } = await params
  const isAr = locale === 'ar'
  const movies = genre === 'all' ? getMovies({ sort: 'rating', limit: 1 }) : getMovies({ genre, sort: 'rating', limit: 1 })
  const ogImage = movies[0]?.backdrop_url || movies[0]?.poster_url || `${BASE}/logos/icon-512.png`
  const genreLabel = genre === 'all' ? (isAr ? 'كل الأنواع' : 'All Genres') : genre
  const title = isAr ? `أفلام ${genreLabel} | سينيريفيو` : `${genreLabel} Movies | CineReview`
  const description = isAr
    ? `اكتشف أفضل أفلام ${genreLabel} مع تقييمات تفصيلية`
    : `Discover the best ${genreLabel} movies with detailed reviews`
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/genre/${genre}`,
      languages: {
        ...Object.fromEntries(['ar','en','fr','es','tr','de','ja','pt'].map((l) => [l, `${BASE}/${l}/genre/${genre}`])),
        'x-default': `${BASE}/ar/genre/${genre}`,
      },
    },
    openGraph: { title, description, images: [{ url: ogImage, width: 1280, height: 720 }], siteName: 'CineReview' },
    twitter: { card: 'summary_large_image', title, images: [ogImage] },
  }
}

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
  const isRTL = locale === 'ar'
  const topMovie = movies[0]

  const faqSchema = !isAll ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isRTL ? `ما هو أفضل فيلم ${genreName}؟` : `What is the best ${genreName} movie?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: topMovie
            ? (isRTL
                ? `أفضل فيلم ${genreName} هو "${topMovie.title_ar || topMovie.title}" بتقييم ${topMovie.rating_overall}/10`
                : `The best ${genreName} movie is "${topMovie.title}" with a rating of ${topMovie.rating_overall}/10`)
            : (isRTL ? 'لا توجد أفلام في هذا التصنيف بعد.' : 'No movies in this genre yet.'),
        },
      },
      {
        '@type': 'Question',
        name: isRTL ? `كم عدد أفلام ${genreName} على سينيريفيو؟` : `How many ${genreName} movies are on CineReview?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isRTL
            ? `يضم سينيريفيو ${movies.length} فيلم ${genreName} مع تقييمات تفصيلية.`
            : `CineReview features ${movies.length} ${genreName} movies with detailed reviews.`,
        },
      },
    ],
  } : null

  return (
    <>
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      {!isAll && (
        <BreadcrumbJsonLd crumbs={[
          { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
          { name: genreName, url: `https://cinereview-mu.vercel.app/${locale}/genre/${genre}` },
        ]} />
      )}
      <Header locale={locale} />
      <main style={{ background: '#030712' }}>
        {/* Hero */}
        <section className="border-b border-gray-800/50"
          style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 55%), #0a0e17' }}>
          <div className="max-w-7xl mx-auto px-4 py-10">
            {!isAll ? (
              <>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-4 ${GENRE_COLORS[genreKey]}`}>
                  {GENRE_ICONS[genreKey]} {tg(genreKey)}
                </div>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{tg(genreKey)}</h1>
                    <p className="text-gray-500 text-sm">{movies.length} {t('filmsUnit')}</p>
                  </div>
                  <Link
                    href={`/${locale}/genre/${genre}/top`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm font-bold"
                  >
                    <svg width="13" height="13" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {tt('topLabel')}
                  </Link>
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{t('allFilms')}</h1>
                <p className="text-gray-500 text-sm">{movies.length} {t('filmsUnit')}</p>
              </div>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Genre tabs */}
          <div className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-800/50">
            <Link href={`/${locale}/genre/all`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${isAll ? 'bg-amber-500 text-gray-950 border-amber-500' : 'bg-gray-900/80 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'}`}>
              {tg('all')}
            </Link>
            {GENRE_KEYS.map((g) => (
              <Link key={g} href={`/${locale}/genre/${g}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${genre === g ? `${GENRE_COLORS[g]}` : 'bg-gray-900/80 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'}`}>
                {GENRE_ICONS[g]} {tg(g)}
              </Link>
            ))}
          </div>

          {/* Grid */}
          {movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((m) => (
                <MovieCard key={m.slug} movie={m} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 text-gray-500">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                {!isAll && GENRE_ICONS[genreKey]}
              </div>
              <p className="text-lg font-semibold text-gray-400 mb-2">{t('noFilmsGenre')}</p>
              <Link href={`/${locale}/movies`} className="mt-4 inline-block text-amber-400 hover:underline text-sm">
                {t('viewAllFilms')}
              </Link>
            </div>
          )}
          <div className="mt-10 max-w-4xl mx-auto space-y-6">
            <AdUnit slot="3456789012" format="horizontal" className="rounded-xl overflow-hidden" />
            <VPNBanner locale={locale} variant="compact" />
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
