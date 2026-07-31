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
import VPNBanner from '@/components/VPNBanner'
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
  const BASE = 'https://cinereview-mu.vercel.app'
  const title = `${locale === 'ar' ? movie.title_ar : movie.title} (${movie.year})`
  const desc = getMovieDescription(movie, locale).slice(0, 160)
  return {
    title,
    description: desc,
    alternates: {
      canonical: `${BASE}/${locale}/movies/${slug}`,
      languages: Object.fromEntries(
        ['ar', 'en', 'fr', 'es', 'tr', 'de', 'ja', 'pt'].map((l) => [l, `${BASE}/${l}/movies/${slug}`])
      ),
    },
    openGraph: {
      title,
      description: desc,
      type: 'article',
      images: [{ url: movie.poster_url, width: 500, height: 750, alt: title }],
      siteName: 'CineReview',
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
      ratingCount: movie.reviews_count || 1,
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
        <div className="relative h-72 md:h-[420px] overflow-hidden">
          <Image
            src={movie.backdrop_url || movie.poster_url}
            alt={title}
            fill
            className="object-cover scale-105"
            priority
            sizes="100vw"
          />
          {/* Multi-layer cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/40 to-transparent" />
          {/* Top line accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Breadcrumb */}
          <div className="absolute top-4 start-4">
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 glass-card px-3 py-1.5 rounded-lg border border-gray-700/50">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">{t('breadcrumbHome')}</Link>
              <span className="text-gray-600">/</span>
              <Link href={`/${locale}/movies`} className="hover:text-white transition-colors">{t('breadcrumbMovies')}</Link>
              <span className="text-gray-600">/</span>
              <span className="text-gray-300 truncate max-w-32">{movie.title}</span>
            </nav>
          </div>

          {/* Genre badges bottom */}
          <div className="absolute bottom-4 start-4 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <Link key={g} href={`/${locale}/genre/${g}`}
                className={`text-xs px-3 py-1 rounded-full border font-semibold backdrop-blur-sm ${GENRE_COLORS[g]}`}>
                {GENRE_ICONS[g]} {tg(g)}
              </Link>
            ))}
          </div>

          {/* Year badge top-right */}
          <div className="absolute top-4 end-4">
            <span className="glass-card border border-gray-700/50 text-white text-sm font-black px-3 py-1.5 rounded-lg">
              {movie.year}
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 -mt-20 relative pb-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── LEFT: Poster + Quick Info ── */}
            <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-20 lg:self-start">
              {/* Poster with glow */}
              <div className="relative w-44 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/70"
                style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 2px rgba(245,158,11,0.2)' }}>
                <Image
                  src={movie.poster_url}
                  alt={title}
                  width={200}
                  height={300}
                  className="w-full"
                />
              </div>

              {/* Quick info card */}
              <div className="bg-gray-900/80 border border-gray-800/60 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{th('quickInfo')}</h3>
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

              {/* Awards */}
              {isRTL && movie.awards && (
                <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 p-4"
                  style={{ background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.08), transparent 70%), #0d1117' }}>
                  <p className="text-amber-400 text-xs font-black mb-2 flex items-center gap-1.5">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {t('awards')}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">{movie.awards}</p>
                </div>
              )}

              {/* External ratings */}
              <div className="bg-gray-900/80 border border-gray-800/60 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{t('externalRatings')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-yellow-500/5 border border-yellow-500/15">
                    <span className="text-gray-400 text-sm flex items-center gap-1.5">
                      <svg width="14" height="14" fill="#facc15" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      IMDb
                    </span>
                    <span className="text-yellow-400 font-black text-lg tabular-nums">{movie.imdb_rating}</span>
                  </div>
                  <div className={`flex items-center justify-between p-2.5 rounded-xl border ${movie.rotten_tomatoes >= 75 ? 'bg-green-500/5 border-green-500/15' : movie.rotten_tomatoes >= 60 ? 'bg-yellow-500/5 border-yellow-500/15' : 'bg-red-500/5 border-red-500/15'}`}>
                    <span className="text-gray-400 text-sm">🍅 Rotten Tomatoes</span>
                    <span className={`${rtColor} font-black text-lg tabular-nums`}>{movie.rotten_tomatoes}%</span>
                  </div>
                  {movie.metacritic && (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15">
                      <span className="text-gray-400 text-sm">🎯 Metacritic</span>
                      <span className="text-blue-400 font-black text-lg tabular-nums">{movie.metacritic}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trailer */}
              {movie.trailer_url && (
                <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-lg shadow-red-900/30 hover:shadow-red-500/20 hover:-translate-y-0.5 border border-red-500/30">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z"/></svg>
                  {t('watchTrailer')}
                </a>
              )}

              {/* Watchlist */}
              <WatchlistButton slug={movie.slug} title={movie.title} />

              {/* Share */}
              <ShareButton title={isRTL ? movie.title_ar : movie.title} />

              {/* Where to watch */}
              <WhereToWatch title={movie.title} year={movie.year} locale={locale} />

              {/* VPN Affiliate */}
              <VPNBanner locale={locale} variant="sidebar" />

              {/* Sidebar Ad */}
              <AdUnit slot="3456789012" format="rectangle" className="rounded-xl overflow-hidden" />
            </div>

            {/* ── RIGHT: Main Content ── */}
            <div className="lg:col-span-2 space-y-5 pt-4">
              {/* Title block */}
              <div className="bg-gray-900/50 border border-gray-800/40 rounded-2xl p-5">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-1 leading-tight">{title}</h1>
                {isRTL && <p className="text-gray-500 text-base mb-1">{movie.title} ({movie.year})</p>}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <Link href={`/${locale}/director/${movie.director.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`}
                    className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-semibold flex items-center gap-1">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    {isRTL ? movie.director_ar : movie.director}
                  </Link>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="text-gray-500 text-sm">{movie.year}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="text-gray-500 text-sm">{movie.duration}m</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span className="text-gray-500 text-sm">{movie.language}</span>
                </div>
              </div>

              {/* Our Rating — BIG with glow */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 p-6"
                style={{ background: 'radial-gradient(ellipse 80% 100% at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 60%), #0d1117' }}>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                <p className="text-amber-400 text-[11px] font-black uppercase tracking-widest mb-5 flex items-center gap-2">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {t('ourRating')}
                </p>
                <div className="flex flex-wrap items-center gap-8">
                  <RatingCircle value={movie.rating_overall} size="lg" />
                  <div className="flex flex-wrap gap-5">
                    {ratingBreakdown.map((r) => (
                      <RatingCircle key={r.label} value={r.value} size="sm" label={r.label} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-6">
                <h2 className="section-accent font-black text-white mb-4 text-base">{t('overview')}</h2>
                <p className="text-gray-400 leading-relaxed">{description}</p>
              </div>

              {/* Ad — between description and rating breakdown */}
              <AdUnit slot="1234567890" format="horizontal" className="rounded-xl overflow-hidden" />

              {/* Rating Breakdown Bars */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-6">
                <h2 className="section-accent font-black text-white mb-5 text-base">{t('ratingBreakdown')}</h2>
                <div className="space-y-3">
                  {ratingBreakdown.map((r) => (
                    <RatingBar key={r.label} label={r.label} value={r.value} />
                  ))}
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-green-950/30 border border-green-500/20 rounded-2xl p-5">
                  <h3 className="text-green-400 font-black mb-4 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs">✓</span>
                    {t('pros')}
                  </h3>
                  <ul className="space-y-2.5">
                    {pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-5">
                  <h3 className="text-red-400 font-black mb-4 flex items-center gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-xs">✕</span>
                    {t('cons')}
                  </h3>
                  <ul className="space-y-2.5">
                    {cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cast */}
              <div className="bg-gray-900/60 border border-gray-800/50 rounded-2xl p-5">
                <h2 className="section-accent font-black text-white mb-4 text-base">{t('cast')}</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <Link key={actor} href={`/${locale}/actor/${actor.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`}
                      className="px-3 py-1.5 bg-gray-800/80 rounded-lg text-sm text-gray-300 border border-gray-700/60 hover:border-amber-500/40 hover:text-amber-400 transition-all">
                      {actor}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Reviews */}
          <ReviewSection movieSlug={movie.slug} movieTitle={title} locale={locale} />

          {/* Related films */}
          {related.length > 0 && (
            <section className="mt-8 pt-8 border-t border-gray-800/50">
              <h2 className="section-accent text-xl font-black text-white mb-5">
                <span>{isRTL ? 'أفلام مشابهة' : 'Related Films'}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
