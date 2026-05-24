import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllDirectors } from '@/lib/movies'
import { LOCALES } from '@/lib/types'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations('directorPage')
  return {
    title: t('directorsTitle'),
    description: t('directorsSubtitle'),
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

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">🎬 {t('directorsTitle')}</h1>
          <p className="text-gray-500">{t('directorsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {directors.map((director) => (
            <Link
              key={director.slug}
              href={`/${locale}/director/${director.slug}`}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-amber-500/40 transition-all hover:shadow-lg hover:shadow-amber-500/5 text-center"
            >
              {/* Avatar */}
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-900/20 border border-amber-500/20 flex items-center justify-center text-2xl">
                🎬
              </div>
              <h2 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors leading-tight mb-1">
                {isRTL ? director.name_ar : director.name}
              </h2>
              <p className="text-xs text-gray-500">
                {director.movies.length} {t('films')}
              </p>
              {/* Mini poster strip */}
              <div className="flex justify-center gap-1 mt-3">
                {director.movies.slice(0, 3).map((m) => (
                  <div key={m.slug} className="relative w-8 h-11 rounded overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                    <Image src={m.poster_url} alt={m.title} fill className="object-cover" sizes="32px" />
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
