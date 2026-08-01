'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  movieSlug: string
  size?: 'sm' | 'md'
}

const STORAGE_KEY = 'cinereview_ratings'

function getRatings(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

/* Burst sparkle particles at click position */
function spawnSparkle(x: number, y: number) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const count = 10
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    const angle  = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const dist   = 28 + Math.random() * 22
    const size   = 3 + Math.random() * 3
    const colors = ['#f5c842','#d4a852','#fde68a','#fbbf24','#fff']
    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;
      border-radius:50%;pointer-events:none;z-index:99999;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      box-shadow:0 0 4px rgba(245,200,66,0.8);
    `
    document.body.appendChild(el)
    const tx = Math.cos(angle) * dist
    const ty = Math.sin(angle) * dist
    el.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 },
      ],
      { duration: 500 + Math.random() * 200, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }
    ).onfinish = () => el.remove()
  }
}

export default function StarRating({ movieSlug, size = 'sm' }: Props) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [saved, setSaved] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ratings = getRatings()
    if (ratings[movieSlug]) setRating(ratings[movieSlug])
  }, [movieSlug])

  const handleRate = (star: number, e: React.MouseEvent) => {
    const ratings = getRatings()
    ratings[movieSlug] = star
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings))
    setRating(star)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
    spawnSparkle(e.clientX, e.clientY)
  }

  const starSize = size === 'sm' ? 'text-sm' : 'text-lg'
  const active = hover || rating

  return (
    <div ref={wrapRef} className="flex items-center gap-0.5" title={rating ? `تقييمك: ${rating}/5` : 'قيّم الفيلم'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRate(star, e) }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${star} of 5 stars`}
          className={`${starSize} transition-all duration-150 leading-none ${
            star <= active
              ? 'text-amber-400 scale-110 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
              : 'text-gray-600 hover:text-amber-300'
          }`}
        >
          ★
        </button>
      ))}
      {saved && <span className="text-green-400 text-xs ms-1">✓</span>}
    </div>
  )
}
