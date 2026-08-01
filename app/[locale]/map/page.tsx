import Link from 'next/link'
import Image from 'next/image'
import { getMovies } from '@/lib/movies'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://cinereview-mu.vercel.app'
const LANGS = ['ar','en','fr','es','tr','de','ja','pt']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'ar' ? 'أفلام حول العالم | CineReview' : 'Movies Around the World | CineReview'
  const description = locale === 'ar' ? 'اكتشف أفلاماً من كل دولة حول العالم' : 'Discover films from every country around the world'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/map`,
      languages: Object.fromEntries(LANGS.map((l) => [l, `${BASE}/${l}/map`])),
    },
    openGraph: { title, description, url: `${BASE}/${locale}/map`, siteName: 'CineReview' },
  }
}

// Normalize language → country info
const LANG_MAP: Record<string, { country: string; country_ar: string; flag: string; region: string }> = {
  english:   { country: 'USA / UK',    country_ar: 'أمريكا / بريطانيا', flag: '🇺🇸', region: 'americas' },
  french:    { country: 'France',      country_ar: 'فرنسا',             flag: '🇫🇷', region: 'europe' },
  spanish:   { country: 'Spain / LatAm', country_ar: 'إسبانيا',        flag: '🇪🇸', region: 'europe' },
  italian:   { country: 'Italy',       country_ar: 'إيطاليا',           flag: '🇮🇹', region: 'europe' },
  german:    { country: 'Germany',     country_ar: 'ألمانيا',           flag: '🇩🇪', region: 'europe' },
  japanese:  { country: 'Japan',       country_ar: 'اليابان',           flag: '🇯🇵', region: 'asia' },
  korean:    { country: 'South Korea', country_ar: 'كوريا الجنوبية',   flag: '🇰🇷', region: 'asia' },
  arabic:    { country: 'Arab World',  country_ar: 'العالم العربي',     flag: '🌍', region: 'mena' },
  hindi:     { country: 'India',       country_ar: 'الهند',             flag: '🇮🇳', region: 'asia' },
  russian:   { country: 'Russia',      country_ar: 'روسيا',             flag: '🇷🇺', region: 'europe' },
  portuguese: { country: 'Brazil / Portugal', country_ar: 'البرازيل',  flag: '🇧🇷', region: 'americas' },
  turkish:   { country: 'Turkey',      country_ar: 'تركيا',             flag: '🇹🇷', region: 'mena' },
  persian:   { country: 'Iran',        country_ar: 'إيران',             flag: '🇮🇷', region: 'mena' },
  swedish:   { country: 'Sweden',      country_ar: 'السويد',            flag: '🇸🇪', region: 'europe' },
  danish:    { country: 'Denmark',     country_ar: 'الدنمارك',          flag: '🇩🇰', region: 'europe' },
  latvian:   { country: 'Latvia',      country_ar: 'لاتفيا',            flag: '🇱🇻', region: 'europe' },
  mandarin:  { country: 'China',       country_ar: 'الصين',             flag: '🇨🇳', region: 'asia' },
}

function normalizeLang(lang: string): string {
  const l = lang.toLowerCase().split('/')[0].trim()
  if (l === 'en') return 'english'
  if (l === 'fr') return 'french'
  if (l === 'es') return 'spanish'
  if (l === 'it') return 'italian'
  if (l === 'de') return 'german'
  if (l === 'ja') return 'japanese'
  if (l === 'ko') return 'korean'
  if (l === 'ar') return 'arabic'
  if (l === 'hi') return 'hindi'
  if (l === 'ru') return 'russian'
  if (l === 'pt') return 'portuguese'
  if (l === 'tr') return 'turkish'
  if (l === 'fa') return 'persian'
  if (l === 'sv') return 'swedish'
  if (l === 'da') return 'danish'
  if (l === 'lv') return 'latvian'
  if (l === 'cn') return 'mandarin'
  return l
}

const REGIONS: Record<string, { label: string; label_ar: string }> = {
  americas: { label: 'Americas', label_ar: 'الأمريكتان' },
  europe:   { label: 'Europe',   label_ar: 'أوروبا' },
  asia:     { label: 'Asia',     label_ar: 'آسيا' },
  mena:     { label: 'MENA',     label_ar: 'الشرق الأوسط وأفريقيا' },
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params
  const isRTL = locale === 'ar'
  const movies = getMovies()

  // Group by normalized language
  const byLang: Record<string, typeof movies> = {}
  for (const m of movies) {
    const key = normalizeLang(m.language || 'english')
    if (!byLang[key]) byLang[key] = []
    byLang[key].push(m)
  }

  // Build country groups
  const groups = Object.entries(byLang)
    .map(([lang, films]) => ({
      lang,
      info: LANG_MAP[lang] || { country: lang, country_ar: lang, flag: '🌐', region: 'other' },
      films: films.sort((a, b) => b.rating_overall - a.rating_overall),
      count: films.length,
    }))
    .filter(g => g.count > 0)
    .sort((a, b) => b.count - a.count)

  // Group by region
  const byRegion: Record<string, typeof groups> = {}
  for (const g of groups) {
    const r = g.info.region
    if (!byRegion[r]) byRegion[r] = []
    byRegion[r].push(g)
  }

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-2">
          🗺️ {isRTL ? 'أفلام حول العالم' : 'Movies Around the World'}
        </h1>
        <p className="text-gray-500 mb-10">
          {isRTL
            ? `${movies.length} فيلم من ${groups.length} لغة حول العالم`
            : `${movies.length} films from ${groups.length} languages worldwide`}
        </p>

        {Object.entries(REGIONS).map(([regionKey, regionInfo]) => {
          const regionGroups = byRegion[regionKey]
          if (!regionGroups?.length) return null
          return (
            <section key={regionKey} className="mb-12">
              <h2 className="text-xl font-black text-amber-400 mb-6">
                {isRTL ? regionInfo.label_ar : regionInfo.label}
              </h2>
              <div className="space-y-8">
                {regionGroups.map(({ lang, info, films }) => (
                  <div key={lang} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{info.flag}</span>
                      <div>
                        <h3 className="text-white font-black text-lg">{isRTL ? info.country_ar : info.country}</h3>
                        <p className="text-gray-500 text-sm">{films.length} {isRTL ? 'فيلم' : 'films'}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                      {films.slice(0, 8).map(m => (
                        <Link key={m.slug} href={`/${locale}/movies/${m.slug}`} className="group flex-shrink-0">
                          <div className="relative w-20 h-28 rounded-xl overflow-hidden">
                            <Image src={m.poster_url} alt={m.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent" />
                            <div className="absolute bottom-1 start-1 end-1">
                              <p className="text-white text-xs font-bold leading-tight line-clamp-2">{isRTL ? m.title_ar : m.title}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      {films.length > 8 && (
                        <Link href={`/${locale}/movies?lang=${lang}`}
                          className="flex-shrink-0 w-20 h-28 rounded-xl bg-gray-800 border border-gray-700 flex flex-col items-center justify-center gap-1 hover:bg-gray-700 transition-colors">
                          <span className="text-amber-400 font-black text-lg">+{films.length - 8}</span>
                          <span className="text-gray-500 text-xs">{isRTL ? 'المزيد' : 'more'}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </main>
      <Footer locale={locale} />
    </>
  )
}
