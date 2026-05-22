'use client'

import { useEffect, useState } from 'react'

interface Props {
  slug: string
  title: string
}

export default function WatchlistButton({ slug, title }: Props) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const list: string[] = JSON.parse(localStorage.getItem('watchlist') || '[]')
    setSaved(list.includes(slug))
  }, [slug])

  const toggle = () => {
    const list: string[] = JSON.parse(localStorage.getItem('watchlist') || '[]')
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]
    localStorage.setItem('watchlist', JSON.stringify(next))
    setSaved(next.includes(slug))
  }

  return (
    <button
      onClick={toggle}
      title={saved ? `Remove ${title} from watchlist` : `Add ${title} to watchlist`}
      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-colors border ${
        saved
          ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400'
          : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-amber-500/20 hover:border-amber-500/40 hover:text-amber-400'
      }`}
    >
      {saved ? '★ Saved' : '☆ Watchlist'}
    </button>
  )
}
