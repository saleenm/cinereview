import { MetadataRoute } from 'next'
import { getAllSlugs, getAllDirectors, getAvailableYears, getAllActors } from '@/lib/movies'
import { getAllBlogPosts } from '@/lib/blog'
import { COLLECTIONS } from '@/lib/collections'
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
  const actors = getAllActors()

  return [
    // Home pages
    ...localizedUrls('', 1.0, 'daily'),
    // Movie of the day
    ...localizedUrls('/movie-of-day', 0.9, 'daily'),
    // Movies index
    ...localizedUrls('/movies', 0.9, 'daily'),
    // Search
    ...localizedUrls('/search', 0.8, 'daily'),
    // Top rated + What's New
    ...localizedUrls('/top-rated', 0.9, 'weekly'),
    ...localizedUrls('/new', 0.9, 'daily'),
    // Genre pages
    ...GENRE_KEYS.flatMap((g) => localizedUrls(`/genre/${g}`, 0.7, 'weekly')),
    // Genre top pages
    ...GENRE_KEYS.flatMap((g) => localizedUrls(`/genre/${g}/top`, 0.8, 'weekly')),
    // Movie detail pages
    ...slugs.flatMap((slug) => localizedUrls(`/movies/${slug}`, 0.9, 'weekly')),
    // Blog index
    ...localizedUrls('/blog', 0.8, 'daily'),
    // Blog posts
    ...getAllBlogPosts().flatMap((p) => localizedUrls(`/blog/${p.slug}`, 0.7, 'weekly')),
    // Directors
    ...localizedUrls('/directors', 0.8, 'weekly'),
    ...getAllDirectors().flatMap((d) => localizedUrls(`/director/${d.slug}`, 0.7, 'monthly')),
    // Actors
    ...localizedUrls('/actors', 0.8, 'weekly'),
    ...actors.flatMap((a) => localizedUrls(`/actor/${a.slug}`, 0.7, 'monthly')),
    // Best-of years
    ...localizedUrls('/best-of', 0.8, 'monthly'),
    ...getAvailableYears().flatMap((y) => localizedUrls(`/best-of/${y}`, 0.7, 'monthly')),
    // Collections
    ...COLLECTIONS.map((c) => localizedUrls(`/collection/${c.slug}`, 0.8, 'weekly')).flat(),
    // Compare, lists, map, podcast
    ...localizedUrls('/compare', 0.7, 'monthly'),
    ...localizedUrls('/map', 0.7, 'monthly'),
    ...localizedUrls('/podcast', 0.7, 'weekly'),
    ...localizedUrls('/streaming', 0.8, 'monthly'),
    ...localizedUrls('/about', 0.5, 'monthly'),
    ...localizedUrls('/privacy', 0.3, 'yearly'),
    // Note: /profile, /watchlist, /list/create excluded (robots.txt disallow)
  ]
}
