import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { getAllBlogPosts, getPostBySlug, getPostData } from '@/lib/blog'
import { getMovieBySlug } from '@/lib/movies'
import { LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdUnit from '@/components/AdUnit'
import BlogImage from '@/components/BlogImage'
import NewsletterForm from '@/components/NewsletterForm'

interface Props { params: Promise<{ locale: string; slug: string }> }

export async function generateStaticParams() {
  const allPosts = getAllBlogPosts()
  return LOCALES.flatMap((locale) =>
    allPosts.map((p) => ({ locale, slug: p.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const d = getPostData(post, locale)
  const BASE = 'https://cinereview-mu.vercel.app'
  return {
    title: d.title,
    description: d.description,
    alternates: { canonical: `${BASE}/${locale}/blog/${slug}` },
    openGraph: {
      title: d.title,
      description: d.description,
      images: [{ url: post.image, width: 1280, height: 720, alt: d.title }],
      type: 'article',
      publishedTime: post.date,
      siteName: 'CineReview',
    },
    twitter: {
      card: 'summary_large_image',
      title: d.title,
      description: d.description,
      images: [post.image],
    },
  }
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-SA' : locale, {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/** Very lightweight markdown renderer — handles ##, **bold**, >, * lists */
function renderMarkdown(md: string): string {
  return md
    .split('\n')
    .map((line) => {
      if (line.startsWith('### ')) return `<h3 class="text-lg font-black text-white mt-6 mb-2">${line.slice(4)}</h3>`
      if (line.startsWith('## ')) return `<h2 class="text-xl font-black text-amber-400 mt-8 mb-3">${line.slice(3)}</h2>`
      if (line.startsWith('# ')) return `<h1 class="text-2xl font-black text-white mt-6 mb-3">${line.slice(2)}</h1>`
      if (line.startsWith('> ')) return `<blockquote class="border-s-4 border-amber-500 ps-4 my-4 text-gray-300 italic">${line.slice(2)}</blockquote>`
      if (line.match(/^\d+\.\s/)) return `<li class="list-decimal ms-5 text-gray-300 my-1">${line.replace(/^\d+\.\s/, '')}</li>`
      if (line.startsWith('- ') || line.startsWith('* ')) return `<li class="list-disc ms-5 text-gray-300 my-1">${line.slice(2)}</li>`
      if (line.trim() === '') return '<div class="my-3"></div>'
      // inline bold
      const processed = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      return `<p class="text-gray-400 leading-relaxed my-2">${processed}</p>`
    })
    .join('\n')
}

function ArticleJsonLd({ post, d, locale, slug }: { post: NonNullable<ReturnType<typeof getPostBySlug>>; d: { title: string; description: string }; locale: string; slug: string }) {
  const BASE = 'https://cinereview-mu.vercel.app'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.title,
    description: d.description,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'CineReview', url: BASE },
    publisher: { '@type': 'Organization', name: 'CineReview', url: BASE, logo: { '@type': 'ImageObject', url: `${BASE}/icon-192.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/${locale}/blog/${slug}` },
    inLanguage: locale,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const t = await getTranslations('blog')
  const d = getPostData(post, locale)
  const isRTL = locale === 'ar'

  const relatedMovie = post.movieSlug ? getMovieBySlug(post.movieSlug) : null

  // Other posts for "more articles"
  const morePosts = getAllBlogPosts().filter((p) => p.slug !== slug).slice(0, 3)

  // Inject in-article ads every 3 paragraphs
  function injectAds(html: string): string {
    const AD_HTML = `<div class="my-6 text-center overflow-hidden rounded-xl"><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-4272698055490735" data-ad-slot="7890123456" data-ad-format="fluid" data-ad-layout="in-article" data-full-width-responsive="true"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script></div>`
    const parts = html.split(/(?<=<\/p>\n)/)
    const result: string[] = []
    let pCount = 0
    for (const part of parts) {
      result.push(part)
      if (part.includes('<p ') || part.startsWith('<p>')) {
        pCount++
        if (pCount % 3 === 0) result.push(AD_HTML)
      }
    }
    return result.join('')
  }
  const htmlContent = injectAds(renderMarkdown(d.content))

  return (
    <>
      <ArticleJsonLd post={post} d={d} locale={locale} slug={slug} />
      <Header locale={locale} />
      <main className="flex-1">

        {/* ── HERO IMAGE ── */}
        <div className="relative h-72 md:h-96 overflow-hidden bg-gray-900">
          <BlogImage
            src={post.image}
            alt={d.title}
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/20" />

          {/* Back link */}
          <div className="absolute top-4 start-4">
            <Link href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/80 border border-gray-700 text-sm text-gray-300 hover:text-white transition-colors backdrop-blur-sm">
              {t('backToBlog')}
            </Link>
          </div>

          {/* Category badge */}
          <div className="absolute bottom-4 start-4">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-gray-950 text-xs font-black">
              {d.category}
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 -mt-10 relative pb-16">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── ARTICLE ── */}
            <article className="lg:col-span-2">
              {/* Title */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3">
                  {d.title}
                </h1>
                <p className="text-gray-400 mb-4">{d.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-800 pt-4">
                  <span>📅 {formatDate(post.date, locale)}</span>
                  <span>🕒 {post.readTime} {t('readTime')}</span>
                  <span>✍️ CineReview</span>
                </div>
              </div>

              {/* Ad — before content */}
              <AdUnit slot="4567890123" format="horizontal" className="rounded-xl overflow-hidden mb-6" />

              {/* Content */}
              <div
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 prose-invert"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {/* Share */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-gray-500 text-sm">{t('share')}:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(d.title)}&url=${encodeURIComponent(`https://cinereview-mu.vercel.app/${locale}/blog/${slug}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 border border-gray-700 transition-colors">
                  𝕏 Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://cinereview-mu.vercel.app/${locale}/blog/${slug}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 border border-gray-700 transition-colors">
                  Facebook
                </a>
              </div>
            </article>

            {/* ── SIDEBAR ── */}
            <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">

              {/* Sidebar Ad */}
              <AdUnit slot="1234567890" format="rectangle" className="rounded-xl overflow-hidden" />

              {/* Related Movie */}
              {relatedMovie && (
                <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-5">
                  <h3 className="font-bold text-amber-400 text-xs uppercase tracking-wide mb-3">
                    🎬 {t('relatedFilm')}
                  </h3>
                  <Link href={`/${locale}/movies/${relatedMovie.slug}`}
                    className="group flex gap-3 items-start">
                    <Image
                      src={relatedMovie.poster_url}
                      alt={isRTL ? relatedMovie.title_ar : relatedMovie.title}
                      width={60}
                      height={90}
                      className="rounded-lg object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors leading-tight">
                        {isRTL ? relatedMovie.title_ar : relatedMovie.title}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{relatedMovie.year}</p>
                      <p className="text-amber-400 font-black text-sm mt-1">★ {relatedMovie.rating_overall}</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* More Articles */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="font-bold text-white text-xs uppercase tracking-wide mb-4">
                  📚 {isRTL ? 'مقالات أخرى' : 'More Articles'}
                </h3>
                <div className="space-y-4">
                  {morePosts.map((p) => {
                    const pd = getPostData(p, locale)
                    return (
                      <Link key={p.slug} href={`/${locale}/blog/${p.slug}`}
                        className="group block">
                        <div className="flex gap-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                            <BlogImage src={p.image} alt={pd.title} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-300 group-hover:text-amber-400 transition-colors font-medium line-clamp-2 leading-snug">
                              {pd.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">{formatDate(p.date, locale)}</p>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Back to blog */}
              <Link href={`/${locale}/blog`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold border border-gray-700 transition-colors">
                {t('backToBlog')}
              </Link>
            </aside>

          </div>
        </div>

        {/* Newsletter signup after article */}
        <div className="max-w-2xl mx-auto px-4 pb-12">
          <NewsletterForm locale={locale} />
        </div>

      </main>
      <Footer locale={locale} />
    </>
  )
}
