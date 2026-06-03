import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BlogImage from '@/components/BlogImage'
import { getAllBlogPosts, getPostOfDay, getPostData } from '@/lib/blog'
import { LOCALES } from '@/lib/types'

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('blog')
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('blog')
  const isRTL = locale === 'ar'

  const postOfDay = getPostOfDay()
  const postOfDayData = getPostData(postOfDay, locale)

  const allPosts = getAllBlogPosts()
  // All posts except post of day
  const otherPosts = allPosts.filter((p) => p.slug !== postOfDay.slug)

  // Unique categories
  const categories = [...new Set(allPosts.map((p) => getPostData(p, locale).category))]

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="border-b border-gray-800/50"
          style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-5">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              {t('title')}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">{t('title')}</h1>
            <p className="text-gray-400 text-lg max-w-2xl">{t('subtitle')}</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-4 gap-8">

            {/* ── MAIN CONTENT ── */}
            <div className="lg:col-span-3 space-y-10">

              {/* Article of the Day */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
                  <h2 className="text-xs font-black text-amber-400 uppercase tracking-widest">
                    {t('postOfDay')} · {formatDate(postOfDay.date, locale)}
                  </h2>
                </div>
                <Link href={`/${locale}/blog/${postOfDay.slug}`}
                  className="group block relative overflow-hidden rounded-2xl border border-amber-500/25 hover:border-amber-500/50 transition-all shine-card card-glow">
                  <div className="relative h-72 overflow-hidden bg-gray-900">
                    <BlogImage
                      src={postOfDay.image}
                      alt={postOfDayData.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 75vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black mb-3 shadow-lg">
                        {postOfDayData.category}
                      </span>
                      <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors leading-tight">
                        {postOfDayData.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-2 line-clamp-2">{postOfDayData.description}</p>
                      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                          {postOfDay.readTime} {t('readTime')}
                        </span>
                        <span className="text-amber-400 font-semibold flex items-center gap-1">
                          {t('readMore')}
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* All Other Posts */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-gray-500 to-gray-700" />
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('allArticles')}</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {otherPosts.map((post) => {
                    const d = getPostData(post, locale)
                    return (
                      <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}
                        className="group bg-gray-900/80 border border-gray-800/60 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all card-glow shine-card">
                        <div className="relative h-44 overflow-hidden bg-gray-800">
                          <BlogImage
                            src={post.image}
                            alt={d.title}
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/20 to-transparent" />
                          <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black shadow-lg">
                            {d.category}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm leading-tight line-clamp-2 mb-2">
                            {d.title}
                          </h3>
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">{d.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800/50 pt-3">
                            <span>{formatDate(post.date, locale)}</span>
                            <span className="flex items-center gap-1">
                              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                              {post.readTime} {t('readTime')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
              {/* Categories */}
              <div className="bg-gray-900/80 border border-gray-800/60 rounded-2xl p-5">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1" fill="currentColor"/></svg>
                  {t('categories')}
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const count = allPosts.filter((p) => getPostData(p, locale).category === cat).length
                    return (
                      <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0 group">
                        <span className="text-gray-300 text-sm group-hover:text-amber-400 transition-colors">{cat}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold tabular-nums">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* All posts list */}
              <div className="bg-gray-900/80 border border-gray-800/60 rounded-2xl p-5">
                <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                  {isRTL ? 'كل المقالات' : 'All Posts'}
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {allPosts.map((post) => {
                    const d = getPostData(post, locale)
                    return (
                      <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block group">
                        <p className="text-sm text-gray-300 group-hover:text-amber-400 transition-colors font-medium line-clamp-2 leading-snug">
                          {d.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">{formatDate(post.date, locale)}</p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </aside>

          </div>
        </div>

      </main>
      <Footer locale={locale} />
    </>
  )
}
