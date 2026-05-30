import { NextRequest, NextResponse } from 'next/server'
import { getAllBlogPosts, getPostData } from '@/lib/blog'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale') || 'en'
  const baseUrl = 'https://cinereview-ar.vercel.app'

  const posts = getAllBlogPosts().slice(0, 50)
  const isAr = locale === 'ar'

  const title = isAr ? 'CineReview بودكاست — أعظم أفلام العالم' : 'CineReview Podcast — World\'s Greatest Films'
  const description = isAr
    ? 'استكشف أعمق تحليلات السينما العالمية — مراجعات احترافية، تحليل الإخراج، وأسرار الأفلام الكبرى'
    : 'Deep dives into world cinema — professional reviews, director analysis, and secrets behind the greatest films'

  const items = posts.map(p => {
    const d = getPostData(p, locale)
    const pubDate = new Date(p.date).toUTCString()
    const url = `${baseUrl}/${locale}/blog/${p.slug}`
    const duration = p.readTime ? `${p.readTime * 60}` : '600' // estimate in seconds

    return `
    <item>
      <title><![CDATA[${d.title}]]></title>
      <description><![CDATA[${d.description}]]></description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <itunes:duration>${duration}</itunes:duration>
      <itunes:summary><![CDATA[${d.description}]]></itunes:summary>
      <itunes:image href="${p.image}" />
      <itunes:keywords>${d.category}</itunes:keywords>
      <enclosure url="${p.image}" length="0" type="image/jpeg" />
    </item>`
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${description}]]></description>
    <link>${baseUrl}/${locale}</link>
    <language>${locale}</language>
    <atom:link href="${baseUrl}/api/podcast?locale=${locale}" rel="self" type="application/rss+xml" />
    <itunes:author>CineReview</itunes:author>
    <itunes:category text="Arts">
      <itunes:category text="Film Reviews" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${baseUrl}/logos/icon-512.png" />
    <itunes:owner>
      <itunes:name>CineReview</itunes:name>
    </itunes:owner>
    ${items}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600',
    },
  })
}
