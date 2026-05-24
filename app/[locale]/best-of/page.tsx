import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAvailableYears, getMoviesByYear } from '@/lib/movies'
import { LOCALES } from '@/lib/types'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('bestOf')
  return { title: t('yearsTitle'), description: t('subtitle') }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function BestOfPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('bestOf')
  const years = getAvailableYears()

  // Group by decade
  const decades = new Map<number, number[]>()
  for (const year of years) {
    const decade = Math.floor(year / 10) * 10
    if (!decades.has(decade)) decades.set(decade, [])
    decades.get(decade)!.push(year)
  }

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">📅 {t('yearsTitle')}</h1>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="space-y-8">
          {Array.from(decades.entries()).sort((a, b) => b[0] - a[0]).map(([decade, decadeYears]) => (
            <div key={decade}>
              <h2 className="text-lg font-bold text-amber-400 mb-3">{decade}s</h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {decadeYears.sort((a, b) => b - a).map((year) => {
                  const count = getMoviesByYear(year).length
                  return (
                    <Link
                      key={year}
                      href={`/${locale}/best-of/${year}`}
                      className="group flex flex-col items-center justify-center p-3 bg-gray-900 border border-gray-800 rounded-xl hover:border-amber-500/40 hover:bg-gray-800 transition-all"
                    >
                      <span className="text-white font-bold text-lg group-hover:text-amber-400 transition-colors">{year}</span>
                      <span className="text-xs text-gray-600">{count} {t('title').split(' ')[0]}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
