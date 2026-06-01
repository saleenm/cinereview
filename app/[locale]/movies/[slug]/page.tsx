import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getMovieBySlug, getAllSlugs, getMovies, getMovieDescription } from '@/lib/movies'
import { GENRE_ICONS, GENRE_COLORS, LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RatingCircle from '@/components/RatingCircle'
import MovieCard from '@/components/MovieCard'
import ReviewSection from '@/components/ReviewSection'
import WatchlistButton from '@/components/WatchlistButton'
import ShareButton from '@/components/ShareButton'
import WhereToWatch from '@/components/WhereToWatch'
import AdUnit from '@/components/AdUnit'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return LOCALES.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const movie = getMovieBySlug(slug)
  if (!movie) return {}
  const title = `${locale === 'ar' ? movie.title_ar : movie.title} (${movie.year})`
  const desc = getMovieDescription(movie, locale).slice(0, 160)
  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'article',
      images: [{ url: movie.poster_url, width: 500, height: 750, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      images: [movie.backdrop_url || movie.poster_url],
    },
  }
}

function RatingBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100
  const color = value >= 8.5 ? 'bg-green-500' : value >= 7 ? 'bg-amber-500' : value >= 5.5 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-3">
      <span className="text-gray-400 text-sm w-28 flex-shrink-0">{label}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-2.5 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-white font-bold text-sm w-8 text-end">{value}</span>
    </div>
  )
}

