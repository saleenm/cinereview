'use client'

import { useEffect, useRef } from 'react'

/**
 * Custom cinematic cursor — desktop only
 * - Dot follows instantly, ring follows with spring lag
 * - Expands on card hover (cursor-expand class or data-cursor="expand")
 * - Shows play icon on movie poster hover (data-cursor="play")
 * - Respects prefers-reduced-motion
 */
export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Desktop only — skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Show cursors
    dot.style.display  = 'block'
    ring.style.display = 'block'
    // Hide native cursor globally
    document.documentElement.style.cursor = 'none'

    let mx = -200, my = -200
    let rx = -200, ry = -200
    let rafId = 0
    let cursorState: 'default' | 'expand' | 'play' | 'pointer' = 'default'

    const setDotPos = (x: number, y: number) => {
      dot.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`
    }

    const animate = () => {
      // Ring springs toward cursor — faster & smoother
      rx += (mx - rx) * 0.25
      ry += (my - ry) * 0.25
      ring.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0)`
      rafId = requestAnimationFrame(animate)
    }

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      setDotPos(mx, my)
    }

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const closest = target.closest('[data-cursor]') as HTMLElement | null
      const cursorType = closest?.dataset.cursor

      if (cursorType === 'play') {
        cursorState = 'play'
        ring.classList.add('cursor-play')
        ring.classList.remove('cursor-expand', 'cursor-pointer')
      } else if (
        cursorType === 'expand' ||
        target.closest('.card-glow') ||
        target.closest('.cin-rated-item') ||
        target.closest('[class*="genre-card"]')
      ) {
        cursorState = 'expand'
        ring.classList.add('cursor-expand')
        ring.classList.remove('cursor-play', 'cursor-pointer')
      } else if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button')
      ) {
        cursorState = 'pointer'
        ring.classList.add('cursor-pointer')
        ring.classList.remove('cursor-expand', 'cursor-play')
      } else {
        cursorState = 'default'
        ring.classList.remove('cursor-expand', 'cursor-play', 'cursor-pointer')
      }
    }

    const onLeave = () => {
      cursorState = 'default'
      ring.classList.remove('cursor-expand', 'cursor-play', 'cursor-pointer')
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout',  onLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout',  onLeave)
      cancelAnimationFrame(rafId)
      document.documentElement.style.cursor = ''
      if (dot)  dot.style.display  = 'none'
      if (ring) ring.style.display = 'none'
    }
  }, [])

  return (
    <>
      {/* Cursor dot — instant */}
      <div
        ref={dotRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--cin-gold, #d4a852)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          boxShadow: '0 0 6px rgba(212,168,82,0.8)',
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease',
        }}
      />

      {/* Cursor ring — spring lag */}
      <div
        ref={ringRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1.5px solid rgba(212,168,82,0.6)',
          pointerEvents: 'none',
          zIndex: 99998,
          willChange: 'transform',
          transition: 'width 0.15s cubic-bezier(0.16,1,0.3,1), height 0.15s cubic-bezier(0.16,1,0.3,1), background 0.15s ease, border-color 0.15s ease',
        }}
        className="cin-cursor-ring"
      />

      <style>{`
        /* Hide native cursor on descendants */
        html:has(.cin-cursor-ring[style*="block"]) *,
        html:has(.cin-cursor-ring[style*="block"]) a,
        html:has(.cin-cursor-ring[style*="block"]) button {
          cursor: none !important;
        }

        /* Expand on cards */
        .cin-cursor-ring.cursor-expand {
          width: 64px !important;
          height: 64px !important;
          border-color: rgba(212,168,82,0.8) !important;
          background: rgba(212,168,82,0.05) !important;
          margin-top: -12px;
          margin-left: -12px;
        }

        /* Pointer on links/buttons */
        .cin-cursor-ring.cursor-pointer {
          width: 32px !important;
          height: 32px !important;
          border-color: rgba(212,168,82,0.9) !important;
          background: rgba(212,168,82,0.08) !important;
          margin-top: 4px;
          margin-left: 4px;
        }

        /* Play icon on poster hover */
        .cin-cursor-ring.cursor-play {
          width: 56px !important;
          height: 56px !important;
          border-color: rgba(212,168,82,0.9) !important;
          background: rgba(212,168,82,0.12) !important;
          margin-top: -8px;
          margin-left: -8px;
        }
        .cin-cursor-ring.cursor-play::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 55%;
          transform: translate(-50%, -50%);
          border: 0 solid transparent;
          border-top: 9px solid transparent;
          border-bottom: 9px solid transparent;
          border-left: 14px solid rgba(212,168,82,0.9);
        }
      `}</style>
    </>
  )
}
