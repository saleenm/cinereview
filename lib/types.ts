export type Locale = 'ar' | 'en' | 'fr' | 'es' | 'tr' | 'de' | 'ja' | 'pt'

export const LOCALES: Locale[] = ['ar', 'en', 'fr', 'es', 'tr', 'de', 'ja', 'pt']

export const LOCALE_NAMES: Record<Locale, string> = {
  ar: 'العربية',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  tr: 'Türkçe',
  de: 'Deutsch',
  ja: '日本語',
  pt: 'Português',
}

export const RTL_LOCALES: Locale[] = ['ar']

export type Genre =
  | 'drama'
  | 'action'
  | 'thriller'
  | 'comedy'
  | 'horror'
  | 'romance'
  | 'scifi'
  | 'animation'
  | 'documentary'
  | 'history'
  | 'crime'
  | 'adventure'
  | 'arabic'

export const GENRE_KEYS: Genre[] = [
  'drama', 'action', 'thriller', 'comedy', 'horror',
  'romance', 'scifi', 'animation', 'documentary', 'history', 'crime', 'adventure', 'arabic',
]

export const GENRE_ICONS: Record<Genre, string> = {
  drama: '🎭',
  action: '💥',
  thriller: '🔪',
  comedy: '😂',
  horror: '👻',
  romance: '💕',
  scifi: '🚀',
  animation: '🎨',
  documentary: '📽️',
  history: '🏛️',
  crime: '🕵️',
  adventure: '🌍',
  arabic: '🌙',
}

export const GENRE_COLORS: Record<Genre, string> = {
  drama: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  action: 'text-red-400 bg-red-400/10 border-red-400/20',
  thriller: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  comedy: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  horror: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  romance: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  scifi: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  animation: 'text-green-400 bg-green-400/10 border-green-400/20',
  documentary: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  history: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  crime: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
  adventure: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  arabic: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
}

export interface Movie {
  id: string
  slug: string
  title: string
  title_ar: string
  year: number
  director: string
  director_ar: string
  cast: string[]
  genres: Genre[]
  poster_url: string
  backdrop_url: string
  trailer_url?: string
  description_ar: string
  description_en: string
  description_fr?: string
  description_es?: string
  description_tr?: string
  description_de?: string
  description_ja?: string
  description_pt?: string
  // Ratings breakdown
  rating_overall: number      // out of 10
  rating_story: number        // out of 10
  rating_acting: number       // out of 10
  rating_direction: number    // out of 10
  rating_cinematography: number
  rating_music: number
  // External ratings
  imdb_rating: number
  rotten_tomatoes: number     // percentage
  metacritic?: number
  // Meta
  duration: number            // minutes
  language: string
  country: string
  budget_million?: number
  box_office_million?: number
  awards?: string
  reviews_count: number
  is_featured: boolean
  release_date: string
  tags: string[]
  pros_ar: string[]
  cons_ar: string[]
  pros_en: string[]
  cons_en: string[]
}
