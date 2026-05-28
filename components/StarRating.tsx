'use client'

import { useState, useEffect } from 'react'

interface Props {
  movieSlug: string
  size?: 'sm' | 'md'
}

const STORAGE_KEY = 'cinereview_ratings'

function getRatings(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

export default function StarRating({ movieSlug, size = 'sm' }: Props) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const ratings = getRatings()
    if (ratings[movieSlug]) setRating(ratings[movieSlug])
  }, [movieSlug])

  const handleRate = (star: number) => {
    const ratings = getRatings()
    ratings[movieSlug] = star
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
    setRating(star)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const starSize = size === 'sm' ? 'text-sm' : 'text-lg'
  const active = hover || rating

  return (
    <div className="flex items-center gap-0.5" title={rating ? `تقييمك: ${rating}/5` : 'قيّم الفيلم'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRate(star) }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`${starSize} transition-all duration-150 leading-none ${
            star <= active ? 'text-amber-400 scale-110' : 'text-gray-600 hover:text-amber-300'
          }`}
        >
          ★
        </button>
      ))}
      {saved && <span className="text-green-400 text-xs ms-1">✓</span>}
    </div>
  )
}
