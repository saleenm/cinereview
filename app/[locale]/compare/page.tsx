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
      <main style={{ background: '#030712' }}>
        {/* Hero */}
        <section className="border-b border-gray-800/50"
          style={{ background: 'radial-gradient(ellipse 100% 200% at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%), #0a0e17' }}>
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold mb-4">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 20V10M12 20V4M6 20v-6"/>
              </svg>
              {L('title')}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{L('title')}</h1>
            <p className="text-gray-400">{isRTL ? 'قارن بين 2 أو 3 أفلام جنبًا إلى جنب' : 'Compare 2 or 3 films side by side'}</p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Search slots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[0, 1, 2].map((idx) => (
              <div key={idx}>
                {movies[idx] ? (
                  <div className="bg-gray-900/80 border border-amber-500/30 rounded-2xl overflow-hidden shine-card">
                    <div className="relative h-44">
                      <Image src={(movies[idx] as Movie).poster_url} alt={(movies[idx] as Movie).title} fill className="object-cover opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
                      <div className="absolute bottom-3 start-3 end-8">
                        <p className="text-white font-bold text-sm leading-tight line-clamp-2">
                          {isRTL ? (movies[idx] as Movie).title_ar : (movies[idx] as Movie).title}
                        </p>
                        <p className="text-amber-400 text-xs mt-1 flex items-center gap-1">
                          <svg width="9" height="9" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          {(movies[idx] as Movie).rating_overall} · {(movies[idx] as Movie).year}
                        </p>
                      </div>
                      <button
                        onClick={() => setMovies(prev => { const n = [...prev]; n[idx] = null; return n })}
                        className="absolute top-2 end-2 w-7 h-7 bg-gray-950/80 border border-gray-700 rounded-full text-gray-400 hover:text-white text-xs flex items-center justify-center transition-colors"
                      >✕</button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-900/60 border border-dashed border-gray-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 min-h-[11rem]">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <svg width="18" height="18" fill="none" stroke="#4b5563" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    </div>
                    <SearchMovie onSelect={(m) => addMovie(m, idx)} locale={locale} label={L('search')} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison table */}
          {filled.length >= 2 && (
            <div className="bg-gray-900/80 border border-gray-800/60 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="px-5 py-4 text-start text-gray-500 font-medium text-xs uppercase tracking-wider w-36">
                        {isRTL ? 'المعيار' : 'Criterion'}
                      </th>
                      {filled.map((m) => (
                        <th key={m.slug} className="px-5 py-4 text-center">
                          <Link href={`/${locale}/movies/${m.slug}`} className="text-white hover:text-amber-400 transition-colors font-bold text-sm block">
                            {isRTL ? m.title_ar : m.title}
                          </Link>
                          <div className="text-gray-500 text-xs font-normal mt-0.5">{m.year}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {CRITERIA.map(({ key, label }) => {
                      const vals = filled.map(m => (m as any)[key] as number)
                      const max = Math.max(...vals)
                      return (
                        <tr key={key} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                          <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">{label}</td>
                          {filled.map((m) => {
                            const val = (m as any)[key] as number
                            const isWinner = val === max && vals.filter(v => v === max).length === 1
                            return (
                              <td key={m.slug} className="px-5 py-3.5">
                                <div className={`${isWinner ? 'text-amber-400' : 'text-white'} font-bold text-center mb-2 flex items-center justify-center gap-1`}>
                                  {isWinner && <svg width="10" height="10" fill="#f59e0b" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                                  {val}
                                </div>
                                <RatingBar value={val} />
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                    <tr className="border-b border-gray-800/50">
                      <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">🍅 RT</td>
                      {filled.map((m) => (
                        <td key={m.slug} className="px-5 py-3.5 text-center font-bold text-red-400">{m.rotten_tomatoes}%</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-5 py-3.5 text-gray-400 text-xs font-medium">
                        <svg className="inline me-1" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        {isRTL ? 'المدة' : 'Duration'}
                      </td>
                      {filled.map((m) => (
                        <td key={m.slug} className="px-5 py-3.5 text-center text-gray-300">{m.duration} min</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filled.length < 2 && (
            <div className="text-center py-16 text-gray-600">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center">
                <svg width="28" height="28" fill="none" stroke="#374151" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
              </div>
              <p className="text-sm">{isRTL ? 'أضف فيلمين على الأقل للمقارنة' : 'Add at least 2 films to compare'}</p>
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
