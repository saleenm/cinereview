'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function HeroTitle({ isRTL }: { isRTL: boolean }) {
  const cinemaRef  = useRef<HTMLSpanElement>(null)
  const worldRef   = useRef<HTMLSpanElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const topLineRef = useRef<HTMLDivElement>(null)
  const botLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cinema  = cinemaRef.current
    const world   = worldRef.current
    const line    = lineRef.current
    const wrap    = wrapRef.current
    const topLine = topLineRef.current
    const botLine = botLineRef.current
    if (!cinema || !world) return

    /* ── Initial hidden state ── */
    gsap.set(cinema,  { opacity: 0, y: -100, rotationX: 80, transformPerspective: 1200, transformOrigin: 'center bottom' })
    gsap.set(world,   { opacity: 0, y: 55, scale: 0.65 })
    gsap.set([line, topLine, botLine].filter(Boolean), { scaleX: 0, opacity: 0 })

    /* ── Entrance timeline ── */
    const tl = gsap.timeline({ delay: 0.25 })

    tl.to(topLine, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.out' })
      .to(cinema, { opacity: 1, y: 0, rotationX: 0, duration: 1.2, ease: 'back.out(1.9)' }, '-=0.2')
      .to(line,   { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4')
      .to(world,  { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'back.out(1.4)' }, '-=0.45')
      .to(botLine, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, '-=0.5')

    /* ── Shimmer: animate background-position of CINEMA gradient ── */
    gsap.set(cinema, { backgroundSize: '300% 100%', backgroundPosition: '0% 50%' })
    gsap.to(cinema, {
      backgroundPosition: '100% 50%',
      duration: 2.2,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1,
      repeatDelay: 1.8,
      delay: 2.0,
    })

    /* ── Glow pulse on CINEMA — strong ── */
    gsap.to(cinema, {
      filter: 'drop-shadow(0 0 50px rgba(212,168,82,0.95)) drop-shadow(0 0 100px rgba(212,168,82,0.55)) drop-shadow(0 0 140px rgba(245,199,66,0.25))',
      duration: 2.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.6,
    })

    /* ── WORLD float ── */
    gsap.to(world, {
      y: -20,
      duration: 3.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.8,
    })

    /* ── WORLD letter-spacing breathe ── */
    gsap.to(world, {
      letterSpacing: '0.42em',
      textShadow: '0 0 60px rgba(212,168,82,0.5), 0 0 120px rgba(212,168,82,0.2)',
      duration: 4.0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.2,
    })

    /* ── Decorative lines pulse ── */
    gsap.to([topLine, botLine].filter(Boolean), {
      opacity: 0.4,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.4,
      stagger: 0.4,
    })

    /* ── 3D tilt of whole block ── */
    if (wrap) {
      gsap.to(wrap, {
        rotationY: 8,
        transformPerspective: 1400,
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.8,
      })
    }

    return () => {
      gsap.killTweensOf([cinema, world, wrap, line, topLine, botLine])
    }
  }, [])

  const goldLine = 'linear-gradient(90deg, transparent, rgba(212,168,82,0.3) 15%, rgba(212,168,82,0.8) 50%, rgba(212,168,82,0.3) 85%, transparent)'

  return (
    <div
      ref={wrapRef}
      style={{ textAlign: 'center', lineHeight: 0.88, marginBottom: 30, willChange: 'transform' }}
    >
      {/* ── Decorative top line ── */}
      <div ref={topLineRef} style={{
        height: 1,
        background: goldLine,
        marginBottom: 18,
        width: '65%',
        marginLeft: 'auto',
        marginRight: 'auto',
        transformOrigin: 'center',
      }} />

      {/* ── CINEMA ── shimmer gradient via backgroundPosition animation ── */}
      <span
        ref={cinemaRef}
        style={{
          display: 'block',
          fontFamily: 'var(--font-cinzel, Cinzel, serif)',
          fontSize: 'clamp(3.8rem, 11vw, 10rem)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(105deg, #b8832a 0%, #d4a852 10%, #e8d5a0 22%, #fffbe8 33%, #f5c842 44%, #d4a852 55%, #b8832a 66%, #d4a852 77%, #e8d5a0 88%, #fffbe8 100%)',
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 4px 28px rgba(212,168,82,0.55))',
          willChange: 'transform, filter, opacity',
        }}
      >
        CINEMA
      </span>

      {/* ── Divider line ── */}
      <div
        ref={lineRef}
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,168,82,0.5) 20%, rgba(255,251,232,0.5) 50%, rgba(212,168,82,0.5) 80%, transparent)',
          margin: '12px auto',
          width: '55%',
          transformOrigin: 'center',
        }}
      />

      {/* ── WORLD ── */}
      <span
        ref={worldRef}
        style={{
          display: 'block',
          fontFamily: 'var(--font-cinzel, Cinzel, serif)',
          fontSize: 'clamp(1.8rem, 5vw, 4.8rem)',
          fontWeight: 400,
          letterSpacing: '0.3em',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(212,168,82,0.85)',
          textShadow: '0 0 40px rgba(212,168,82,0.3), 0 0 80px rgba(212,168,82,0.12)',
          willChange: 'transform, opacity',
        }}
      >
        {isRTL ? 'عالم السينما' : 'WORLD'}
      </span>

      {/* ── Decorative bottom line ── */}
      <div ref={botLineRef} style={{
        height: 1,
        background: goldLine,
        marginTop: 18,
        width: '65%',
        marginLeft: 'auto',
        marginRight: 'auto',
        transformOrigin: 'center',
      }} />
    </div>
  )
}
