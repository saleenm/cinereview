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
        <section className="bg-gray-950 border-b border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-4">
              ✍️ {t('title')}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">{t('title')}</h1>
            <p className="text-gray-400 text-lg max-w-2xl">{t('subtitle')}</p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-4 gap-8">

            {/* ── MAIN CONTENT ── */}
            <div className="lg:col-span-3 space-y-10">

              {/* Article of the Day */}
              <div>
                <h2 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  📰 {t('postOfDay')} · {formatDate(postOfDay.date, locale)}
                </h2>
                <Link href={`/${locale}/blog/${postOfDay.slug}`}
                  className="group block relative overflow-hidden rounded-2xl border border-amber-500/30 hover:border-amber-500/60 transition-all bg-gray-900">
                  <div className="relative h-72 overflow-hidden">
                    <BlogImage
                      src={postOfDay.image}
                      alt={postOfDayData.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 75vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-amber-500/90 text-gray-950 text-xs font-black mb-3">
                        {postOfDayData.category}
                      </span>
                      <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors leading-tight">
                        {postOfDayData.title}
                      </h3>
                      <p className="text-gray-300 text-sm mt-2 line-clamp-2">{postOfDayData.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span>🕒 {postOfDay.readTime} {t('readTime')}</span>
                        <span className="text-amber-400 font-semibold group-hover:gap-2 transition-all">
                          {t('readMore')} →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* All Other Posts */}
              <div>
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  📚 {t('allArticles')}
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {otherPosts.map((post) => {
                    const d = getPostData(post, locale)
                    return (
                      <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}
                        className="group bg-gray-900 border border-gray-800 hover:border-amber-500/40 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5">
                        <div className="relative h-44 overflow-hidden">
                          <BlogImage
                            src={post.image}
                            alt={d.title}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                          <span className="absolute top-3 start-3 px-2 py-0.5 rounded-full bg-gray-900/80 border border-gray-700 text-xs text-amber-400 font-semibold">
                            {d.category}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white group-hover:text-amber-400 transition-colors text-sm leading-tight line-clamp-2 mb-2">
                            {d.title}
                          </h3>
                          <p className="text-gray-500 text-xs line-clamp-2 mb-3">{d.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatDate(post.date, locale)}</span>
                            <span>🕒 {post.readTime} {t('readTime')}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* ── SIDEBAR ── */}
            <aside className="space-y-6">
              {/* Categories */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">
                  🏷️ {t('categories')}
                </h3>
                <div className="space-y-2">
                  {categories.map((cat) => {
                    const count = allPosts.filter((p) => getPostData(p, locale).category === cat).length
                    return (
                      <div key={cat} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <span className="text-gray-300 text-sm">{cat}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* All posts list */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="font-bold text-white text-sm uppercase tracking-wide mb-4">
                  📋 {isRTL ? 'كل المقالات' : 'All Posts'}
                </h3>
                <div className="space-y-3">
                  {allPosts.map((post) => {
                    const d = getPostData(post, locale)
                    return (
                      <Link key={post.slug} href={`/${locale}/blog/${post.slug}`}
                        className="block group">
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
