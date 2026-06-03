import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { COLLECTIONS, getCollectionBySlug, getCollectionMovies } from '@/lib/collections'
import { LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import AdUnit from '@/components/AdUnit'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    COLLECTIONS.map((c) => ({ locale, slug: c.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const col = getCollectionBySlug(slug)
  if (!col) return {}
  const d = col.i18n[locale] || col.i18n.en
  const movies = getCollectionMovies(slug)
  return {
    title: d.title,
    description: d.description,
    openGraph: {
      title: d.title,
      description: d.description,
      type: 'website',
      images: movies[0] ? [{ url: movies[0].backdrop_url || movies[0].poster_url }] : [],
    },
  }
}

export default async function CollectionPage({ params }: Props) {
  const { locale, slug } = await params
  const col = getCollectionBySlug(slug)
  if (!col) notFound()

  const movies = getCollectionMovies(slug)
  const d = col.i18n[locale] || col.i18n.en
  const isRTL = locale === 'ar'
  const avg = movies.length
    ? (movies.reduce((s, m) => s + m.rating_overall, 0) / movies.length).toFixed(1)
    : '0'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: d.title,
    description: d.description,
    numberOfItems: movies.length,
    itemListElement: movies.slice(0, 10).map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Movie',
        name: isRTL ? m.title_ar : m.title,
        url: `https://cinereview-mu.vercel.app/${locale}/movies/${m.slug}`,
        aggregateRating: { '@type': 'AggregateRating', ratingValue: m.rating_overall, bestRating: 10 },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: d.title, url: `https://cinereview-mu.vercel.app/${locale}/collection/${slug}` },
      ]} />
      <Header locale={locale} />
      <main style={{ background: '#030712' }}>
        {/* Hero */}
        <section className="border-b border-gray-800/50"
          style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex items-center gap-5">
              {/* Emoji icon in styled container */}
              <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl"
                style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.08))', border: '1.5px solid rgba(245,158,11,0.25)' }}>
                {col.emoji}
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white mb-1">{d.title}</h1>
                <p className="text-gray-400 text-sm max-w-xl">{d.description}</p>
                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800/80 border border-gray-700/50 text-sm">
                    <svg width="13" height="13" fill="none" stroke="#f59e0b" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16"/></svg>
                    <span className="text-white font-bold">{movies.length}</span>
                    <span className="text-gray-400">{isRTL ? 'فيلم' : 'Films'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-sm">
                    <svg width="13" height="13" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-amber-400 font-black">{avg}</span>
                    <span className="text-gray-500">{isRTL ? 'متوسط' : 'avg'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Other collections */}
          <div className="flex flex-wrap gap-2 mb-8">
            {COLLECTIONS.filter(c => c.slug !== slug).map((c) => {
              const cd = c.i18n[locale] || c.i18n.en
              return (
                <Link key={c.slug} href={`/${locale}/collection/${c.slug}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 text-xs text-gray-400 hover:text-amber-400 transition-all font-medium">
                  {c.emoji} {cd.title}
                </Link>
              )
            })}
          </div>

          <AdUnit slot="7890123456" format="horizontal" className="rounded-xl overflow-hidden mb-8" />

          {/* Films section header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
            <h2 className="text-xl font-black text-white">{isRTL ? 'الأفلام' : 'Films'}</h2>
          </div>

          {movies.length === 0 ? (
            <div className="text-center py-24 text-gray-500">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-4xl"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                {col.emoji}
              </div>
              <p className="text-gray-400">{isRTL ? 'لا توجد أفلام في هذه المجموعة بعد' : 'No films in this collection yet'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie, i) => (
                <div key={movie.slug} className="relative">
                  {i < 3 && (
                    <div className={`absolute top-2 start-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black
                      ${i === 0 ? 'bg-amber-500 text-gray-950' : i === 1 ? 'bg-gray-400 text-gray-950' : 'bg-amber-700 text-white'}`}>
                      {i + 1}
                    </div>
                  )}
                  <MovieCard movie={movie} locale={locale} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
