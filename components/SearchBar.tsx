'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface SearchResult {
  slug: string
  title: string
  title_ar: string
  year: number
  poster_url: string
  rating_overall: number
  genres: string[]
}

export default function SearchBar({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isRTL = locale === 'ar'

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`)
        const data = await res.json()
        setResults(data.results || data)
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const goToSearch = () => {
    if (query.trim()) {
      setOpen(false)
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push(`/${locale}/search`)
    }
  }

  return (
    <div ref={ref} className="relative hidden md:block" role="search">
      <div className="search-glow flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 w-52 focus-within:border-amber-500/50 transition-colors">
        <button
          onClick={goToSearch}
          aria-label={isRTL ? 'بحث' : 'Search'}
          className="text-gray-500 hover:text-amber-400 transition-colors flex-shrink-0 flex items-center justify-center"
          style={{ minHeight: 'unset' }}
        >
          {loading ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          )}
        </button>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && goToSearch()}
          placeholder={t('search')}
          aria-label={t('search')}
          aria-autocomplete="list"
          aria-controls={open ? 'search-results' : undefined}
          className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            aria-label={isRTL ? 'مسح البحث' : 'Clear search'}
            className="text-gray-600 hover:text-gray-300 transition-colors flex-shrink-0"
            style={{ minHeight: 'unset' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div id="search-results" role="listbox" aria-label={isRTL ? 'نتائج البحث' : 'Search results'}
          className={`absolute top-full mt-2 ${isRTL ? 'right-0' : 'left-0'} w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden`}>
          {results.map((m) => (
            <Link
              key={m.slug}
              href={`/${locale}/movies/${m.slug}`}
              onClick={() => { setOpen(false); setQuery('') }}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors"
            >
              <div className="relative w-8 h-11 flex-shrink-0 rounded overflow-hidden">
                <Image src={m.poster_url} alt={m.title} fill className="object-cover" sizes="32px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{isRTL ? m.title_ar : m.title}</p>
                <p className="text-xs text-gray-500">{m.year}</p>
              </div>
              <span className="text-amber-400 font-bold text-sm flex-shrink-0">{m.rating_overall}</span>
            </Link>
          ))}
          {/* View all results */}
          <button onClick={goToSearch}
            className="w-full px-4 py-2.5 text-center text-amber-400 text-xs font-bold hover:bg-gray-800 transition-colors border-t border-gray-800">
            {isRTL ? `عرض كل النتائج لـ "${query}"` : `See all results for "${query}"`} →
          </button>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className={`absolute top-full mt-2 ${isRTL ? 'right-0' : 'left-0'} w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 p-4 text-center text-gray-500 text-sm`}>
          {t('noResults')}
        </div>
      )}
    </div>
  )
}
