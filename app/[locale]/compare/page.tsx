'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Movie {
  slug: string; title: string; title_ar: string; year: number
  director: string; rating_overall: number; rating_story: number
  rating_acting: number; rating_direction: number; rating_cinematography: number; rating_music: number
  imdb_rating: number; rotten_tomatoes: number; duration: number
  poster_url: string; genres: string[]; language: string
}

function SearchMovie({ onSelect, locale, label }: { onSelect: (m: Movie) => void; locale: string; label: string }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Movie[]>([])

  useEffect(() => {
    if (q.length < 2) { setResults([]); return }
    fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}`)
      .then(r => r.json()).then(d => setResults((d.results || []).slice(0, 6)))
      .catch(() => setResults([]))
  }, [q, locale])

  return (
    <div className="relative">
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder={label}
        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
      />
      {results.length > 0 && (
        <div className="absolute top-full mt-1 start-0 end-0 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl z-50">
          {results.map((m: any) => (
            <button
              key={m.slug}
              onClick={() => { onSelect(m); setQ(''); setResults([]) }}
              className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-800 transition-colors text-sm text-start"
            >
              <Image src={m.poster_url || '/placeholder.jpg'} alt={m.title} width={28} height={40} className="rounded object-cover flex-shrink-0" />
              <div>
                <p className="text-white font-medium">{locale === 'ar' ? m.title_ar : m.title}</p>
                <p className="text-gray-500 text-xs">{m.year} · ★ {m.rating_overall}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function RatingBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100
  const color = value >= 8.5 ? 'bg-green-500' : value >= 7 ? 'bg-amber-500' : value >= 5.5 ? 'bg-orange-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-white font-bold text-xs w-8 text-end">{value}</span>
    </div>
  )
}

export default function ComparePage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const isRTL = locale === 'ar'
  const [movies, setMovies] = useState<(Movie | null)[]>([null, null, null])

  const LABELS: Record<string, Record<string, string>> = {
    title: { ar: 'مقارنة الأفلام', en: 'Compare Films', fr: 'Comparer les films', es: 'Comparar películas', tr: 'Film Karşılaştır', de: 'Filme vergleichen', ja: '映画を比較', pt: 'Comparar filmes' },
    search: { ar: 'ابحث عن فيلم...', en: 'Search a film...', fr: 'Rechercher un film...', es: 'Buscar película...', tr: 'Film ara...', de: 'Film suchen...', ja: '映画を検索...', pt: 'Pesquisar filme...' },
    remove: { ar: 'إزالة', en: 'Remove', fr: 'Supprimer', es: 'Eliminar', tr: 'Kaldır', de: 'Entfernen', ja: '削除', pt: 'Remover' },
    story: { ar: 'القصة', en: 'Story', fr: 'Histoire', es: 'Historia', tr: 'Hikaye', de: 'Geschichte', ja: 'ストーリー', pt: 'História' },
    acting: { ar: 'الأداء', en: 'Acting', fr: 'Jeu', es: 'Actuación', tr: 'Oyunculuk', de: 'Schauspiel', ja: '演技', pt: 'Atuação' },
    direction: { ar: 'الإخراج', en: 'Direction', fr: 'Réalisation', es: 'Dirección', tr: 'Yönetim', de: 'Regie', ja: '演出', pt: 'Direção' },
    cinematography: { ar: 'التصوير', en: 'Cinematography', fr: 'Cinématographie', es: 'Fotografía', tr: 'Sinematografi', de: 'Kamera', ja: '撮影', pt: 'Fotografia' },
    music: { ar: 'الموسيقى', en: 'Music', fr: 'Musique', es: 'Música', tr: 'Müzik', de: 'Musik', ja: '音楽', pt: 'Música' },
  }
  const L = (k: string) => LABELS[k]?.[locale] || LABELS[k]?.en || k

  const addMovie = (m: Movie, idx: number) => {
    setMovies(prev => { const n = [...prev]; n[idx] = m; return n })
  }

  const filled = movies.filter(Boolean) as Movie[]

  const CRITERIA = [
    { key: 'rating_overall', label: 'Overall' },
    { key: 'rating_story', label: L('story') },
    { key: 'rating_acting', label: L('acting') },
    { key: 'rating_direction', label: L('direction') },
    { key: 'rating_cinematography', label: L('cinematography') },
    { key: 'rating_music', label: L('music') },
    { key: 'imdb_rating', label: 'IMDb' },
  ]

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-2">⚖️ {L('title')}</h1>
        <p className="text-gray-500 mb-8">{isRTL ? 'قارن بين 2 أو 3 أفلام' : 'Compare 2 or 3 films side by side'}</p>

        {/* Search slots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[0, 1, 2].map((idx) => (
            <div key={idx}>
              {movies[idx] ? (
                <div className="bg-gray-900 border border-amber-500/30 rounded-2xl overflow-hidden">
                  <div className="relative h-40">
                    <Image src={(movies[idx] as Movie).poster_url} alt={(movies[idx] as Movie).title} fill className="object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900" />
                    <div className="absolute bottom-3 start-3 end-3">
                      <p className="text-white font-bold text-sm leading-tight">
                        {isRTL ? (movies[idx] as Movie).title_ar : (movies[idx] as Movie).title}
                      </p>
                      <p className="text-gray-400 text-xs">{(movies[idx] as Movie).year}</p>
                    </div>
                    <button
                      onClick={() => setMovies(prev => { const n = [...prev]; n[idx] = null; return n })}
                      className="absolute top-2 end-2 w-6 h-6 bg-gray-950/80 rounded-full text-gray-400 hover:text-white text-xs flex items-center justify-center"
                    >✕</button>
                  </div>
                </div>
              ) : (
                <SearchMovie onSelect={(m) => addMovie(m, idx)} locale={locale} label={L('search')} />
              )}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        {filled.length >= 2 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-start text-gray-500 font-medium w-32">Criterion</th>
                    {filled.map((m) => (
                      <th key={m.slug} className="px-4 py-3 text-center text-white font-bold">
                        <Link href={`/${locale}/movies/${m.slug}`} className="hover:text-amber-400 transition-colors">
                          {isRTL ? m.title_ar : m.title}
                        </Link>
                        <div className="text-gray-500 text-xs font-normal">{m.year}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map(({ key, label }) => {
                    const vals = filled.map(m => (m as any)[key] as number)
                    const max = Math.max(...vals)
                    return (
                      <tr key={key} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 py-3 text-gray-400">{label}</td>
                        {filled.map((m, i) => {
                          const val = (m as any)[key] as number
                          const isWinner = val === max && vals.filter(v => v === max).length === 1
                          return (
                            <td key={m.slug} className="px-4 py-3">
                              <div className={`${isWinner ? 'text-amber-400' : 'text-white'} font-bold text-center mb-1`}>
                                {isWinner ? '🥇 ' : ''}{val}
                              </div>
                              <RatingBar value={val} />
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr className="border-b border-gray-800/50">
                    <td className="px-4 py-3 text-gray-400">🍅 RT</td>
                    {filled.map((m) => (
                      <td key={m.slug} className="px-4 py-3 text-center font-bold text-red-400">{m.rotten_tomatoes}%</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-400">⏱️ {isRTL ? 'المدة' : 'Duration'}</td>
                    {filled.map((m) => (
                      <td key={m.slug} className="px-4 py-3 text-center text-gray-300">{m.duration} min</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
