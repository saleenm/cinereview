import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RatingCircle from '@/components/RatingCircle'
import { getMovies } from '@/lib/movies'
import { LOCALES } from '@/lib/types'
import AdUnit from '@/components/AdUnit'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const PAGE_META: Record<string, { title: string; description: string }> = {
  ar: { title: 'ما الجديد — أحدث الأفلام المضافة', description: 'آخر الأفلام التي أضفناها إلى سينيريفيو — اكتشف ما وصل جديداً' },
  en: { title: 'What\'s New — Latest Added Films', description: 'The newest films added to CineReview — discover what just arrived' },
  fr: { title: 'Quoi de neuf — Derniers films ajoutés', description: 'Les nouveaux films ajoutés à CineReview' },
  es: { title: 'Novedades — Últimas películas añadidas', description: 'Las películas más recientes añadidas a CineReview' },
  tr: { title: 'Yenilikler — Son Eklenen Filmler', description: 'CineReview\'a eklenen en yeni filmler' },
  de: { title: 'Neuheiten — Zuletzt hinzugefügte Filme', description: 'Die neuesten Filme bei CineReview' },
  ja: { title: '新着 — 最近追加された映画', description: 'CineReviewに追加された最新の映画' },
  pt: { title: 'Novidades — Últimos filmes adicionados', description: 'Os filmes mais recentes adicionados ao CineReview' },
}

const UI: Record<string, Record<string, string>> = {
  ar: { heading: '✨ ما الجديد', sub: 'أحدث الأفلام المضافة إلى موقعنا', badge: 'جديد', allLoaded: 'هذه جميع الأفلام المضافة حديثاً' },
  en: { heading: '✨ What\'s New', sub: 'The latest films added to our database', badge: 'New', allLoaded: 'All recently added films shown' },
  fr: { heading: '✨ Quoi de neuf', sub: 'Les derniers films ajoutés à notre base', badge: 'Nouveau', allLoaded: 'Tous les films récents affichés' },
  es: { heading: '✨ Novedades', sub: 'Las últimas películas añadidas', badge: 'Nuevo', allLoaded: 'Todos los filmes recientes mostrados' },
  tr: { heading: '✨ Yenilikler', sub: 'En son eklenen filmler', badge: 'Yeni', allLoaded: 'Tüm yeni filmler gösterildi' },
  de: { heading: '✨ Neuheiten', sub: 'Die neuesten hinzugefügten Filme', badge: 'Neu', allLoaded: 'Alle neuen Filme angezeigt' },
  ja: { heading: '✨ 新着情報', sub: '最近追加された映画', badge: '新着', allLoaded: 'すべての新着映画を表示' },
  pt: { heading: '✨ Novidades', sub: 'Os últimos filmes adicionados', badge: 'Novo', allLoaded: 'Todos os filmes recentes exibidos' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = PAGE_META[locale] || PAGE_META.en
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `https://cinereview-mu.vercel.app/${locale}/new` },
  }
}

export default async function NewMoviesPage({ params }: Props) {
  const { locale } = await params
  const isRTL = locale === 'ar'
  const ui = UI[locale] || UI.en

  // Recently added = last N movies pushed to the array (reversed)
  const movies = getMovies({ sort: 'recent', limit: 60 })

  return (
    <>
      <Header locale={locale} />

      <main id="main-content" className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* ── Page header ── */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 gsap-heading" style={{ fontFamily: 'var(--font-cinzel,Cinzel,serif)' }}>
            {ui.heading}
          </h1>
          <p className="text-gray-400 text-lg">{ui.sub}</p>
          <div className="cin-section-line h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mt-6 mx-auto max-w-md" />
        </div>

        {/* ── AdSense ── */}
        <div className="mb-8">
          <AdUnit slot="3987654321" format="horizontal" />
        </div>

        {/* ── Movie grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gsap-grid">
          {movies.map((movie, i) => (
            <div key={movie.slug} className="gsap-card">
              <Link
                href={`/${locale}/movies/${movie.slug}`}
                className="group block card-glow rounded-xl overflow-hidden bg-gray-900/60 border border-gray-800/50 hover:border-amber-500/30 transition-all duration-300"
              >
                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={movie.poster_url}
                    alt={isRTL ? movie.title_ar : movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    loading={i < 10 ? 'eager' : 'lazy'}
                  />
                  {/* NEW badge on first 20 */}
                  {i < 20 && (
                    <div className="absolute top-2 start-2 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {ui.badge}
                    </div>
                  )}
                  {/* Rating overlay */}
                  <div className="absolute top-2 end-2">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg px-1.5 py-0.5 text-amber-400 font-bold text-xs">
                      ★ {movie.rating_overall}
                    </div>
                  </div>
                  {/* Bottom gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-gray-950 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-3">
                  <h2 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {isRTL ? movie.title_ar : movie.title}
                  </h2>
                  <p className="text-gray-500 text-xs">{movie.year} · {movie.director}</p>
                  {movie.genres.slice(0, 2).length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {movie.genres.slice(0, 2).map(g => (
                        <span key={g} className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-12">{ui.allLoaded}</p>
      </main>

      <Footer locale={locale} />
    </>
  )
}
