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
    actorIn: { ar: 'بطولة', en: 'Starring', fr: 'Avec', es: 'Protagonizada por', tr: 'Başrol', de: 'Mit', ja: '出演', pt: 'Com' },
  }
  const L = (key: string) => LABELS[key]?.[locale] || LABELS[key]?.en || key

  return (
    <>
      <ActorJsonLd actor={actor} locale={locale} />
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: locale === 'ar' ? 'الممثلون' : 'Actors', url: `https://cinereview-mu.vercel.app/${locale}/actors` },
        { name: actor.name, url: `https://cinereview-mu.vercel.app/${locale}/actor/${slug}` },
      ]} />
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">
            {locale === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/actors`} className="hover:text-white transition-colors">
            {locale === 'ar' ? 'الممثلون' : 'Actors'}
          </Link>
          <span>/</span>
          <span className="text-white">{actor.name}</span>
        </nav>

        {/* Actor Header */}
        <div className="flex items-center gap-6 mb-8 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-blue-900/30 border-2 border-blue-500/30 flex items-center justify-center text-4xl flex-shrink-0">
            🎭
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">{actor.name}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="text-gray-400">🎬 {actor.movies.length} {L('films')}</span>
              <span className="text-gray-400">📅 {yearRange}</span>
              <span className="text-amber-400 font-bold">⭐ {avgRating}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-blue-400">{actor.movies.length}</div>
            <div className="text-gray-500 text-xs mt-1">{L('films')}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-amber-400">⭐ {avgRating}</div>
            <div className="text-gray-500 text-xs mt-1">{L('avgRating')}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="text-sm font-bold text-purple-400 leading-tight">{topGenres.join(' · ')}</div>
            <div className="text-gray-500 text-xs mt-1">{L('topGenres')}</div>
          </div>
        </div>

        {/* Ad */}
        <AdUnit slot="6789012345" format="horizontal" className="rounded-xl overflow-hidden mb-8" />

        {/* Films Grid */}
        <h2 className="text-xl font-black text-white mb-5">{L('allFilms')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sorted.map((movie) => (
            <MovieCard key={movie.slug} movie={movie} locale={locale} />
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
