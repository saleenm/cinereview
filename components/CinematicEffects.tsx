'use client'

import { useEffect, useState } from 'react'

export default function CinematicEffects() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    /* ── Loader ── */
    const loaderTimer = setTimeout(() => setLoaded(true), 2000)

    /* ── Subtle spotlight only — no custom cursor ── */
    const spotlight = document.getElementById('cin-spotlight')
    let sx = -500, sy = -500

    const onMouseMove = (e: MouseEvent) => {
      sx = e.clientX; sy = e.clientY
      spotlight?.style.setProperty('transform', `translate3d(${sx - 350}px,${sy - 350}px,0)`)
    }

    let ringRaf = 0
    const animRing = () => { ringRaf = requestAnimationFrame(animRing) }
    ringRaf = requestAnimationFrame(animRing)
    document.addEventListener('mousemove', onMouseMove)

    const bindHover = () => {}

    /* ── Scroll: progress bar + parallax sections ── */
    const progress = document.getElementById('cin-progress')

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (progress && h > 0) {
        progress.style.width = (window.scrollY / h * 100) + '%'
      }
      // Parallax: sections with data-parallax get a subtle Y offset
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax || '0.3')
        const rect  = el.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2 - window.innerHeight / 2
        el.style.transform = `translate3d(0, ${centerY * speed * -0.18}px, 0)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── Text decode animation ── */
    const decodeEl = document.querySelector('[data-decode]') as HTMLElement | null
    if (decodeEl) {
      const final  = decodeEl.dataset.decode!
      const isArab = /[\u0600-\u06FF]/.test(final)
      const chars  = isArab
        ? 'ابتثجحخدذرزسشصضطظعغفقكلمنهويء◆★▲'
        : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ◆★▲▼■'
      setTimeout(() => {
        let frame = 0
        const iv = setInterval(() => {
          decodeEl.textContent = final.split('').map((c, i) =>
            i < frame / 2.5 ? c : chars[Math.floor(Math.random() * chars.length)]
          ).join('')
          frame++
          if (frame / 2.5 > final.length) { decodeEl.textContent = final; clearInterval(iv) }
        }, 40)
      }, 1000)
    }

    /* ── Magnetic buttons ── */
    document.querySelectorAll('.cin-magnetic').forEach(el => {
      const h = el as HTMLElement
      const onMM = (e: Event) => {
        const me = e as MouseEvent
        const r  = h.getBoundingClientRect()
        const dx = (me.clientX - r.left - r.width/2)  * 0.22
        const dy = (me.clientY - r.top  - r.height/2) * 0.30
        h.style.transform = `translate3d(${dx}px,${dy}px,0) scale(1.03)`
      }
      const onML = () => { h.style.transform = 'translate3d(0,0,0) scale(1)' }
      h.addEventListener('mousemove', onMM)
      h.addEventListener('mouseleave', onML)
    })

    /* ── Count-up stats — Western digits for Cinzel ── */
    const counters = document.querySelectorAll<HTMLElement>('[data-cin-count]')
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el     = e.target as HTMLElement
        const target = +(el.dataset.cinCount || 0)
        let   cur    = 0
        const step   = target / 70
        const iv     = setInterval(() => {
          cur = Math.min(cur + step, target)
          el.textContent = Math.floor(cur).toLocaleString('en-US')
          if (cur >= target) clearInterval(iv)
        }, 14)
        countObs.unobserve(el)
      })
    }, { threshold: 0.3 })
    counters.forEach(c => countObs.observe(c))

    /* ── Score bars ── */
    const bars   = document.querySelectorAll<HTMLElement>('[data-cin-score]')
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          el.style.width = el.dataset.cinScore + '%'
          barObs.unobserve(el)
        }
      })
    }, { threshold: 0.3 })
    bars.forEach(b => barObs.observe(b))

    /* ── Respect reduced motion ── */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* ── Scroll reveal — staggered per batch ── */
    const revEls  = document.querySelectorAll<HTMLElement>('.cin-reveal')
    const revBatches = new Map<Element, number>()
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const el     = e.target as HTMLElement
        const parent = el.parentElement || document.body
        const idx    = (revBatches.get(parent) || 0)
        revBatches.set(parent, idx + 1)

        const delay = prefersReducedMotion ? 0 : idx * 70
        setTimeout(() => {
          el.style.opacity   = '1'
          el.style.transform = el.classList.contains('cin-reveal-x')
            ? 'translateX(0)' : 'translateY(0) scale(1)'
        }, delay)
        revObs.unobserve(el)
      })
    }, { threshold: 0.06 })

    revEls.forEach(el => {
      if (prefersReducedMotion) { el.style.opacity = '1'; return }
      el.style.opacity    = '0'
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)'
      el.style.transform  = el.classList.contains('cin-reveal-x')
        ? 'translateX(28px)' : 'translateY(22px) scale(0.96)'
      revObs.observe(el)
    })

    /* ── Stagger children (.cin-stagger-child) ── */
    const staggerParents = document.querySelectorAll<HTMLElement>('[class*="cin-grid-stagger"], .cin-stagger-parent')
    const staggerObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        const parent = e.target as HTMLElement
        const children = parent.querySelectorAll<HTMLElement>('.cin-stagger-child')
        children.forEach((child, i) => {
          const delay = prefersReducedMotion ? 0 : i * 55
          setTimeout(() => child.classList.add('is-visible'), delay)
        })
        staggerObs.unobserve(parent)
      })
    }, { threshold: 0.05 })

    document.querySelectorAll<HTMLElement>('.cin-grid-stagger, .cin-stagger-parent').forEach(p => {
      staggerObs.observe(p)
    })

    /* ── Escape closes modal ── */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('cin-modal')
        if (modal) modal.removeAttribute('data-open')
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      clearTimeout(loaderTimer)
      cancelAnimationFrame(ringRaf)
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      countObs.disconnect()
      barObs.disconnect()
      revObs.disconnect()
      staggerObs.disconnect()
    }
  }, [])

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <div id="cin-progress" style={{
        position:'fixed', top:0, left:0, height:2, width:'0%',
        background:'linear-gradient(to right, #8b0000, #d4a852, #f5c842)',
        zIndex:9999, boxShadow:'0 0 10px rgba(212,168,82,0.7)',
        pointerEvents:'none', willChange:'width',
        transition:'width 0.1s linear',
      }} />

      {/* ── Loader overlay ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:2000,
        background:'#08080f',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:28,
        opacity: loaded ? 0 : 1,
        visibility: loaded ? 'hidden' : 'visible',
        transition:'opacity 0.9s cubic-bezier(0.16,1,0.3,1), visibility 0.9s',
        pointerEvents: loaded ? 'none' : 'all',
      }}>
        {/* Film reel icon */}
        <div style={{
          width:60, height:60, borderRadius:'50%',
          border:'2px solid rgba(212,168,82,0.3)',
          display:'flex', alignItems:'center', justifyContent:'center',
          position:'relative',
        }}>
          <div style={{
            width:28, height:28, borderRadius:'50%',
            border:'2px solid rgba(212,168,82,0.6)',
            background:'radial-gradient(circle,rgba(212,168,82,0.2),transparent)',
          }} />
          {[0,60,120,180,240,300].map(deg => (
            <div key={deg} style={{
              position:'absolute', width:6, height:6, borderRadius:'50%',
              background:'rgba(212,168,82,0.5)',
              transform:`rotate(${deg}deg) translateY(-22px)`,
            }} />
          ))}
        </div>

        <div style={{
          fontFamily:'var(--font-cinzel,Cinzel,serif)',
          fontSize:'2.5rem', fontWeight:900,
          background:'linear-gradient(135deg,#d4a852,#f5c842)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          letterSpacing:10,
        }}>
          CINE
        </div>

        <div style={{ width:180, height:1, background:'rgba(212,168,82,0.1)', position:'relative', overflow:'hidden' }}>
          <div style={{
            position:'absolute', top:0, left:0, height:'100%',
            background:'linear-gradient(to right,#d4a852,#f5c842)',
            animation:'cin-loadbar 1.9s ease-out forwards',
          }} />
        </div>

        <div style={{ fontSize:'0.55rem', letterSpacing:7, color:'rgba(212,168,82,0.35)', textTransform:'uppercase' }}>
          جاري تحميل عالم السينما
        </div>
      </div>

      {/* ── Subtle spotlight glow only ── */}
      <div id="cin-spotlight" style={{
        position:'fixed', top:0, left:0,
        width:700, height:700,
        borderRadius:'50%', pointerEvents:'none', zIndex:2,
        background:'radial-gradient(circle, rgba(212,168,82,0.04) 0%, transparent 60%)',
        transform:'translate3d(-500px,-500px,0)',
        willChange:'transform',
        transition:'transform 0.08s linear',
      }} />

      {/* ── Film grain overlay ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:4, pointerEvents:'none',
        opacity:0.25, mixBlendMode:'overlay',
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        animation:'cin-grain 0.9s steps(3) infinite',
      }} />

      {/* ── Vignette ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:3, pointerEvents:'none',
        background:'radial-gradient(ellipse 85% 85% at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* ── Horizontal scan lines (subtle) ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:3, pointerEvents:'none',
        backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        opacity:0.5,
      }} />
    </>
  )
}
