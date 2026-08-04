'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdUnit from '@/components/AdUnit'

interface Movie {
  slug: string; title: string; title_ar: string; year: number
  director: string; director_ar: string; rating_overall: number
  imdb_rating: number; poster_url: string; genres: string[]
  language: string; duration: number
}

const LABELS: Record<string, Record<string, string>> = {
  title:       { ar: 'البحث في الأفلام', en: 'Search Films', fr: 'Rechercher', es: 'Buscar', tr: 'Ara', de: 'Suche', ja: '検索', pt: 'Buscar' },
  placeholder: { ar: 'اسم الفيلم، المخرج، الممثل...', en: 'Film title, director, actor...', fr: 'Titre, réalisateur...', es: 'Título, director...', tr: 'Film adı, yönetmen...', de: 'Film, Regisseur...', ja: '映画名、監督...', pt: 'Título, diretor...' },
  filters:     { ar: 'تصفية', en: 'Filters', fr: 'Filtres', es: 'Filtros', tr: 'Filtreler', de: 'Filter', ja: 'フィルター', pt: 'Filtros' },
  allGenres:   { ar: 'كل الأنواع', en: 'All Genres', fr: 'Tous genres', es: 'Todos géneros', tr: 'Tüm türler', de: 'Alle Genres', ja: 'すべて', pt: 'Todos gêneros' },
  sortBy:      { ar: 'الترتيب حسب', en: 'Sort by', fr: 'Trier par', es: 'Ordenar por', tr: 'Sırala', de: 'Sortieren', ja: '並び順', pt: 'Ordenar por' },
  rating:      { ar: 'التقييم', en: 'Rating', fr: 'Note', es: 'Calificación', tr: 'Puan', de: 'Bewertung', ja: '評価', pt: 'Avaliação' },
  year:        { ar: 'السنة', en: 'Year', fr: 'Année', es: 'Año', tr: 'Yıl', de: 'Jahr', ja: '年', pt: 'Ano' },
  results:     { ar: 'نتيجة', en: 'results', fr: 'résultats', es: 'resultados', tr: 'sonuç', de: 'Ergebnisse', ja: '件', pt: 'resultados' },
  noResults:   { ar: 'لا توجد نتائج', en: 'No results found', fr: 'Aucun résultat', es: 'Sin resultados', tr: 'Sonuç bulunamadı', de: 'Keine Ergebnisse', ja: '結果なし', pt: 'Sem resultados' },
}

const GENRE_ICONS: Record<string, string> = {
  action:'💥', drama:'🎭', comedy:'😂', thriller:'😨', crime:'🔪', romance:'💕',
  scifi:'🚀', horror:'👻', animation:'🎨', documentary:'📽️', adventure:'🌍',
  fantasy:'🧙', history:'📜', biography:'👤', musical:'🎵', mystery:'🔍', war:'⚔️',
}

const SORT_OPTIONS = [
  { value: 'rating', key: 'rating' },
  { value: 'year_desc', key: 'year' },
  { value: 'year_asc', key: 'year' },
]

export default function SearchPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'en'
  const isRTL = locale === 'ar'

  const L = (k: string) => LABELS[k]?.[locale] || LABELS[k]?.en || k

  const [q, setQ] = useState(searchParams.get('q') || '')
  const [genre, setGenre] = useState(searchParams.get('genre') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating')
  const [results, setResults] = useState<Movie[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const PER_PAGE = 24

  const doSearch = useCallback(async (query: string, genreFilter: string, sortBy: string, pg: number) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ q: query, locale, limit: '200' })
      if (genreFilter) params.set('genre', genreFilter)
      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()
      let movies: Movie[] = data.results || []

      // Sort
      if (sortBy === 'rating') movies.sort((a, b) => b.rating_overall - a.rating_overall)
      else if (sortBy === 'year_desc') movies.sort((a, b) => b.year - a.year)
      else if (sortBy === 'year_asc') movies.sort((a, b) => a.year - b.year)

      setTotal(movies.length)
      setResults(movies.slice((pg - 1) * PER_PAGE, pg * PER_PAGE))
    } catch { setResults([]) }
    setLoading(false)
  }, [locale])

  useEffect(() => {
    doSearch(q, genre, sort, page)
    // Update URL
    const url = new URL(window.location.href)
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q')
    if (genre) url.searchParams.set('genre', genre); else url.searchParams.delete('genre')
    url.searchParams.set('sort', sort)
    window.history.replaceState({}, '', url.toString())
  }, [q, genre, sort, page, doSearch])

  const GENRES = ['action','drama','comedy','thriller','crime','romance','scifi','horror','animation','documentary','adventure','fantasy','history','biography']

  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-6">🔍 {L('title')}</h1>

        {/* Search + Filters */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-8 space-y-4">
          {/* Search input */}
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            placeholder={L('placeholder')}
            autoFocus
            className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-base focus:outline-none focus:border-amber-500 transition-colors"
          />

          {/* Filters row */}
          <div className="flex flex-wrap gap-3">
            {/* Genre pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setGenre(''); setPage(1) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${!genre ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                {L('allGenres')}
              </button>
              {GENRES.map(g => (
                <button key={g} onClick={() => { setGenre(g === genre ? '' : g); setPage(1) }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${genre === g ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {GENRE_ICONS[g]} {g}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1) }}
              className="ms-auto px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 text-xs focus:outline-none focus:border-amber-500">
              <option value="rating">★ {L('rating')} ↓</option>
              <option value="year_desc">📅 {L('year')} ↓</option>
              <option value="year_asc">📅 {L('year')} ↑</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 text-sm mb-5">
            {total} {L('results')} {q && `"${q}"`}
          </p>
        )}

        {/* Results grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-gray-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎬</div>
            <p className="text-gray-500">{L('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map(m => (
              <Link key={m.slug} href={`/${locale}/movies/${m.slug}`} className="group">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-900">
                  <Image
                    src={m.poster_url || '/placeholder.jpg'}
                    alt={isRTL ? m.title_ar : m.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-transparent" />
                  <div className="absolute top-2 end-2 px-1.5 py-0.5 bg-amber-500 text-gray-950 font-black text-xs rounded-lg">
                    {m.rating_overall}
                  </div>
                  <div className="absolute bottom-2 start-2 end-2">
                    <p className="text-white font-bold text-xs leading-tight line-clamp-2">
                      {isRTL ? m.title_ar : m.title}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">{m.year}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl disabled:opacity-40 hover:bg-gray-700 transition-colors text-sm">
              {isRTL ? '→' : '←'}
            </button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              const p = page <= 4 ? i + 1 : page >= totalPages - 3 ? totalPages - 6 + i : page - 3 + i
              if (p < 1 || p > totalPages) return null
              return (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${page === p ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 bg-gray-800 text-white rounded-xl disabled:opacity-40 hover:bg-gray-700 transition-colors text-sm">
              {isRTL ? '←' : '→'}
            </button>
          </div>
        )}
        <AdUnit slot="6543210987" format="horizontal" className="mt-8 rounded-xl overflow-hidden" />
      </main>
      <Footer locale={locale} />
    </>
  )
}
