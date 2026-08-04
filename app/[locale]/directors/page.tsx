import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdUnit from '@/components/AdUnit'
import { getAllDirectors } from '@/lib/movies'
import { LOCALES } from '@/lib/types'

const BASE = 'https://cinereview-mu.vercel.app'
const LANGS = ['ar','en','fr','es','tr','de','ja','pt']

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('directorPage')
  const title = t('directorsTitle')
  const description = t('directorsSubtitle')
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/directors`,
      languages: Object.fromEntries(LANGS.map((l) => [l, `${BASE}/${l}/directors`])),
    },
    openGraph: { title, description, url: `${BASE}/${locale}/directors`, siteName: 'CineReview' },
  }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function DirectorsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('directorPage')
  const isRTL = locale === 'ar'
  const directors = getAllDirectors()
  const sorted = [...directors].sort((a, b) => b.movies.length - a.movies.length)

  return (
    <>
      <Header locale={locale} />
      <main style={{ background: '#030712' }}>
        {/* Hero */}
        <section className="border-b border-gray-800/50"
          style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-5">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16"/>
              </svg>
              {t('directorsTitle')}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{t('directorsTitle')}</h1>
            <p className="text-gray-400 text-lg max-w-2xl">{t('directorsSubtitle')}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-2xl font-black text-amber-400">{directors.length}</span>
              <span className="text-gray-500 text-sm">{isRTL ? 'مخرج في القاعدة' : 'directors in database'}</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sorted.map((director) => {
              const avgRating = (director.movies.reduce((s, m) => s + m.rating_overall, 0) / director.movies.length).toFixed(1)
              return (
                <Link
                  key={director.slug}
                  href={`/${locale}/director/${director.slug}`}
                  className="group bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 rounded-2xl p-4 transition-all card-glow shine-card text-center"
                >
                  {/* Avatar */}
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(249,115,22,0.08))', border: '1.5px solid rgba(245,158,11,0.2)' }}>
                    <svg width="28" height="28" fill="none" stroke="#f59e0b" strokeWidth="1.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>

                  <h2 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors leading-tight mb-1 line-clamp-2">
                    {isRTL ? director.name_ar : director.name}
                  </h2>
                  {isRTL && (
                    <p className="text-gray-600 text-[10px] mb-1">{director.name}</p>
                  )}

                  <div className="flex items-center justify-center gap-3 text-xs mt-2 mb-3">
                    <span className="text-gray-400">{director.movies.length} {t('films')}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <svg width="9" height="9" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {avgRating}
                    </span>
                  </div>

                  {/* Mini poster strip */}
                  <div className="flex justify-center gap-1">
                    {director.movies.slice(0, 3).map((m) => (
                      <div key={m.slug} className="relative w-8 h-11 rounded-lg overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                        <Image src={m.poster_url} alt={m.title} fill className="object-cover" sizes="32px" />
                      </div>
                    ))}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        <AdUnit slot="7654321098" format="horizontal" className="mt-8 rounded-xl overflow-hidden" />
      </main>
      <Footer locale={locale} />
    </>
  )
}