function MovieJsonLd({ movie, locale }: { movie: ReturnType<typeof getMovieBySlug>; locale: string }) {
  if (!movie) return null
  const title = locale === 'ar' ? movie.title_ar : movie.title
  const description = getMovieDescription(movie, locale).slice(0, 300)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: title,
    alternateName: movie.title,
    description,
    dateCreated: String(movie.year),
    director: { '@type': 'Person', name: movie.director },
    actor: movie.cast.map((name) => ({ '@type': 'Person', name })),
    image: movie.poster_url,
    genre: movie.genres,
    duration: `PT${movie.duration}M`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: movie.rating_overall,
      bestRating: 10,
      worstRating: 0,
      ratingCount: 1,
    },
    ...(movie.trailer_url ? { trailer: { '@type': 'VideoObject', name: `${title} Trailer`, embedUrl: movie.trailer_url } } : {}),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default async function MoviePage({ params }: Props) {
  const { locale, slug } = await params
  const movie = getMovieBySlug(slug)
  if (!movie) notFound()

  const t = await getTranslations('movie')
  const th = await getTranslations('home')
  const tg = await getTranslations('genres')
  const isRTL = locale === 'ar'

  const description = getMovieDescription(movie, locale)
  const title = isRTL ? movie.title_ar : movie.title
  const pros = isRTL ? movie.pros_ar : movie.pros_en
  const cons = isRTL ? movie.cons_ar : movie.cons_en

  const related = getMovies()
    .filter((m) => m.slug !== movie.slug && m.genres.some((g) => movie.genres.includes(g)))
    .sort((a, b) => {
      // Prioritize: same director > same era (±10y) > higher rating
      const sameDir = (a.director === movie.director ? 2 : 0) - (b.director === movie.director ? 2 : 0)
      const eraA = Math.abs(a.year - movie.year) <= 10 ? 1 : 0
      const eraB = Math.abs(b.year - movie.year) <= 10 ? 1 : 0
      return sameDir || (eraB - eraA) || (b.rating_overall - a.rating_overall)
    })
    .slice(0, 6)

  const ratingBreakdown = [
    { label: t('story'), value: movie.rating_story },
    { label: t('acting'), value: movie.rating_acting },
    { label: t('direction'), value: movie.rating_direction },
    { label: t('cinematography'), value: movie.rating_cinematography },
    { label: t('music'), value: movie.rating_music },
  ]

  const rtColor = movie.rotten_tomatoes >= 75 ? 'text-green-400' : movie.rotten_tomatoes >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <>
      <MovieJsonLd movie={movie} locale={locale} />
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: locale === 'ar' ? 'الأفلام' : 'Movies', url: `https://cinereview-mu.vercel.app/${locale}/movies` },
        { name: title, url: `https://cinereview-mu.vercel.app/${locale}/movies/${movie.slug}` },
      ]} />
      <Header locale={locale} />
      <main>
        {/* ── BACKDROP HERO ── */}
        <div className="relative h-80 md:h-96 overflow-hidden">
          <Image
            src={movie.backdrop_url || movie.poster_url}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-950/30" />

          {/* Breadcrumb */}
          <div className="absolute top-4 start-4">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">{t('breadcrumbHome')}</Link>
              <span>/</span>
              <Link href={`/${locale}/movies`} className="hover:text-white transition-colors">{t('breadcrumbMovies')}</Link>
              <span>/</span>
              <span className="text-white">{movie.title}</span>
            </nav>
          </div>

          {/* Genre badges */}
          <div className="absolute bottom-4 start-4 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <Link key={g} href={`/${locale}/genre/${g}`}
                className={`text-xs px-3 py-1 rounded-full border font-medium ${GENRE_COLORS[g]}`}>
                {GENRE_ICONS[g]} {tg(g)}
              </Link>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-16 relative pb-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── LEFT: Poster + Quick Info ── */}
            <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-20 lg:self-start">
              {/* Poster */}
              <div className="relative w-48 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-gray-700">
                <Image
                  src={movie.poster_url}
                  alt={title}
                  width={200}
                  height={300}
                  className="w-full"
                />
              </div>

              {/* Quick info card */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wide text-gray-400">{th('quickInfo')}</h3>
                <dl className="space-y-2.5 text-sm">
                  {([
                    [t('year'), String(movie.year)],
                    [t('director'), isRTL ? movie.director_ar : movie.director],
                    [t('duration'), `${movie.duration} ${t('minutes')}`],
                    [t('language'), movie.language],
                    [t('country'), movie.country],
                    ...(movie.budget_million ? [[t('budget'), `$${movie.budget_million}${t('million')}`]] : []),
                    ...(movie.box_office_million ? [[t('boxOffice'), `$${movie.box_office_million}${t('million')}`]] : []),
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="text-white text-end">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Awards — only shown in Arabic locale since data is in Arabic */}
              {isRTL && movie.awards && (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                  <p className="text-amber-400 text-xs font-bold mb-1 uppercase">🏆 {t('awards')}</p>
                  <p className="text-gray-300 text-sm">{movie.awards}</p>
                </div>
              )}

              {/* External ratings */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide text-gray-400">{t('externalRatings')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">⭐ {t('imdbRating')}</span>
                    <span className="text-yellow-400 font-black text-lg">{movie.imdb_rating}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">🍅 {t('rtScore')}</span>
                    <span className={`${rtColor} font-black text-lg`}>{movie.rotten_tomatoes}%</span>
                  </div>
                  {movie.metacritic && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">🎯 Metacritic</span>
                      <span className="text-blue-400 font-black text-lg">{movie.metacritic}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trailer */}
              {movie.trailer_url && (
                <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors">
                  ▶ {t('watchTrailer')}
                </a>
              )}

              {/* Watchlist */}
              <WatchlistButton slug={movie.slug} title={movie.title} />

              {/* Share */}
              <ShareButton title={isRTL ? movie.title_ar : movie.title} />

              {/* Where to watch */}
              <WhereToWatch title={movie.title} year={movie.year} locale={locale} />

              {/* Sidebar Ad */}
              <AdUnit slot="3456789012" format="rectangle" className="rounded-xl overflow-hidden" />
            </div>

            {/* ── RIGHT: Main Content ── */}
            <div className="lg:col-span-2 space-y-6 pt-4">
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{title}</h1>
                {isRTL && <p className="text-gray-500 text-lg">{movie.title} ({movie.year})</p>}
                <p className="text-gray-500 text-sm mt-1">{th('directedBy')}: {isRTL ? movie.director_ar : movie.director}</p>
              </div>

              {/* Our Rating — BIG */}
              <div className="bg-gradient-to-br from-amber-900/30 via-gray-900 to-gray-900 border border-amber-500/30 rounded-2xl p-6">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">{t('ourRating')}</p>
                <div className="flex flex-wrap items-center gap-6">
                  <RatingCircle value={movie.rating_overall} size="lg" />
                  <div className="flex flex-wrap gap-4">
                    {ratingBreakdown.map((r) => (
                      <RatingCircle key={r.label} value={r.value} size="sm" label={r.label} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-3">{t('overview')}</h2>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </div>

              {/* Ad — between description and rating breakdown */}
              <AdUnit slot="1234567890" format="horizontal" className="rounded-xl overflow-hidden" />

              {/* Rating Breakdown Bars */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="font-bold text-white mb-5">{t('ratingBreakdown')}</h2>
                <div className="space-y-3">
                  {ratingBreakdown.map((r) => (
                    <RatingBar key={r.label} label={r.label} value={r.value} />
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-900/10 border border-green-500/20 rounded-2xl p-5">
                  <h3 className="text-green-400 font-bold mb-3">✅ {t('pros')}</h3>
                  <ul className="space-y-2">
                    {pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-green-400 mt-0.5 flex-shrink-0">•</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-900/10 border border-red-500/20 rounded-2xl p-5">
                  <h3 className="text-red-400 font-bold mb-3">❌ {t('cons')}</h3>
                  <ul className="space-y-2">
                    {cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cast */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h2 className="font-bold text-white mb-3">{t('cast')}</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span key={actor} className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 border border-gray-700">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Reviews */}
          <ReviewSection movieSlug={movie.slug} movieTitle={title} locale={locale} />

          {/* Related films */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-black text-white mb-5">🎬 {t('related')}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {related.map((m) => (
                  <MovieCard key={m.slug} movie={m} locale={locale} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
