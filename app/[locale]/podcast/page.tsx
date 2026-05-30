import Link from 'next/link'
import Image from 'next/image'
import { getAllBlogPosts, getPostData } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { Metadata } from 'next'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'بودكاست CineReview | تحليلات سينمائية' : 'CineReview Podcast | Cinema Deep Dives',
    description: isAr ? 'استمع لأعمق تحليلات الأفلام — مجاناً على أي تطبيق بودكاست' : 'Listen to deep film analysis — free on any podcast app',
  }
}

export default async function PodcastPage({ params }: Props) {
  const { locale } = await params
  const isAr = locale === 'ar'
  const posts = getAllBlogPosts().slice(0, 20)
  const rssUrl = `https://cinereview-ar.vercel.app/api/podcast?locale=${locale}`

  const APPS = [
    { name: 'Apple Podcasts', icon: '🎵', url: `https://podcasts.apple.com/us/app/apple-podcasts/id525463029` },
    { name: 'Spotify', icon: '🎧', url: `https://open.spotify.com` },
    { name: 'Google Podcasts', icon: '🎙️', url: `https://podcasts.google.com` },
    { name: 'Pocket Casts', icon: '📻', url: `https://pocketcasts.com` },
  ]

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎙️</div>
          <h1 className="text-3xl font-black text-white mb-3">
            {isAr ? 'بودكاست CineReview' : 'CineReview Podcast'}
          </h1>
          <p className="text-gray-400 mb-6">
            {isAr
              ? 'تحليلات عميقة لأعظم الأفلام في تاريخ السينما — أضف الخلاصة إلى تطبيق البودكاست المفضل لديك'
              : 'Deep dives into the greatest films ever made — add the feed to your favourite podcast app'}
          </p>

          {/* RSS Feed */}
          <div className="bg-gray-900 border border-amber-500/30 rounded-2xl p-5 mb-6 text-start">
            <p className="text-amber-400 text-xs font-bold uppercase mb-2">📡 RSS Feed</p>
            <div className="flex items-center gap-3 bg-gray-800 rounded-xl px-4 py-3">
              <span className="text-gray-300 text-sm flex-1 truncate font-mono text-xs">{rssUrl}</span>
              <a href={rssUrl} target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 bg-amber-500 text-gray-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors flex-shrink-0">
                {isAr ? 'فتح' : 'Open'}
              </a>
            </div>
          </div>

          {/* Podcast apps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {APPS.map(app => (
              <a key={app.name} href={app.url} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-amber-500/40 transition-colors">
                <span className="text-2xl">{app.icon}</span>
                <span className="text-gray-400 text-xs text-center">{app.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Episodes (blog posts) */}
        <h2 className="text-xl font-black text-white mb-5">
          {isAr ? 'الحلقات الأخيرة' : 'Latest Episodes'}
        </h2>
        <div className="space-y-4">
          {posts.map((p, i) => {
            const d = getPostData(p, locale)
            return (
              <Link key={p.slug} href={`/${locale}/blog/${p.slug}`}
                className="flex gap-4 bg-gray-900 border border-gray-800 hover:border-amber-500/30 rounded-2xl p-4 transition-colors group">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                  <Image src={p.image} alt={d.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-amber-400 text-xs font-bold">EP {posts.length - i}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{p.readTime} min</span>
                  </div>
                  <h3 className="text-white font-bold text-sm leading-snug group-hover:text-amber-400 transition-colors line-clamp-2 mb-1">
                    {d.title}
                  </h3>
                  <p className="text-gray-500 text-xs line-clamp-2">{d.description}</p>
                </div>
                <div className="flex-shrink-0 self-center">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 group-hover:bg-amber-500/40 transition-colors">
                    ▶
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
