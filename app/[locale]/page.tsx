import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import BlogImage from '@/components/BlogImage'
import { getMovies, getMovieOfTheDay } from '@/lib/movies'
import { getRecentPosts, getPostData } from '@/lib/blog'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS } from '@/lib/types'
import AdUnit from '@/components/AdUnit'

interface Props { params: Promise<{ locale: string }> }

const BASE = 'https://cinereview-mu.vercel.app'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  const topMovie = getMovies({ sort: 'rating', limit: 1 })[0]
  const ogImage = topMovie?.backdrop_url || topMovie?.poster_url || `${BASE}/logos/icon-512.png`
  const title = isAr ? 'سينيريفيو — اكتشف عوالم السينما' : 'CineReview — Discover the World of Cinema'
  const description = isAr
    ? 'تقييمات تحقيقية معمّقة لأعظم الأفلام على مر العصور — 1000+ فيلم بـ 8 لغات'
    : 'In-depth investigative reviews of the greatest films of all time — 1000+ movies in 8 languages'
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: Object.fromEntries(['ar','en','fr','es','tr','de','ja','pt'].map((l) => [l, `${BASE}/${l}`])),
    },
    openGraph: { title, description, url: `${BASE}/${locale}`, siteName: 'CineReview', images: [{ url: ogImage, width: 1280, height: 720, alt: title }], type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  }
}

