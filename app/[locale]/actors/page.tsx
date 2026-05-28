import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getAllActors } from '@/lib/movies'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BreadcrumbJsonLd from '@/components/BreadcrumbJsonLd'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const title = locale === 'ar' ? 'الممثلون — CineReview' : 'Actors — CineReview'
  return { title, description: title }
}

export default async function ActorsPage({ params }: Props) {
  const { locale } = await params
  const actors = getAllActors().slice(0, 100)

  const TITLE: Record<string, string> = {
    ar: 'الممثلون', en: 'Actors', fr: 'Acteurs', es: 'Actores',
    tr: 'Oyuncular', de: 'Schauspieler', ja: '俳優', pt: 'Atores',
  }
  const FILMS: Record<string, string> = {
    ar: 'فيلم', en: 'films', fr: 'films', es: 'películas',
    tr: 'film', de: 'Filme', ja: '作品', pt: 'filmes',
  }

  return (
    <>
      <BreadcrumbJsonLd crumbs={[
        { name: locale === 'ar' ? 'الرئيسية' : 'Home', url: `https://cinereview-mu.vercel.app/${locale}` },
        { name: TITLE[locale] || 'Actors', url: `https://cinereview-mu.vercel.app/${locale}/actors` },
      ]} />
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-2">🎭 {TITLE[locale] || 'Actors'}</h1>
        <p className="text-gray-500 mb-8">{actors.length} {locale === 'ar' ? 'ممثل' : 'actors'}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {actors.map((actor) => (
            <Link
              key={actor.slug}
              href={`/${locale}/actor/${actor.slug}`}
              className="group flex flex-col items-center p-4 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500/40 transition-all hover:-translate-y-0.5"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-900/20 border border-blue-500/20 flex items-center justify-center text-2xl mb-3">
                🎭
              </div>
              <h3 className="font-bold text-white text-sm text-center group-hover:text-blue-400 transition-colors leading-tight mb-1">
                {actor.name}
              </h3>
              <span className="text-gray-500 text-xs">{actor.movies.length} {FILMS[locale] || 'films'}</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
