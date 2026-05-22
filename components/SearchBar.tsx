'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setOpen(true)
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div ref={ref} className="relative hidden md:block">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 w-52 focus-within:border-amber-500/50 transition-colors">
        <span className="text-gray-500 text-sm">{loading ? '⏳' : '🔍'}</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
          className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none w-full"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false) }} className="text-gray-600 hover:text-gray-400 text-xs">✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className={`absolute top-full mt-2 ${isRTL ? 'right-0' : 'left-0'} w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden`}>
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
