import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getDirectorBySlug, getAllDirectors, getMovieDescription } from '@/lib/movies'
import { LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const directors = getAllDirectors()
  return LOCALES.flatMap((locale) =>
    directors.map((d) => ({ locale, slug: d.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const director = getDirectorBySlug(slug)
  if (!director) return {}
  const name = locale === 'ar' ? director.name_ar : director.name
  const title = `${name} — ${director.movies.length} films`
  return {
    title,
    description: title,
    openGraph: { title, type: 'profile' },
  }
}

function DirectorJsonLd({ director, locale }: { director: ReturnType<typeof getDirectorBySlug>; locale: string }) {
  if (!director) return null
  const name = locale === 'ar' ? director.name_ar : director.name
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: 'Film Director',
    knowsAbout: 'Filmmaking',
    worksFor: { '@type': 'Organization', name: 'Film Industry' },
    sameAs: [`https://www.imdb.com/search/name/?name=${encodeURIComponent(director.name)}`],
    filmography: director.movies.map((m) => ({
      '@type': 'Movie',
      name: m.title,
      dateCreated: String(m.year),
      url: `https://cinereview-mu.vercel.app/${locale}/movies/${m.slug}`,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default async function DirectorPage({ params }: Props) {
  const { locale, slug } = await params
  const director = getDirectorBySlug(slug)
  if (!director) notFound()

  const t = await getTranslations('directorPage')
  const tm = await getTranslations('movie')
  const isRTL = locale === 'ar'
  const name = isRTL ? director.name_ar : director.name

  const sorted = [...director.movies].sort((a, b) => b.rating_overall - a.rating_overall)
  const avgRating = (director.movies.reduce((s, m) => s + m.rating_overall, 0) / director.movies.length).toFixed(1)
  const years = director.movies.map((m) => m.year)
  const yearRange = `${Math.min(...years)} – ${Math.max(...years)}`

  return (
    <>
      <DirectorJsonLd director={director} locale={locale} />
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: locale === 'ar' ? 'المخرجون' : 'Directors', url: `https://cinereview-mu.vercel.app/${locale}/directors` },
        { name, url: `https://cinereview-mu.vercel.app/${locale}/director/${slug}` },
      ]} />
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href={`/${locale}`} className="hover:text-white transition-colors">{tm('breadcrumbHome')}</Link>
          <span>/</span>
          <Link href={`/${locale}/directors`} className="hover:text-white transition-colors">{t('allDirectors')}</Link>
          <span>/</span>
          <span className="text-white">{name}</span>
        </nav>

        {/* Director Header */}
        <div className="flex items-center gap-6 mb-10 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-900/30 border-2 border-amber-500/30 flex items-center justify-center text-4xl flex-shrink-0">
            🎬
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">{name}</h1>
            {isRTL && <p className="text-gray-500 text-sm">{director.name}</p>}
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <span className="text-gray-400">🎞️ {director.movies.length} {t('films')}</span>
              <span className="text-gray-400">📅 {yearRange}</span>
              <span className="text-amber-400 font-bold">⭐ {avgRating} {tm('avgRating') || 'avg'}</span>
            </div>
          </div>
        </div>

        {/* Films Grid */}
        <h2 className="text-xl font-black text-white mb-5">{t('allFilms')}</h2>
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
