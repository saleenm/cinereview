export type Locale = 'ar' | 'en' | 'fr' | 'es' | 'tr' | 'de' | 'ja' | 'pt'

export interface BlogPost {
  slug: string
  date: string
  readTime: number
  image: string
  movieSlug?: string
  i18n: Record<Locale, {
    title: string
    description: string
    category: string
    content: string
  }>
}
