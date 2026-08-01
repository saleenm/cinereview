'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const ref     = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Instantly hide, then animate in on next frame
    el.style.opacity   = '0'
    el.style.transform = 'translateY(16px)'
    el.style.transition = 'none'

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1)'
        el.style.opacity   = '1'
        el.style.transform = 'translateY(0)'
      })
    })
    return () => cancelAnimationFrame(id)
  }, [pathname])

  return (
    <div ref={ref} style={{ minHeight: '100%', willChange: 'opacity, transform' }}>
      {children}
    </div>
  )
}
