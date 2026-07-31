'use client'

import { useEffect, useRef } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  intensity?: number   // 1–20, default 12
  scale?: number       // default 1.04
  glare?: boolean      // show glare sweep, default true
}

export default function CardTilt({
  children,
  className = '',
  style,
  intensity = 12,
  scale = 1.04,
  glare = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = 0
    let targetRX = 0, targetRY = 0
    let currentRX = 0, currentRY = 0
    let glareEl: HTMLDivElement | null = null

    // Add glare overlay
    if (glare) {
      glareEl = document.createElement('div')
      glareEl.style.cssText = `
        position:absolute; inset:0; border-radius:inherit;
        background:radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 65%);
        opacity:0; pointer-events:none; z-index:2;
        transition:opacity 0.3s ease;
      `
      el.style.position = 'relative'
      el.appendChild(glareEl)
    }

    const onEnter = () => {
      el.style.transition = 'box-shadow 0.3s ease'
      el.style.boxShadow = '0 24px 60px rgba(0,0,0,0.5), 0 0 30px rgba(212,168,82,0.12)'
      if (glareEl) glareEl.style.opacity = '1'
    }

    const onLeave = () => {
      targetRX = 0; targetRY = 0
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s ease'
      el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)`
      el.style.boxShadow = ''
      if (glareEl) {
        glareEl.style.opacity = '0'
        glareEl.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12) 0%, transparent 65%)'
      }
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top  + rect.height / 2
      const dx = (e.clientX - cx) / (rect.width / 2)
      const dy = (e.clientY - cy) / (rect.height / 2)

      targetRY =  dx * intensity
      targetRX = -dy * intensity * 0.7

      // Glare position
      if (glareEl) {
        const gx = ((e.clientX - rect.left) / rect.width) * 100
        const gy = ((e.clientY - rect.top)  / rect.height) * 100
        glareEl.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14) 0%, transparent 60%)`
      }
    }

    const animate = () => {
      currentRX += (targetRX - currentRX) * 0.12
      currentRY += (targetRY - currentRY) * 0.12
      el.style.transition = 'none'
      el.style.transform = `perspective(900px) rotateX(${currentRX}deg) rotateY(${currentRY}deg) scale(${scale})`
      rafId = requestAnimationFrame(animate)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    el.addEventListener('mousemove',  onMove)
    rafId = requestAnimationFrame(animate)

    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      el.removeEventListener('mousemove',  onMove)
      cancelAnimationFrame(rafId)
      if (glareEl && el.contains(glareEl)) el.removeChild(glareEl)
    }
  }, [intensity, scale, glare])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  )
}
