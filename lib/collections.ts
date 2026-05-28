import { MOVIES } from './movies'
import type { Movie } from './types'

export interface Collection {
  slug: string
  emoji: string
  image?: string
  i18n: Record<string, { title: string; description: string }>
  filter: (m: Movie) => boolean
}

export const COLLECTIONS: Collection[] = [
  {
    slug: 'ramadan-movies',
    emoji: '🌙',
    i18n: {
      ar: { title: 'أفلام رمضان', description: 'أفضل الأفلام لمشاهدتها في شهر رمضان المبارك' },
      en: { title: 'Ramadan Movies', description: 'Best films to watch during Ramadan' },
      fr: { title: 'Films du Ramadan', description: 'Les meilleurs films à regarder pendant le Ramadan' },
      es: { title: 'Películas de Ramadán', description: 'Las mejores películas para ver durante el Ramadán' },
      tr: { title: 'Ramazan Filmleri', description: 'Ramazan ayında izlenecek en iyi filmler' },
      de: { title: 'Ramadan-Filme', description: 'Die besten Filme für den Ramadan' },
      ja: { title: 'ラマダン映画', description: 'ラマダン中に見るべき最高の映画' },
      pt: { title: 'Filmes do Ramadão', description: 'Os melhores filmes para assistir durante o Ramadão' },
    },
    filter: (m) => ['drama', 'history', 'arabic'].some(g => m.genres.includes(g as any)) && m.rating_overall >= 7.5,
  },
  {
    slug: 'family-night',
    emoji: '👨‍👩‍👧‍👦',
    i18n: {
      ar: { title: 'أفلام العائلة', description: 'أفضل الأفلام المناسبة لجميع أفراد العائلة' },
      en: { title: 'Family Night', description: 'Best movies for the whole family' },
      fr: { title: 'Soirée Famille', description: 'Les meilleurs films pour toute la famille' },
      es: { title: 'Noche Familiar', description: 'Las mejores películas para toda la familia' },
      tr: { title: 'Aile Gecesi', description: 'Tüm aile için en iyi filmler' },
      de: { title: 'Familienabend', description: 'Die besten Filme für die ganze Familie' },
      ja: { title: 'ファミリーナイト', description: '家族全員で楽しめる最高の映画' },
      pt: { title: 'Noite em Família', description: 'Os melhores filmes para toda a família' },
    },
    filter: (m) => m.genres.includes('animation') || (m.genres.includes('adventure') && m.rating_overall >= 7.5),
  },
  {
    slug: 'oscar-winners',
    emoji: '🏆',
    i18n: {
      ar: { title: 'الفائزون بالأوسكار', description: 'أفلام حصدت جائزة أوسكار أفضل فيلم' },
      en: { title: 'Oscar Winners', description: 'Films that won the Academy Award for Best Picture' },
      fr: { title: 'Vainqueurs des Oscars', description: 'Films ayant remporté l\'Oscar du Meilleur Film' },
      es: { title: 'Ganadores del Oscar', description: 'Películas que ganaron el Oscar a Mejor Película' },
      tr: { title: 'Oscar Kazananlar', description: 'En İyi Film Oscar\'ını kazanan filmler' },
      de: { title: 'Oscar-Gewinner', description: 'Filme, die den Oscar für den besten Film gewannen' },
      ja: { title: 'アカデミー賞受賞作', description: 'アカデミー賞作品賞を受賞した映画' },
      pt: { title: 'Vencedores do Oscar', description: 'Filmes que ganharam o Oscar de Melhor Filme' },
    },
    filter: (m) => m.rating_overall >= 8.5 && m.rotten_tomatoes >= 90,
  },
  {
    slug: 'mind-bending',
    emoji: '🧠',
    i18n: {
      ar: { title: 'أفلام تفجّر العقل', description: 'أفلام ذكية تجعلك تفكر بعمق' },
      en: { title: 'Mind-Bending Films', description: 'Intelligent films that make you think deeply' },
      fr: { title: 'Films Mindbending', description: 'Films intelligents qui font réfléchir profondément' },
      es: { title: 'Películas que Hacen Pensar', description: 'Películas inteligentes que te hacen reflexionar' },
      tr: { title: 'Akıl Büken Filmler', description: 'Derin düşündüren zeki filmler' },
      de: { title: 'Mindbending-Filme', description: 'Intelligente Filme, die zum Nachdenken anregen' },
      ja: { title: '頭が爆発する映画', description: '深く考えさせる知的な映画' },
      pt: { title: 'Filmes que Fazem Pensar', description: 'Filmes inteligentes que fazem você pensar profundamente' },
    },
    filter: (m) => ['thriller', 'scifi'].some(g => m.genres.includes(g as any)) && m.rating_overall >= 8.0,
  },
  {
    slug: 'top-action',
    emoji: '💥',
    i18n: {
      ar: { title: 'أفضل أفلام الأكشن', description: 'أكثر أفلام الأكشن إثارة في التاريخ' },
      en: { title: 'Top Action Films', description: 'The most thrilling action movies in cinema history' },
      fr: { title: 'Meilleurs Films d\'Action', description: 'Les films d\'action les plus haletants de l\'histoire' },
      es: { title: 'Mejores Películas de Acción', description: 'Las películas de acción más emocionantes de la historia' },
      tr: { title: 'En İyi Aksiyon Filmleri', description: 'Sinema tarihindeki en heyecan verici aksiyon filmleri' },
      de: { title: 'Top Actionfilme', description: 'Die aufregendsten Actionfilme der Kinogeschichte' },
      ja: { title: 'トップアクション映画', description: '映画史上最もスリリングなアクション映画' },
      pt: { title: 'Melhores Filmes de Ação', description: 'Os filmes de ação mais emocionantes da história do cinema' },
    },
    filter: (m) => m.genres.includes('action') && m.rating_overall >= 7.8,
  },
  {
    slug: 'classic-cinema',
    emoji: '🎞️',
    i18n: {
      ar: { title: 'كلاسيكيات السينما', description: 'أيقونات سينمائية خالدة قبل عام 2000' },
      en: { title: 'Classic Cinema', description: 'Timeless cinema icons from before the year 2000' },
      fr: { title: 'Cinéma Classique', description: 'Icônes cinématographiques intemporelles d\'avant 2000' },
      es: { title: 'Cine Clásico', description: 'Íconos del cine de antes del año 2000' },
      tr: { title: 'Klasik Sinema', description: '2000 öncesinden zamansız sinema ikonları' },
      de: { title: 'Klassisches Kino', description: 'Zeitlose Kinoikonen aus der Zeit vor 2000' },
      ja: { title: 'クラシック映画', description: '2000年以前の不朽の映画アイコン' },
      pt: { title: 'Cinema Clássico', description: 'Ícones do cinema de antes do ano 2000' },
    },
    filter: (m) => m.year < 2000 && m.rating_overall >= 8.0,
  },
]

export function getCollectionMovies(slug: string): Movie[] {
  const col = COLLECTIONS.find((c) => c.slug === slug)
  if (!col) return []
  return MOVIES.filter(col.filter).sort((a, b) => b.rating_overall - a.rating_overall)
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}
