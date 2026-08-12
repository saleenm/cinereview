import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getDirectorBySlug, getAllDirectors, getMovieDescription } from '@/lib/movies'
import { LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import AdUnit from '@/components/AdUnit'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const directors = getAllDirectors()
  return ['ar', 'en'].flatMap((locale) =>
    directors.map((d) => ({ locale, slug: d.slug }))
  )
}

const BASE = 'https://cinereview-mu.vercel.app'
const LANGS = ['ar','en','fr','es','tr','de','ja','pt']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const director = getDirectorBySlug(slug)
  if (!director) return {}
  const name = locale === 'ar' ? director.name_ar : director.name
  const title = `${name} — ${director.movies.length} ${locale === 'ar' ? 'فيلم' : 'Films'} | CineReview`
  const description = locale === 'ar'
    ? `اكتشف أفلام المخرج ${name} — ${director.movies.length} فيلم مع تقييمات تفصيلية`
    : `Discover ${name}'s filmography — ${director.movies.length} films with detailed reviews`
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/director/${slug}`,
      languages: Object.fromEntries(LANGS.map((l) => [l, `${BASE}/${l}/director/${slug}`])),
    },
    openGraph: { title, description, url: `${BASE}/${locale}/director/${slug}`, siteName: 'CineReview', type: 'profile' },
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
      <main style={{ background: '#030712' }}>
        {/* ── HERO BANNER ── */}
        <div className="border-b border-gray-800/50 mb-8"
          style={{ background: 'radial-gradient(ellipse 80% 150% at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-6xl mx-auto px-4 py-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-8">
              <Link href={`/${locale}`} className="hover:text-white transition-colors">{tm('breadcrumbHome')}</Link>
              <span className="text-gray-700">/</span>
              <Link href={`/${locale}/directors`} className="hover:text-white transition-colors">{t('allDirectors')}</Link>
              <span className="text-gray-700">/</span>
              <span className="text-gray-300">{name}</span>
            </nav>

            {/* Director card */}
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.1))', border: '2px solid rgba(245,158,11,0.25)', boxShadow: '0 0 30px rgba(245,158,11,0.08)' }}>
                <svg width="36" height="36" fill="none" stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-4xl font-black text-white mb-1 leading-tight">{name}</h1>
                {isRTL && <p className="text-gray-500 text-sm mb-2">{director.name}</p>}
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700/50 text-sm">
                    <svg width="13" height="13" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16"/></svg>
                    <span className="text-white font-bold">{director.movies.length}</span>
                    <span className="text-gray-400">{t('films')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700/50 text-sm">
                    <svg width="13" height="13" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    <span className="text-gray-300">{yearRange}</span>
                  </div>
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
          <AdUnit slot="2345678901" format="horizontal" className="rounded-xl overflow-hidden mb-8" />

          {/* Films Grid */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
            <h2 className="text-xl font-black text-white">{t('allFilms')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sorted.map((movie, i) => (
              <>
                <MovieCard key={movie.slug} movie={movie} locale={locale} />
                {i === 9 && (
                  <div key="ad" className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5">
                    <AdUnit slot="3456789012" format="horizontal" className="rounded-xl overflow-hidden" />
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
