import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getAllActors } from '@/lib/movies'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdUnit from '@/components/AdUnit'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'
import { LOCALES } from '@/lib/types'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'ar' ? 'الممثلون — CineReview' : 'Actors — CineReview'
  return { title, description: title, robots: { index: false, follow: true } }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const TITLE: Record<string, string> = {
  ar: 'الممثلون', en: 'Actors', fr: 'Acteurs', es: 'Actores',
  tr: 'Oyuncular', de: 'Schauspieler', ja: '俳優', pt: 'Atores',
}
const FILMS: Record<string, string> = {
  ar: 'فيلم', en: 'films', fr: 'films', es: 'películas',
  tr: 'film', de: 'Filme', ja: '作品', pt: 'filmes',
}
const SUBTITLE: Record<string, string> = {
  ar: 'استكشف مسيرة أبرز النجوم السينمائيين',
  en: 'Explore the careers of cinema\'s finest performers',
  fr: 'Explorez les carrières des meilleurs acteurs',
  es: 'Explora las carreras de los mejores actores',
  tr: 'Sinemanın en iyi oyuncularını keşfet',
  de: 'Entdecke die Karrieren der besten Schauspieler',
  ja: '映画界の名優たちのキャリアを探る',
  pt: 'Explore as carreiras dos melhores atores',
}

export default async function ActorsPage({ params }: Props) {
  const { locale } = await params
  const actors = getAllActors()
  const sorted = actors.sort((a, b) => b.movies.length - a.movies.length).slice(0, 100)
  const title = TITLE[locale] || 'Actors'

  return (
    <>
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: title, url: `https://cinereview-mu.vercel.app/${locale}/actors` },
      ]} />
      <Header locale={locale} />
      <main style={{ background: '#030712' }}>
        {/* Hero */}
        <section className="border-b border-gray-800/50"
          style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-bold mb-5">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              {title}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{title}</h1>
            <p className="text-gray-400 text-lg max-w-2xl">{SUBTITLE[locale] || SUBTITLE.en}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-2xl font-black text-indigo-400">{sorted.length}</span>
              <span className="text-gray-500 text-sm">{locale === 'ar' ? 'ممثل في القاعدة' : 'actors in database'}</span>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {sorted.map((actor) => {
              const avgRating = actor.movies.length
                ? (actor.movies.reduce((s, m) => s + m.rating_overall, 0) / actor.movies.length).toFixed(1)
                : '—'
              return (
                <Link
                  key={actor.slug}
                  href={`/${locale}/actor/${actor.slug}`}
                  className="group flex flex-col items-center p-4 bg-gray-900/80 border border-gray-800/60 hover:border-indigo-500/40 rounded-2xl transition-all card-glow shine-card"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))', border: '1.5px solid rgba(99,102,241,0.2)' }}>
                    <svg width="26" height="26" fill="none" stroke="#818cf8" strokeWidth="1.5" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                  </div>

                  <h3 className="font-bold text-white text-sm text-center group-hover:text-indigo-400 transition-colors leading-tight mb-1 line-clamp-2">
                    {actor.name}
                  </h3>

                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span className="text-gray-500">{actor.movies.length} {FILMS[locale] || 'films'}</span>
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <svg width="9" height="9" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {avgRating}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
          <AdUnit slot="9876543210" format="horizontal" className="mt-8 rounded-xl overflow-hidden" />
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