function SectionHeader({ icon, title, link, linkLabel }: { icon: React.ReactNode; title: string; link?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="section-accent text-xl font-black text-white">
        <span className="flex items-center gap-2">
          <span className="text-amber-400">{icon}</span>
          {title}
        </span>
      </h2>
      {link && (
        <Link href={link} className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium group">
          {linkLabel}
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      )}
    </div>
  )
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('home')
  const tg = await getTranslations('genres')
  const tb = await getTranslations('blog')

  const movieOfDay = getMovieOfTheDay()
  const allMovies = getMovies()
  const featured = getMovies({ featured: true, limit: 6 })
  const topRated = getMovies({ sort: 'rating', limit: 8 })
  const latestMovies = allMovies.slice(-24).reverse()
  const latestPosts = getRecentPosts(3)

  const genreRows = [
    { genre: 'action', emoji: '💥' },
    { genre: 'drama', emoji: '🎭' },
    { genre: 'thriller', emoji: '😨' },
    { genre: 'animation', emoji: '🎨' },
  ].map(({ genre, emoji }) => ({
    genre, emoji,
    movies: getMovies({ genre: genre as any, sort: 'rating', limit: 8 }),
  })).filter(r => r.movies.length >= 4)

  const movieCount = allMovies.length
  const stats = [
    { num: `${movieCount}+`, label: t('statsMovies'), icon: '🎬' },
    { num: '8',              label: t('statsLanguages'), icon: '🌐' },
    { num: '13',             label: t('statsGenres'), icon: '🎭' },
    { num: '100%',           label: t('statsFree'), icon: '✨' },
  ]

  const isRTL = locale === 'ar'

  const BASE = 'https://cinereview-mu.vercel.app'

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CineReview',
    url: BASE,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/${locale}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Rated Movies',
    url: `${BASE}/${locale}/top-rated`,
    numberOfItems: topRated.length,
    itemListElement: topRated.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}/${locale}/movies/${m.slug}`,
      name: m.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <Header locale={locale} />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden hero-bg border-b border-gray-800/50">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          {/* Film strip accent top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          {/* Side glow orbs */}
          <div className="absolute top-20 -left-32 w-96 h-96 bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 -right-32 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-sm font-semibold mb-7 shadow-lg shadow-amber-500/5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {t('badge')}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black mb-5 leading-[1.05] tracking-tight">
              <span className="cinema-title">{t('heroTitle')}</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/${locale}/movies`}
                className="px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center gap-2">
                {t('heroCta')}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href={`/${locale}/top-rated`}
                className="px-8 py-3.5 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-white font-semibold text-sm transition-all border border-gray-700/60 hover:border-gray-600 hover:-translate-y-0.5 flex items-center gap-2 backdrop-blur-sm">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {t('topRatedTitle')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px mt-16 max-w-2xl mx-auto bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-800/50">
              {stats.map((s) => (
                <div key={s.label} className="bg-gray-950/80 text-center py-5 px-4 hover:bg-gray-900/80 transition-colors">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-black gold-text tabular-nums">{s.num}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MOVIE OF THE DAY ── */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gray-900/80"
            style={{ backgroundImage: movieOfDay.backdrop_url ? `url(${movieOfDay.backdrop_url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent" />
            {/* Amber glow accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

            <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
              {/* Poster */}
              <div className="relative w-32 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-amber-500/30 hidden md:block">
                <Image src={movieOfDay.poster_url} alt={movieOfDay.title} fill className="object-cover" sizes="128px" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black mb-4">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  {t('filmOfDay')} · {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, { day: 'numeric', month: 'long' })}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-1 leading-tight">
                  {isRTL ? movieOfDay.title_ar : movieOfDay.title}
                </h2>
                <p className="text-gray-400 text-sm mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                  <span>{isRTL ? movieOfDay.director_ar : movieOfDay.director}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{movieOfDay.year}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{movieOfDay.duration}{locale === 'ar' ? 'د' : 'm'}</span>
                </p>
                <p className="text-gray-400 text-sm line-clamp-2 mb-5 max-w-xl">
                  {isRTL ? movieOfDay.description_ar : movieOfDay.description_en}
                </p>
                <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                  <Link href={`/${locale}/movies/${movieOfDay.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/25 hover:-translate-y-0.5">
                    {t('readFullReview')}
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-black gold-text">{movieOfDay.rating_overall}</span>
                    <span className="text-gray-500 text-xs">/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── AD ── */}
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <AdUnit slot="2345678901" format="horizontal" className="rounded-xl overflow-hidden" />
        </div>

        {/* ── FEATURED FILMS ── */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <SectionHeader icon="⭐" title={t('featuredTitle')} link={`/${locale}/movies`} linkLabel={t('viewAll')} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.slice(0, 3).map((m) => (
              <MovieCard key={m.slug} movie={m} locale={locale} variant="featured" />
            ))}
          </div>
        </section>

        {/* ── TOP RATED ── */}
        <section className="border-y border-gray-800/50 py-12"
          style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 50%, rgba(245,158,11,0.03) 0%, transparent 70%), #0a0e17' }}>
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader icon="🏆" title={t('topRatedTitle')} link={`/${locale}/top-rated`} linkLabel={t('viewAll')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {topRated.map((m, i) => (
                <Link key={m.slug} href={`/${locale}/movies/${m.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 transition-all card-glow">
                  <span className={`text-xl font-black w-8 text-center tabular-nums flex-shrink-0 ${
                    i === 0 ? 'gold-text' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-700' : 'text-gray-700'
                  }`}>{i + 1}</span>
                  <div className="relative w-9 h-13 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                    <Image src={m.poster_url} alt={m.title} fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-white group-hover:text-amber-400 transition-colors truncate leading-tight">
                      {isRTL ? m.title_ar : m.title}
                    </p>
                    <p className="text-xs text-amber-400 font-bold mt-0.5">★ {m.rating_overall}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── LATEST ADDITIONS ── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeader icon="🆕" title={isRTL ? 'أحدث الإضافات' : 'Latest Additions'}
            link={`/${locale}/movies`} linkLabel={`${t('allFilms')} (${movieCount})`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {latestMovies.map((m) => (
              <MovieCard key={m.slug} movie={m} locale={locale} />
            ))}
          </div>
        </section>

        {/* ── GENRE ROWS ── */}
        {genreRows.map(({ genre, emoji, movies }) => (
          <section key={genre} className="max-w-7xl mx-auto px-4 py-8">
            <SectionHeader
              icon={emoji}
              title={isRTL ? tg(genre as any) : genre.charAt(0).toUpperCase() + genre.slice(1)}
              link={`/${locale}/genre/${genre}`}
              linkLabel={isRTL ? 'عرض الكل' : 'See all'}
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {movies.map((m) => (
                <MovieCard key={m.slug} movie={m} locale={locale} />
              ))}
            </div>
          </section>
        ))}

        {/* ── GENRES SHOWCASE ── */}
        <section className="border-y border-gray-800/50 py-12"
          style={{ background: '#0a0e17' }}>
          <div className="max-w-7xl mx-auto px-4">
            <SectionHeader icon="🎭" title={t('byGenreTitle')} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {GENRE_KEYS.map((g) => {
                const count = getMovies({ genre: g }).length
                return (
                  <Link key={g} href={`/${locale}/genre/${g}`}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-105 hover:shadow-lg shine-card ${GENRE_COLORS[g]}`}>
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{GENRE_ICONS[g]}</span>
                    <span className="text-xs font-bold text-center leading-tight">{tg(g)}</span>
                    <span className="text-[10px] opacity-50 tabular-nums">{count} {t('filmsUnit')}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── BLOG POSTS ── */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionHeader icon="✍️" title={tb('title')} link={`/${locale}/blog`} linkLabel={tb('allArticles')} />
          <div className="grid sm:grid-cols-3 gap-5">
            {latestPosts.map((post) => {
              const d = getPostData(post, locale)
              return (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}
                  className="group bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all card-glow shine-card">
                  <div className="relative h-44 overflow-hidden bg-gray-800">
                    <BlogImage src={post.image} alt={d.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black shadow-lg">
                      {d.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm leading-tight line-clamp-2 mb-2">
                      {d.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {post.readTime} {tb('readTime')}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 text-center p-12"
            style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(245,158,11,0.12) 0%, rgba(249,115,22,0.05) 40%, transparent 70%), #0d1117' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M10 9l6 3-6 3V9z" fill="#f59e0b" stroke="none"/>
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3">{t('reviewMethodTitle')}</h2>
              <p className="text-gray-400 max-w-lg mx-auto mb-7 leading-relaxed">{t('reviewMethodText')}</p>
              <Link href={`/${locale}/movies`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5">
                {t('heroCta')}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer locale={locale} />
    </>
  )
}
