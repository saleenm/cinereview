import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getMovieOfTheDay, getMovies, getMovieDescription } from '@/lib/movies'
import { LOCALES, GENRE_ICONS, GENRE_COLORS } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RatingCircle from '@/components/RatingCircle'
import WatchlistButton from '@/components/WatchlistButton'
import PushNotificationButton from '@/components/PushNotificationButton'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const movie = getMovieOfTheDay()
  const t = await getTranslations('movieOfDay')
  const title = `${t('title')} — ${locale === 'ar' ? movie.title_ar : movie.title}`
  return {
    title,
    description: t('subtitle'),
    openGraph: { title, images: [movie.backdrop_url || movie.poster_url], type: 'website' },
  }
}

export default async function MovieOfDayPage({ params }: Props) {
  const { locale } = await params
  const movie = getMovieOfTheDay()
  const t = await getTranslations('movieOfDay')
  const tm = await getTranslations('movie')
  const tg = await getTranslations('genres')
  const isRTL = locale === 'ar'

  const title = isRTL ? movie.title_ar : movie.title
  const director = isRTL ? movie.director_ar : movie.director
  const description = getMovieDescription(movie, locale)

  // Previous 6 films of the day (days -1 to -6)
  const allMovies = getMovies()
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const pastFilms = Array.from({ length: 6 }, (_, i) => {
    const idx = ((dayOfYear - (i + 1)) % allMovies.length + allMovies.length) % allMovies.length
    return allMovies[idx]
  })

  const today = new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  const shareUrl = `https://cinereview-mu.vercel.app/${locale}/movie-of-day`
  const shareText = `${t('title')}: ${title} — ${movie.rating_overall}/10`

  return (
    <>
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: t('title'), url: shareUrl },
      ]} />
      <Header locale={locale} />
      <main className="flex-1">

        {/* Hero backdrop */}
        <div className="relative h-72 md:h-96 overflow-hidden">
          <Image
            src={movie.backdrop_url || movie.poster_url}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/20" />

          {/* Breadcrumb */}
          <div className="absolute top-4 start-4">
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">{tm('breadcrumbHome')}</Link>
              <span>/</span>
              <span className="text-white">{t('title')}</span>
            </nav>
          </div>

          {/* Date badge */}
          <div className="absolute bottom-4 start-4">
            <span className="px-4 py-1.5 rounded-full bg-amber-500 text-gray-950 text-xs font-black">
              📅 {today}
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-16 relative pb-16">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── LEFT ── */}
            <div className="space-y-4">
              {/* Poster */}
              <div className="relative w-44 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40">
                <Image
                  src={movie.poster_url}
                  alt={title}
                  width={176}
                  height={264}
                  className="w-full"
                />
              </div>

              {/* Rating circle */}
              <div className="bg-gradient-to-br from-amber-900/30 via-gray-900 to-gray-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col items-center gap-3">
                <p className="text-amber-400 text-xs font-bold uppercase tracking-widest">{tm('ourRating')}</p>
                <RatingCircle value={movie.rating_overall} size="lg" />
                <div className="flex gap-4 text-sm text-gray-400">
                  <span>⭐ IMDb {movie.imdb_rating}</span>
                  <span>🍅 {movie.rotten_tomatoes}%</span>
                </div>
              </div>

              {/* Watchlist */}
              <WatchlistButton slug={movie.slug} title={movie.title} />
              <PushNotificationButton locale={locale} />

              {/* Share */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-3">📤 {tm('shareBtn')}</p>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-center text-gray-300 border border-gray-700 transition-colors"
                  >
                    𝕏 Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-center text-gray-300 border border-gray-700 transition-colors"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="lg:col-span-2 space-y-5 pt-4">
              {/* Title */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
                  🎬 {t('title')}
                </div>
                <h1 className="text-3xl md:text-4xl font-black text-white mb-1">{title}</h1>
                {isRTL && <p className="text-gray-500">{movie.title} ({movie.year})</p>}
                <p className="text-gray-500 text-sm mt-1">{director} · {movie.year}</p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {movie.genres.map((g) => (
                    <Link key={g} href={`/${locale}/genre/${g}`}
                      className={`text-xs px-3 py-1 rounded-full border font-medium ${GENRE_COLORS[g]}`}>
                      {GENRE_ICONS[g]} {tg(g)}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Why Today */}
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5">
                <h2 className="text-amber-400 font-bold text-sm mb-2">💡 {t('whyToday')}</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{description.slice(0, 300)}</p>
              </div>

              {/* Quick info */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  {([
                    [tm('year'), String(movie.year)],
                    [tm('duration'), `${movie.duration} ${tm('minutes')}`],
                    [tm('language'), movie.language],
                    [tm('country'), movie.country],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-gray-500 text-xs">{k}</dt>
                      <dd className="text-white font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Full review CTA */}
              <Link href={`/${locale}/movies/${movie.slug}`}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-black text-sm transition-colors shadow-lg shadow-amber-500/20">
                {t('readFullReview')} →
              </Link>

              {/* Trailer */}
              {movie.trailer_url && (
                <a href={movie.trailer_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-colors">
                  ▶ {tm('watchTrailer')}
                </a>
              )}
            </div>
          </div>

          {/* Past films */}
          <section className="mt-12">
            <h2 className="text-xl font-black text-white mb-5">📅 {t('previousFilms')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {pastFilms.map((m, i) => {
                const mTitle = isRTL ? m.title_ar : m.title
                const d = new Date(now.getTime() - (i + 1) * 86400000)
                const dayLabel = d.toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, { weekday: 'short', day: 'numeric', month: 'short' })
                return (
                  <Link key={m.slug} href={`/${locale}/movies/${m.slug}`}
                    className="group bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image src={m.poster_url} alt={mTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                      <span className="absolute bottom-1 end-1 text-xs font-black text-amber-400">★ {m.rating_overall}</span>
                    </div>
                    <div className="p-2">
                      <p className="text-white text-xs font-semibold line-clamp-1 group-hover:text-amber-400 transition-colors">{mTitle}</p>
                      <p className="text-gray-600 text-xs mt-0.5">{dayLabel}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
