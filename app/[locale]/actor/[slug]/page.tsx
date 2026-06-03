import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getActorBySlug, getAllActors } from '@/lib/movies'
import { LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import AdUnit from '@/components/AdUnit'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const actors = getAllActors()
  return LOCALES.flatMap((locale) =>
    actors.map((a) => ({ locale, slug: a.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const actor = getActorBySlug(slug)
  if (!actor) return {}
  const title = `${actor.name} — ${actor.movies.length} Films`
  const topPoster = actor.movies[0]?.poster_url
  return {
    title,
    description: `All movies starring ${actor.name} — ratings and reviews on CineReview`,
    openGraph: {
      title,
      type: 'profile',
      ...(topPoster ? { images: [{ url: topPoster }] } : {}),
    },
  }
}

function ActorJsonLd({ actor, locale }: { actor: ReturnType<typeof getActorBySlug>; locale: string }) {
  if (!actor) return null
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: actor.name,
    jobTitle: 'Actor',
    url: `https://cinereview-mu.vercel.app/${locale}/actor/${actor.slug}`,
    sameAs: [`https://www.imdb.com/search/name/?name=${encodeURIComponent(actor.name)}`],
    performerIn: actor.movies.map((m) => ({
      '@type': 'Movie',
      name: locale === 'ar' ? m.title_ar : m.title,
      dateCreated: String(m.year),
      url: `https://cinereview-mu.vercel.app/${locale}/movies/${m.slug}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default async function ActorPage({ params }: Props) {
  const { locale, slug } = await params
  const actor = getActorBySlug(slug)
  if (!actor) notFound()

  const isRTL = locale === 'ar'
  const sorted = [...actor.movies].sort((a, b) => b.rating_overall - a.rating_overall)
  const avgRating = (actor.movies.reduce((s, m) => s + m.rating_overall, 0) / actor.movies.length).toFixed(1)
  const years = actor.movies.map((m) => m.year)
  const yearRange = `${Math.min(...years)} – ${Math.max(...years)}`
  const topGenres = Object.entries(
    actor.movies.flatMap(m => m.genres).reduce((acc: Record<string, number>, g) => { acc[g] = (acc[g] || 0) + 1; return acc }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([g]) => g)

  const LABELS: Record<string, Record<string, string>> = {
    films: { ar: 'فيلم', en: 'Films', fr: 'Films', es: 'Películas', tr: 'Film', de: 'Filme', ja: '出演作', pt: 'Filmes' },
    avgRating: { ar: 'متوسط التقييم', en: 'Avg Rating', fr: 'Note moy.', es: 'Puntuación', tr: 'Ort. Puan', de: 'Ø Bewertung', ja: '平均評価', pt: 'Avaliação' },
    topGenres: { ar: 'أبرز الأنواع', en: 'Top Genres', fr: 'Genres', es: 'Géneros', tr: 'Türler', de: 'Genres', ja: 'ジャンル', pt: 'Géneros' },
    allFilms: { ar: 'جميع الأفلام', en: 'All Films', fr: 'Tous les films', es: 'Todas las películas', tr: 'Tüm Filmler', de: 'Alle Filme', ja: '全出演作品', pt: 'Todos os filmes' },
    actors: { ar: 'الممثلون', en: 'Actors', fr: 'Acteurs', es: 'Actores', tr: 'Oyuncular', de: 'Schauspieler', ja: '俳優', pt: 'Atores' },
    period: { ar: 'الفترة', en: 'Period', fr: 'Période', es: 'Período', tr: 'Dönem', de: 'Zeitraum', ja: '活動期間', pt: 'Período' },
  }
  const L = (key: string) => LABELS[key]?.[locale] || LABELS[key]?.en || key

  return (
    <>
      <ActorJsonLd actor={actor} locale={locale} />
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: L('actors'), url: `https://cinereview-mu.vercel.app/${locale}/actors` },
        { name: actor.name, url: `https://cinereview-mu.vercel.app/${locale}/actor/${slug}` },
      ]} />
      <Header locale={locale} />
      <main style={{ background: '#030712' }}>
        {/* Hero Banner */}
        <div className="border-b border-gray-800/50 mb-8"
          style={{ background: 'radial-gradient(ellipse 80% 150% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">
                {locale === 'ar' ? 'الرئيسية' : 'Home'}
              </Link>
              <span className="text-gray-700">/</span>
              <Link href={`/${locale}/actors`} className="hover:text-white transition-colors">{L('actors')}</Link>
              <span className="text-gray-700">/</span>
              <span className="text-gray-300">{actor.name}</span>
            </nav>

            {/* Actor card */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '2px solid rgba(99,102,241,0.25)', boxShadow: '0 0 30px rgba(99,102,241,0.08)' }}>
                <svg width="36" height="36" fill="none" stroke="#818cf8" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-black text-white mb-1 leading-tight">{actor.name}</h1>
                {topGenres.length > 0 && (
                  <p className="text-gray-500 text-sm mb-2">{topGenres.join(' · ')}</p>
                )}
                <div className="flex flex-wrap gap-3 mt-3">
                  {/* Films count */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700/50 text-sm">
                    <svg width="13" height="13" fill="none" stroke="#818cf8" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16"/></svg>
                    <span className="text-white font-bold">{actor.movies.length}</span>
                    <span className="text-gray-400">{L('films')}</span>
                  </div>
                  {/* Year range */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700/50 text-sm">
                    <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <span className="text-gray-300">{yearRange}</span>
                  </div>
                  {/* Avg rating */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-sm">
                    <svg width="13" height="13" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-amber-400 font-black">{avgRating}</span>
                    <span className="text-gray-500">{isRTL ? 'متوسط' : 'avg'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-12">
          {/* Ad */}
          <AdUnit slot="6789012345" format="horizontal" className="rounded-xl overflow-hidden mb-8" />

          {/* Films Grid */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-indigo-600" />
            <h2 className="text-xl font-black text-white">{L('allFilms')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sorted.map((movie, i) => (
              <>
                <MovieCard key={movie.slug} movie={movie} locale={locale} />
                {i === 9 && (
                  <div key="ad" className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5">
                    <AdUnit slot="7890123456" format="horizontal" className="rounded-xl overflow-hidden" />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
