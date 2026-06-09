import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MovieCard from '@/components/MovieCard'
import BlogImage from '@/components/BlogImage'
import CinematicBackground from '@/components/CinematicBackground'
import CinematicEffects from '@/components/CinematicEffects'
import CinematicFilmGrid from '@/components/CinematicFilmGrid'
import AdUnit from '@/components/AdUnit'
import { getMovies, getMovieOfTheDay } from '@/lib/movies'
import { getRecentPosts, getPostData } from '@/lib/blog'
import { GENRE_KEYS, GENRE_ICONS, GENRE_COLORS } from '@/lib/types'

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

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations('home')
  const tg = await getTranslations('genres')
  const tb = await getTranslations('blog')

  const movieOfDay   = getMovieOfTheDay()
  const allMovies    = getMovies()
  const featured     = getMovies({ featured: true, limit: 8 })
  const topRated     = getMovies({ sort: 'rating', limit: 8 })
  const latestMovies = allMovies.slice(-24).reverse()
  const latestPosts  = getRecentPosts(3)
  const movieCount   = allMovies.length
  const isRTL        = locale === 'ar'

  /* Top-5 for cinematic grid (prefer featured, fallback to top-rated) */
  const gridMovies = featured.length >= 5 ? featured.slice(0, 5) : topRated.slice(0, 5)

  const genreRows = [
    { genre: 'action',    emoji: '💥' },
    { genre: 'drama',     emoji: '🎭' },
    { genre: 'thriller',  emoji: '😨' },
    { genre: 'animation', emoji: '🎨' },
  ].map(({ genre, emoji }) => ({
    genre, emoji,
    movies: getMovies({ genre: genre as any, sort: 'rating', limit: 8 }),
  })).filter(r => r.movies.length >= 4)

  const stats = [
    { num: movieCount,   label: isRTL ? 'فيلم في القاعدة'  : 'Movies',    suffix: '+' },
    { num: 8,            label: isRTL ? 'لغة مدعومة'        : 'Languages', suffix: '' },
    { num: 13,           label: isRTL ? 'تصنيف سينمائي'     : 'Genres',   suffix: '' },
    { num: 100,          label: isRTL ? 'مجاني تماماً'      : 'Free',      suffix: '%' },
  ]

  const marqueeItems = [
    'أفلام الأكشن','الرعب والغموض','الخيال العلمي','الدراما العالمية',
    'الأنيمي','الكلاسيكيات','الجوائز والمهرجانات',
  ]

  const websiteSchema = {
    '@context': 'https://schema.org', '@type': 'WebSite', name: 'CineReview', url: BASE,
    potentialAction: { '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/${locale}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string' },
  }
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Top Rated Movies',
    url: `${BASE}/${locale}/top-rated`, numberOfItems: topRated.length,
    itemListElement: topRated.map((m, i) => ({
      '@type': 'ListItem', position: i+1,
      url: `${BASE}/${locale}/movies/${m.slug}`, name: m.title,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* ── Fixed cinematic background (WebGL + orbs) ── */}
      <CinematicBackground />

      {/* ── Fixed UI effects (cursor, loader, progress, grain, vignette) ── */}
      <CinematicEffects />

      <Header locale={locale} />

      <main className="flex-1" style={{ position:'relative', zIndex:10 }}>

        {/* ═══════════════════ HERO ═══════════════════ */}
        <section className="cin-hero-bg" style={{
          position:'relative', zIndex:10,
          height:'100vh', display:'flex', flexDirection:'column',
          justifyContent:'center', alignItems:'center',
          textAlign:'center', padding:'0 20px',
        }}>
          {/* Eyebrow */}
          <p style={{
            fontFamily:'var(--font-cinzel,Cinzel,serif)',
            fontSize:'0.7rem', letterSpacing:8, color:'var(--cin-gold)',
            marginBottom:24,
            animation:'fadeUp 1s forwards 0.3s', opacity:0,
          }}>
            ◆ &nbsp; {isRTL ? 'اكتشف عالم السينما' : 'Discover the World of Cinema'} &nbsp; ◆
          </p>

          {/* Title with decode animation */}
          <h1 style={{
            fontFamily:'var(--font-cinzel,Cinzel,serif)',
            fontSize:'clamp(3.5rem,10vw,9rem)', fontWeight:900,
            lineHeight:0.9, letterSpacing:-2, marginBottom:30,
            animation:'fadeUp 1s forwards 0.6s', opacity:0,
          }}>
            <span
              data-decode={isRTL ? 'سينيما' : 'CINEMA'}
              style={{
                display:'block',
                background:'linear-gradient(135deg, #fff 0%, var(--cin-gold) 50%, #fff 100%)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundSize:'200% 200%',
                animation:'cin-shimmer 3s infinite 1.5s',
              }}
            >
              {isRTL ? 'سينيما' : 'CINEMA'}
            </span>
            <span style={{
              display:'block', color:'transparent',
              WebkitTextStroke:'1px rgba(212,168,82,0.5)',
              fontSize:'0.55em', letterSpacing:'0.18em',
            }}>
              {isRTL ? 'WORLD' : 'عالم السينما'}
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize:'1rem', color:'rgba(232,220,200,0.5)',
            letterSpacing:3, maxWidth:500, marginBottom:50, lineHeight:1.8,
            animation:'fadeUp 1s forwards 0.9s', opacity:0,
          }}>
            {isRTL
              ? 'مراجعات سينمائية بعمق وشغف — حيث كل فيلم يحكي قصة تستحق أن تُروى'
              : 'Cinematic reviews with depth and passion — where every film tells a story worth telling'}
          </p>

          {/* CTA buttons */}
          <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center', animation:'fadeUp 1s forwards 1.2s', opacity:0 }}>
            <Link href={`/${locale}/movies`} className="cin-magnetic" style={{
              padding:'16px 48px',
              background:'linear-gradient(135deg,var(--cin-gold),var(--cin-gold2))',
              color:'#000', fontFamily:'var(--font-cairo,Cairo,sans-serif)',
              fontWeight:700, fontSize:'0.9rem', letterSpacing:2,
              textTransform:'uppercase', border:'none',
              clipPath:'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)',
              transition:'transform 0.2s, box-shadow 0.3s', textDecoration:'none',
              display:'inline-block',
            }}>
              {isRTL ? 'استكشف الأفلام' : 'Explore Films'}
            </Link>
            <Link href={`/${locale}/top-rated`} className="cin-magnetic" style={{
              padding:'16px 48px',
              background:'transparent', color:'var(--cin-gold)',
              fontFamily:'var(--font-cairo,Cairo,sans-serif)',
              fontSize:'0.9rem', letterSpacing:2, textTransform:'uppercase',
              border:'1px solid rgba(212,168,82,0.3)',
              transition:'all 0.2s', textDecoration:'none', display:'inline-block',
            }}>
              {isRTL ? 'آخر المراجعات' : 'Top Rated'}
            </Link>
          </div>

          {/* Scroll indicator */}
          <div style={{
            position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:8,
            animation:'fadeIn 1s forwards 2s', opacity:0,
          }}>
            <span style={{ fontSize:'0.6rem', letterSpacing:4, color:'rgba(212,168,82,0.5)', textTransform:'uppercase', writingMode:'vertical-lr' }}>scroll</span>
            <div style={{ width:1, height:60, background:'linear-gradient(to bottom,var(--cin-gold),transparent)', animation:'scrollPulse 2s infinite' }} />
          </div>
        </section>

        {/* ═══════════════════ MARQUEE ═══════════════════ */}
        <div style={{
          position:'relative', zIndex:10,
          padding:'40px 0', overflow:'hidden',
          borderTop:'1px solid rgba(212,168,82,0.08)',
          borderBottom:'1px solid rgba(212,168,82,0.08)',
        }}>
          <div className="cin-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:16, fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'1rem', letterSpacing:4, color:'rgba(212,168,82,0.3)', textTransform:'uppercase', flexShrink:0 }}>
                <span style={{ width:4, height:4, borderRadius:'50%', background:'var(--cin-gold)', opacity:0.5, display:'inline-block' }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════ CINEMATIC FILM GRID ═══════════════════ */}
        <section style={{ position:'relative', zIndex:10, padding:'100px 60px' }} className="max-md:!px-6 max-md:!py-16">
          <div style={{ display:'flex', alignItems:'center', gap:30, marginBottom:50 }}>
            <div style={{ fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'0.75rem', letterSpacing:8, color:'var(--cin-gold)', textTransform:'uppercase', whiteSpace:'nowrap' }}>
              {isRTL ? 'أبرز الأفلام' : 'Featured Films'}
            </div>
            <div className="cin-section-line" />
          </div>
          <CinematicFilmGrid movies={gridMovies} locale={locale} />
        </section>

        {/* ═══════════════════ STATS ROW ═══════════════════ */}
        <div className="cin-stats-row" style={{ position:'relative', zIndex:10, padding:'0' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding:'40px', textAlign:'center', position:'relative', background:'rgba(8,8,15,0.7)',
            }} className="cin-reveal">
              {i < stats.length - 1 && (
                <div style={{ position:'absolute', right:0, top:'20%', bottom:'20%', width:1, background:'rgba(212,168,82,0.15)' }} />
              )}
              <div style={{
                fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'3.5rem', fontWeight:900,
                background:'linear-gradient(135deg,var(--cin-gold),var(--cin-gold2))',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                lineHeight:1, marginBottom:10,
              }}>
                <span data-cin-count={s.num}>0</span>{s.suffix}
              </div>
              <div style={{ fontSize:'0.7rem', letterSpacing:4, color:'rgba(232,220,200,0.4)', textTransform:'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ═══════════════════ MOVIE OF THE DAY ═══════════════════ */}
        <section className="max-w-7xl mx-auto px-4 py-10" style={{ position:'relative', zIndex:10 }}>
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gray-900/80"
            style={{ backgroundImage: movieOfDay.backdrop_url ? `url(${movieOfDay.backdrop_url})` : undefined, backgroundSize:'cover', backgroundPosition:'center' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/50 to-transparent" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8">
              <div className="relative w-32 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-amber-500/30 hidden md:block">
                <Image src={movieOfDay.poster_url} alt={movieOfDay.title} fill className="object-cover" sizes="128px" />
              </div>
              <div className="flex-1 text-center md:text-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black mb-4">
                  ★ {t('filmOfDay')} · {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, { day:'numeric', month:'long' })}
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

        {/* ── Ad ── */}
        <div className="max-w-4xl mx-auto px-4 pt-2 pb-4" style={{ position:'relative', zIndex:10 }}>
          <AdUnit slot="2345678901" format="horizontal" className="rounded-xl overflow-hidden" />
        </div>

        {/* ═══════════════════ TOP RATED ═══════════════════ */}
        <section style={{ position:'relative', zIndex:10, padding:'100px 60px' }} className="max-md:!px-6 max-md:!py-16" id="rated">
          <div style={{ display:'flex', alignItems:'center', gap:30, marginBottom:50 }}>
            <div style={{ fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'0.75rem', letterSpacing:8, color:'var(--cin-gold)', textTransform:'uppercase', whiteSpace:'nowrap' }}>
              {isRTL ? 'الأعلى تقييماً' : 'Top Rated'}
            </div>
            <div className="cin-section-line" />
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
            {topRated.slice(0, 6).map((m, i) => (
              <Link key={m.slug} href={`/${locale}/movies/${m.slug}`}
                className="cin-rated-item cin-reveal cin-reveal-x" style={{ textDecoration:'none' }}>
                <div style={{ fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'2rem', fontWeight:900, color:'rgba(212,168,82,0.15)', textAlign:'center' }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                {/* Poster thumbnail */}
                <div style={{ width:70, height:95, flexShrink:0, position:'relative', overflow:'hidden' }}>
                  <Image src={m.poster_url} alt={isRTL ? m.title_ar : m.title} fill className="object-cover" sizes="70px" />
                </div>
                {/* Info */}
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'1.1rem', marginBottom:6, color:'#fff' }}>
                    {isRTL ? m.title_ar : m.title}
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {m.genres.slice(0,2).map(g => (
                      <span key={g} style={{ padding:'3px 12px', border:'1px solid rgba(212,168,82,0.2)', fontSize:'0.6rem', letterSpacing:2, color:'rgba(212,168,82,0.6)', textTransform:'uppercase' }}>
                        {tg(g)}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Year */}
                <div className="cin-rated-hide-mobile" style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.3)', fontFamily:'var(--font-cinzel,Cinzel,serif)' }}>
                  {m.year}
                </div>
                {/* Score bar */}
                <div className="cin-rated-hide-mobile" style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:80, height:3, background:'rgba(255,255,255,0.1)', borderRadius:2, overflow:'hidden' }}>
                    <div
                      data-cin-score={Math.round(m.rating_overall * 10)}
                      className="cin-score-fill"
                    />
                  </div>
                  <div style={{ fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'0.9rem', color:'var(--cin-gold)', fontWeight:700 }}>
                    {m.rating_overall}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href={`/${locale}/top-rated`} style={{
              display:'inline-block', padding:'14px 40px',
              border:'1px solid rgba(212,168,82,0.3)', color:'var(--cin-gold)',
              fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'0.75rem',
              letterSpacing:4, textTransform:'uppercase', textDecoration:'none',
              transition:'all 0.3s',
            }}>
              {isRTL ? 'عرض القائمة الكاملة' : 'View Full List'}
            </Link>
          </div>
        </section>

        {/* ═══════════════════ LATEST ADDITIONS ═══════════════════ */}
        <section className="max-w-7xl mx-auto px-4 py-12" style={{ position:'relative', zIndex:10 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-accent text-xl font-black text-white">
              <span className="flex items-center gap-2">
                <span className="text-amber-400">🆕</span>
                {isRTL ? 'أحدث الإضافات' : 'Latest Additions'}
              </span>
            </h2>
            <Link href={`/${locale}/movies`} className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium group">
              {isRTL ? `كل الأفلام (${movieCount})` : `All Films (${movieCount})`}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {latestMovies.map((m) => (
              <MovieCard key={m.slug} movie={m} locale={locale} />
            ))}
          </div>
        </section>

        {/* ═══════════════════ GENRE ROWS ═══════════════════ */}
        {genreRows.map(({ genre, emoji, movies }) => (
          <section key={genre} className="max-w-7xl mx-auto px-4 py-8" style={{ position:'relative', zIndex:10 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-accent text-xl font-black text-white">
                <span className="flex items-center gap-2">
                  <span className="text-amber-400">{emoji}</span>
                  {isRTL ? tg(genre as any) : genre.charAt(0).toUpperCase()+genre.slice(1)}
                </span>
              </h2>
              <Link href={`/${locale}/genre/${genre}`} className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium group">
                {isRTL ? 'عرض الكل' : 'See all'}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {movies.map((m) => (
                <MovieCard key={m.slug} movie={m} locale={locale} />
              ))}
            </div>
          </section>
        ))}

        {/* ═══════════════════ GENRES SHOWCASE ═══════════════════ */}
        <section className="border-y border-gray-800/50 py-12" style={{ background:'#0a0e17', position:'relative', zIndex:10 }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-accent text-xl font-black text-white">
                <span className="flex items-center gap-2"><span className="text-amber-400">🎭</span>{t('byGenreTitle')}</span>
              </h2>
            </div>
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

        {/* ═══════════════════ BLOG POSTS ═══════════════════ */}
        <section className="max-w-7xl mx-auto px-4 py-12" style={{ position:'relative', zIndex:10 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-accent text-xl font-black text-white">
              <span className="flex items-center gap-2"><span className="text-amber-400">✍️</span>{tb('title')}</span>
            </h2>
            <Link href={`/${locale}/blog`} className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium group">
              {tb('allArticles')}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {latestPosts.map((post) => {
              const d = getPostData(post, locale)
              return (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}
                  className="group bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all card-glow shine-card">
                  <div className="relative h-44 overflow-hidden bg-gray-800">
                    <BlogImage src={post.image} alt={d.title} className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black shadow-lg">{d.category}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm leading-tight line-clamp-2 mb-2">{d.title}</h3>
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

        {/* ═══════════════════ CTA BANNER ═══════════════════ */}
        <section className="max-w-7xl mx-auto px-4 pb-16" style={{ position:'relative', zIndex:10 }}>
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 text-center p-12"
            style={{ background:'radial-gradient(ellipse 80% 100% at 50% 100%,rgba(245,158,11,0.12) 0%,rgba(249,115,22,0.05) 40%,transparent 70%),#0d1117' }}>
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
