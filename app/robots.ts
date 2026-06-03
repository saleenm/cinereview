import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/profile', '/watchlist', '/list/create'],
      },
    ],
    sitemap: 'https://cinereview-mu.vercel.app/sitemap.xml',
    host: 'https://cinereview-mu.vercel.app',
  }
}
