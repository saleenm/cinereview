import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RatingCircle from '@/components/RatingCircle'
import { getMovies } from '@/lib/movies'
import { GENRE_ICONS, GENRE_COLORS, LOCALES } from '@/lib/types'
import AdUnit from '@/components/AdUnit'
import VPNBanner from '@/components/VPNBanner'

const BASE = 'https://cinereview-mu.vercel.app'
const LANGS = ['ar','en','fr','es','tr','de','ja','pt']

interface Props { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  const title = isAr ? 'أفضل الأفلام تقييماً | سينيريفيو' : 'Top Rated Movies | CineReview'
  const description = isAr
    ? 'قائمة أفضل الأفلام تقييماً على الإطلاق — مصنّفة حسب تقييمات نقدية معمّقة'
    : 'The best rated movies of all time — ranked by in-depth critical scores'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/top-rated`,
      languages: {
        ...Object.fromEntries(LANGS.map((l) => [l, `${BASE}/${l}/top-rated`])),
        'x-default': `${BASE}/ar/top-rated`,
      },
    },
    openGraph: { title, description, url: `${BASE}/${locale}/top-rated`, siteName: 'CineReview' },
  }
}

export default async function TopRatedPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('topRated')
  const tm = await getTranslations('movie')
  const tg = await getTranslations('genres')
  const isRTL = locale === 'ar'

  const movies = getMovies({ sort: 'rating' })

  const getRankStyle = (i: number) => {
    if (i === 0) return { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', size: 'text-xl' }
    if (i === 1) return { bg: 'linear-gradient(135deg, #94a3b8, #64748b)', color: '#000', size: 'text-xl' }
    if (i === 2) return { bg: 'linear-gradient(135deg, #b45309, #92400e)', color: '#fff', size: 'text-xl' }
    return { bg: 'rgba(31,41,55,0.8)', color: '#6b7280', size: 'text-sm' }
  }

  const BASE = 'https://cinereview-mu.vercel.app'
  const topRatedSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('title'),
    url: `${BASE}/${locale}/top-rated`,
    numberOfItems: movies.length,
    itemListElement: movies.slice(0, 100).map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/${locale}/movies/${m.slug}`,
      name: m.title,
    })),
  }

  const top3 = movies.slice(0, 3)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: isRTL ? 'ما هو أعلى فيلم تقييماً على سينيريفيو؟' : 'What is the highest-rated movie on CineReview?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isRTL
            ? `أعلى فيلم تقييماً هو "${top3[0]?.title_ar || top3[0]?.title}" بتقييم ${top3[0]?.rating_overall}/10`
            : `The highest-rated movie is "${top3[0]?.title}" with a rating of ${top3[0]?.rating_overall}/10`,
        },
      },
      {
        '@type': 'Question',
        name: isRTL ? 'كم عدد الأفلام المصنّفة على سينيريفيو؟' : 'How many movies are ranked on CineReview?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isRTL
            ? `يضم سينيريفيو ${movies.length}+ فيلم مصنّف ومراجع بمعايير نقدية دقيقة.`
            : `CineReview features ${movies.length}+ ranked and reviewed movies with detailed critical analysis.`,
        },
      },
      {
        '@type': 'Question',
        name: isRTL ? 'كيف يتم تصنيف الأفلام على سينيريفيو؟' : 'How are movies ranked on CineReview?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: isRTL
            ? 'يعتمد التصنيف على تقييم شامل يشمل: الإخراج، التمثيل، السيناريو، التصوير، الموسيقى، والتأثير السينمائي العام.'
            : 'Rankings are based on a comprehensive score covering direction, acting, screenplay, cinematography, music, and overall cinematic impact.',
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(topRatedSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header locale={locale} />
      <main style={{ background: '#030712' }}>
        {/* Hero */}
        <section className="border-b border-gray-800/50"
          style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(245,158,11,0.08) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-5">
              <svg width="12" height="12" fill="#f59e0b" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {t('title')}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{t('title')}</h1>
            <p className="text-gray-400 text-lg max-w-2xl">{t('subtitle')}</p>
            <div className="flex items-center gap-2 mt-4">
              <span className="text-2xl font-black text-amber-400">{movies.length}</span>
              <span className="text-gray-500 text-sm">{isRTL ? 'فيلم مُصنَّف' : 'ranked films'}</span>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Top 3 podium */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {movies.slice(0, 3).map((movie, i) => {
              const medals = ['🥇', '🥈', '🥉']
              const borderColor = i === 0 ? 'rgba(245,158,11,0.5)' : i === 1 ? 'rgba(148,163,184,0.4)' : 'rgba(180,83,9,0.4)'
              return (
                <Link key={movie.slug} href={`/${locale}/movies/${movie.slug}`}
                  className="group relative overflow-hidden rounded-2xl border transition-all card-glow"
                  style={{ borderColor, background: '#0d1117' }}>
                  <div className="relative h-40 sm:h-52 overflow-hidden">
                    <Image src={movie.poster_url} alt={movie.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                    <div className="absolute top-2 start-2 text-2xl">{medals[i]}</div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-bold text-xs leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">
                        {isRTL ? movie.title_ar : movie.title}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg width="9" height="9" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span className="text-amber-400 text-xs font-black">{movie.rating_overall.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Full list */}
          <div className="space-y-2">
            {movies.map((movie, i) => {
              const rankStyle = getRankStyle(i)
              return (
                <Link key={movie.slug} href={`/${locale}/movies/${movie.slug}`}
                  className="group flex items-center gap-4 p-3 bg-gray-900/60 border border-gray-800/50 hover:border-amber-500/30 rounded-2xl transition-all hover:bg-gray-900/80">

                  {/* Rank */}
                  <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl font-black ${rankStyle.size}`}
                    style={{ background: rankStyle.bg, color: rankStyle.color }}>
                    {i + 1}
                  </div>

                  {/* Poster */}
                  <div className="relative w-10 h-[60px] flex-shrink-0 rounded-lg overflow-hidden">
                    <Image src={movie.poster_url} alt={movie.title} fill className="object-cover" sizes="40px" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h2 className="font-bold text-white group-hover:text-amber-400 transition-colors truncate text-sm">
                        {isRTL ? movie.title_ar : movie.title}
                      </h2>
                      {movie.genres.slice(0, 1).map((g) => (
                        <span key={g} className={`text-[10px] px-2 py-0.5 rounded-full border hidden sm:inline ${GENRE_COLORS[g]}`}>
                          {GENRE_ICONS[g]} {tg(g)}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-500 text-xs">{isRTL ? movie.director_ar : movie.director} · {movie.year}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg width="9" height="9" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        {movie.imdb_rating}
                      </span>
                      <span>🍅 {movie.rotten_tomatoes}%</span>
                      {movie.awards && (
                        <span className="hidden md:inline text-amber-700 truncate">
                          {movie.awards.split('،')[0].split(',')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating circle */}
                  <div className="flex-shrink-0">
                    <RatingCircle value={movie.rating_overall} size="md" />
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="mt-10">
            <AdUnit slot="5678901234" format="horizontal" className="rounded-xl overflow-hidden" />
          </div>
          <div className="mt-8">
            <VPNBanner locale={locale} variant="compact" />
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
