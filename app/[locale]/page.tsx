import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import { getMovies, getMovieOfTheDay } from '@/lib/movies'
import { getRecentPosts, getPostData } from '@/lib/blog'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS } from '@/lib/types'

interface Props { params: Promise<{ locale: string }> }

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('home')
  const tg = await getTranslations('genres')
  const tb = await getTranslations('blog')

  const movieOfDay = getMovieOfTheDay()
  const allMovies = getMovies()
  const featured = getMovies({ featured: true, limit: 6 })
  const topRated = getMovies({ sort: 'rating', limit: 8 })
  const latestPosts = getRecentPosts(3)

  const movieCount = allMovies.length
  const stats = [
    { num: `${movieCount}+`, label: t('statsMovies') },
    { num: '8', label: t('statsLanguages') },
    { num: '13', label: t('statsGenres') },
    { num: '100%', label: t('statsFree') },
  ]

  const isRTL = locale === 'ar'

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gray-950 border-b border-gray-800">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
              🎬 {t('badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/movies`}
                className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-colors shadow-lg shadow-amber-500/20">
                {t('heroCta')} →
              </Link>
              <Link href={`/${locale}/top-rated`}
                className="px-8 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm transition-colors border border-gray-700">
                {t('topRatedTitle')} ★
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 max-w-2xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl font-black gold-text">{s.num}</div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MOVIE OF THE DAY ── */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-gray-900 via-amber-950/20 to-gray-900">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: `url(${movieOfDay.backdrop_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
              <div className="flex-shrink-0 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black mb-3">
                  🎬 {t('filmOfDay')} · {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, { day: 'numeric', month: 'long' })}
                </div>
                <div className="text-5xl font-black gold-text">{movieOfDay.rating_overall}</div>
                <div className="text-gray-500 text-xs">{t('movie.ourRating')}</div>
              </div>
              <div className="flex-1 text-center md:text-start">
                <h2 className="text-2xl font-black text-white mb-1">
                  {isRTL ? movieOfDay.title_ar : movieOfDay.title}
                </h2>
                <p className="text-gray-400 text-sm mb-1">{isRTL ? movieOfDay.director_ar : movieOfDay.director} · {movieOfDay.year}</p>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                  {isRTL ? movieOfDay.description_ar : movieOfDay.description_en}
                </p>
                <Link href={`/${locale}/movies/${movieOfDay.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-colors">
                  {t('readFullReview')} →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED FILMS ── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-amber-400">⭐</span> {t('featuredTitle')}
            </h2>
            <Link href={`/${locale}/movies`} className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.slice(0, 3).map((m) => (
              <MovieCard key={m.slug} movie={m} locale={locale} variant="featured" />
            ))}
          </div>
        </section>

        {/* ── TOP RATED ── */}
        <section className="bg-gray-900/50 border-y border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <span className="text-amber-400">🏆</span> {t('topRatedTitle')}
              </h2>
              <Link href={`/${locale}/top-rated`} className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
                {t('viewAll')} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {topRated.map((m, i) => (
                <Link key={m.slug} href={`/${locale}/movies/${m.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-all">
                  <span className="text-2xl font-black text-gray-700 w-8 text-center tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                      {isRTL ? m.title_ar : m.title}
                    </p>
                    <p className="text-xs text-amber-400 font-bold">★ {m.rating_overall}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALL MOVIES GRID ── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-amber-400">🎞️</span> {t('allFilms')}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {getMovies().map((m) => (
              <MovieCard key={m.slug} movie={m} locale={locale} />
            ))}
          </div>
        </section>

        {/* ── GENRES ── */}
        <section className="bg-gray-900/50 border-y border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <span className="text-amber-400">🎭</span> {t('byGenreTitle')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {GENRE_KEYS.map((g) => (
                <Link key={g} href={`/${locale}/genre/${g}`}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-105 ${GENRE_COLORS[g]} hover:shadow-lg`}>
                  <span className="text-2xl">{GENRE_ICONS[g]}</span>
                  <span className="text-xs font-semibold text-center">{tg(g)}</span>
                  <span className="text-[10px] opacity-60">
                    {getMovies({ genre: g }).length} {t('filmsUnit')}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── BLOG POSTS ── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span className="text-amber-400">✍️</span> {tb('title')}
            </h2>
            <Link href={`/${locale}/blog`} className="text-sm text-amber-400 hover:text-amber-300 transition-colors">
              {tb('allArticles')} →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {latestPosts.map((post) => {
              const d = getPostData(post, locale)
              return (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}
                  className="group bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={post.image} alt={d.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                    <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full bg-amber-500/90 text-gray-950 text-xs font-black">{d.category}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm leading-tight line-clamp-2">{d.title}</h3>
                    <p className="text-xs text-gray-500 mt-2">🕒 {post.readTime} {tb('readTime')}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="bg-gradient-to-br from-amber-900/20 via-gray-900 to-orange-900/20 border border-amber-500/20 rounded-3xl p-10">
            <div className="text-4xl mb-4">🎬</div>
            <h2 className="text-2xl font-black text-white mb-3">
              {t('reviewMethodTitle')}
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-6">
              {t('reviewMethodText')}
            </p>
            <Link href={`/${locale}/movies`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold transition-colors">
              {t('heroCta')} 🎬
            </Link>
          </div>
        </section>

      </main>
      <Footer locale={locale} />
    </>
  )
}
