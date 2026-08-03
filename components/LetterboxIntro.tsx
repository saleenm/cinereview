'use client'

import { useEffect, useRef } from 'react'

export default function LetterboxIntro() {
  const topRef = useRef<HTMLDivElement>(null)
  const botRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const top = topRef.current
    const bot = botRef.current
    if (!top || !bot) return

    // Start with bars visible
    top.style.transform = 'translateY(0)'
    bot.style.transform = 'translateY(0)'

    const t = setTimeout(() => {
      top.style.transition = 'transform 1.1s cubic-bezier(0.65,0,0.35,1)'
      bot.style.transition = 'transform 1.1s cubic-bezier(0.65,0,0.35,1)'
      top.style.transform = 'translateY(-100%)'
      bot.style.transform = 'translateY(100%)'
    }, 300)

    const t2 = setTimeout(() => {
      if (top) top.style.display = 'none'
      if (bot) bot.style.display = 'none'
    }, 1600)

    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [])

  const style: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    height: '12vh',
    background: '#060406',
    zIndex: 9999,
    pointerEvents: 'none',
  }

  return (
    <>
      <div ref={topRef} style={{ ...style, top: 0 }} />
      <div ref={botRef} style={{ ...style, bottom: 0 }} />
    </>
  )
}
