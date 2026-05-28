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
      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-5xl mb-3">{col.emoji}</div>
          <h1 className="text-3xl font-black text-white mb-2">{d.title}</h1>
          <p className="text-gray-400">{d.description}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-amber-400">{movies.length}</div>
            <div className="text-gray-500 text-xs mt-1">{isRTL ? 'فيلم' : 'Films'}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-green-400">⭐ {avg}</div>
            <div className="text-gray-500 text-xs mt-1">{isRTL ? 'متوسط التقييم' : 'Avg Rating'}</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
            <div className="text-2xl font-black text-blue-400">
              {movies[0] ? movies[0].rating_overall : '-'}
            </div>
            <div className="text-gray-500 text-xs mt-1">{isRTL ? 'أعلى تقييم' : 'Top Rating'}</div>
          </div>
        </div>

        {/* Other collections */}
        <div className="flex flex-wrap gap-2 mb-8">
          {COLLECTIONS.filter(c => c.slug !== slug).map((c) => {
            const cd = c.i18n[locale] || c.i18n.en
            return (
              <Link key={c.slug} href={`/${locale}/collection/${c.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 hover:border-amber-500/40 text-sm text-gray-400 hover:text-white transition-all">
                {c.emoji} {cd.title}
              </Link>
            )
          })}
        </div>

        <AdUnit slot="7890123456" format="horizontal" className="rounded-xl overflow-hidden mb-8" />

        {movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">{col.emoji}</div>
            <p>{isRTL ? 'لا توجد أفلام في هذه المجموعة بعد' : 'No films in this collection yet'}</p>
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
      </main>
      <Footer locale={locale} />
    </>
  )
}
