import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getMovieList } from '@/lib/supabase'
import { getMovieBySlug } from '@/lib/movies'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string; id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params
  const list = await getMovieList(id)
  if (!list) return { title: 'List Not Found' }
  return {
    title: `${list.name} | CineReview`,
    description: list.description || `A curated list of ${list.slugs.length} films`,
    openGraph: {
      title: list.name,
      description: list.description || `${list.slugs.length} curated films`,
      type: 'website',
    },
  }
}

export default async function ListViewPage({ params }: Props) {
  const { locale, id } = await params
  const list = await getMovieList(id)
  if (!list) notFound()

  const movies = list.slugs.map(slug => getMovieBySlug(slug)).filter(Boolean)
  const isRTL = locale === 'ar'
  const shareUrl = `https://cinereview.vercel.app/${locale}/list/${id}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: list.name,
    description: list.description,
    numberOfItems: movies.length,
    itemListElement: movies.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Movie',
        name: m!.title,
        url: `https://cinereview.vercel.app/${locale}/movies/${m!.slug}`,
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header locale={locale} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">📋 {list.name}</h1>
              {list.description && <p className="text-gray-400 text-sm mb-2">{list.description}</p>}
              <p className="text-gray-600 text-xs">{movies.length} {isRTL ? 'فيلم' : 'films'} · {new Date(list.created_at).toLocaleDateString(locale === 'ar' ? 'ar' : 'en')}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {/* Share buttons */}
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(list.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-xl transition-colors">
                𝕏 {isRTL ? 'شارك' : 'Share'}
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(list.name + ' ' + shareUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="px-3 py-2 bg-green-800/50 hover:bg-green-700/50 text-green-400 text-xs rounded-xl transition-colors">
                📱 WhatsApp
              </a>
              <Link href={`/${locale}/list/create`}
                className="px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs rounded-xl transition-colors">
                + {isRTL ? 'إنشاء قائمة' : 'Create List'}
              </Link>
            </div>
          </div>
        </div>

        {/* Movies grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((m, i) => m && (
            <Link key={m.slug} href={`/${locale}/movies/${m.slug}`} className="group">
              <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-gray-900">
                <Image src={m.poster_url} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                <div className="absolute top-2 start-2 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-gray-950 font-black text-xs">
                  {i + 1}
                </div>
                <div className="absolute bottom-2 start-2 end-2">
                  <p className="text-white font-bold text-xs leading-tight line-clamp-2">
                    {isRTL ? m.title_ar : m.title}
                  </p>
                  <p className="text-gray-400 text-xs">{m.year} · ★ {m.rating_overall}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">{isRTL ? 'أنشئ قائمتك الخاصة وشاركها' : 'Create your own list and share it'}</p>
          <Link href={`/${locale}/list/create`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-950 font-black rounded-xl transition-colors">
            ✨ {isRTL ? 'إنشاء قائمة جديدة' : 'Create New List'}
          </Link>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
