import { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/movies'
import { BLOG_POSTS } from '@/lib/blog'
import { GENRE_KEYS, LOCALES } from '@/lib/types'

const BASE_URL = 'https://cinereview-mu.vercel.app'

function localizedUrls(path: string, priority: number, changeFreq: MetadataRoute.Sitemap[0]['changeFrequency']) {
  return LOCALES.map((locale) => ({
    url: `${BASE_URL}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = getAllSlugs()

  return [
    // Home pages
    ...localizedUrls('', 1.0, 'daily'),
    // Movies index
    ...localizedUrls('/movies', 0.9, 'daily'),
    // Top rated
    ...localizedUrls('/top-rated', 0.8, 'weekly'),
    // Genre pages
    ...GENRE_KEYS.flatMap((g) => localizedUrls(`/genre/${g}`, 0.7, 'weekly')),
    // Movie detail pages
    ...slugs.flatMap((slug) => localizedUrls(`/movies/${slug}`, 0.9, 'weekly')),
    // Blog index
    ...localizedUrls('/blog', 0.8, 'daily'),
    // Blog posts
    ...BLOG_POSTS.flatMap((p) => localizedUrls(`/blog/${p.slug}`, 0.7, 'weekly')),
  ]
}
