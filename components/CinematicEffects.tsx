'use client'

import { useEffect, useState } from 'react'

export default function CinematicEffects() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    /* ── Loader ── */
    const loaderTimer = setTimeout(() => setLoaded(true), 2200)

    /* ── Cursor + spotlight ── */
    const cursor    = document.getElementById('cin-cursor')
    const ring      = document.getElementById('cin-cursor-ring')
    const spotlight = document.getElementById('cin-spotlight')

    let mx = window.innerWidth/2, my = window.innerHeight/2
    let rx = mx, ry = my, ringRaf = 0

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (cursor)    { cursor.style.left = mx+'px'; cursor.style.top = my+'px' }
      if (spotlight) { spotlight.style.left = mx+'px'; spotlight.style.top = my+'px' }
    }
    const animRing = () => {
      rx += (mx-rx)*0.12; ry += (my-ry)*0.12
      if (ring) { ring.style.left = rx+'px'; ring.style.top = ry+'px' }
      ringRaf = requestAnimationFrame(animRing)
    }
    ringRaf = requestAnimationFrame(animRing)
    document.addEventListener('mousemove', onMouseMove)

    /* cursor hover scaling */
    const bindHover = () => {
      document.querySelectorAll('a, button, .cin-tilt').forEach(el => {
        el.addEventListener('mouseenter', () => {
          if (cursor) { cursor.style.width='20px'; cursor.style.height='20px' }
          if (ring)   { ring.style.width='60px';   ring.style.height='60px' }
        })
        el.addEventListener('mouseleave', () => {
          if (cursor) { cursor.style.width='12px'; cursor.style.height='12px' }
          if (ring)   { ring.style.width='40px';   ring.style.height='40px' }
        })
      })
    }
    bindHover()

    /* ── Scroll: progress bar ── */
    const progress = document.getElementById('cin-progress')
    const onScroll = () => {
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight
        if (h > 0) progress.style.width = (window.scrollY / h * 100) + '%'
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    /* ── Text decode animation ── */
    const decodeEl = document.querySelector('[data-decode]') as HTMLElement | null
    if (decodeEl) {
      const final = decodeEl.dataset.decode!
      const chars = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي◆★▲✦⬡'
      const decodeTimer = setTimeout(() => {
        let frame = 0
        const iv = setInterval(() => {
          decodeEl.textContent = final.split('').map((c, i) =>
            i < frame/3 ? c : chars[Math.floor(Math.random()*chars.length)]
          ).join('')
          frame++
          if (frame/3 > final.length) { decodeEl.textContent = final; clearInterval(iv) }
        }, 50)
      }, 1400)
      // Store timer for cleanup
      ;(decodeEl as HTMLElement & { _decTimer?: ReturnType<typeof setTimeout> })._decTimer = decodeTimer
    }

    /* ── Magnetic buttons ── */
    document.querySelectorAll('.cin-magnetic').forEach(el => {
      const h = el as HTMLElement
      const onMM = (e: Event) => {
        const me = e as MouseEvent
        const r = h.getBoundingClientRect()
        h.style.transform = `translate(${(me.clientX-r.left-r.width/2)*0.3}px,${(me.clientY-r.top-r.height/2)*0.4}px)`
      }
      const onML = () => { h.style.transform = 'translate(0,0)' }
      h.addEventListener('mousemove', onMM)
      h.addEventListener('mouseleave', onML)
    })

    /* ── 3-D tilt cards ── */
    document.querySelectorAll('.cin-tilt').forEach(card => {
      const h = card as HTMLElement
      const onMM = (e: Event) => {
        const me = e as MouseEvent
        const r = h.getBoundingClientRect()
        const px = (me.clientX-r.left)/r.width
        const py = (me.clientY-r.top)/r.height
        h.style.transform = `rotateX(${(0.5-py)*14}deg) rotateY(${(px-0.5)*14}deg) translateZ(10px)`
      }
      const onML = () => { h.style.transform = 'rotateX(0) rotateY(0) translateZ(0)' }
      h.addEventListener('mousemove', onMM)
      h.addEventListener('mouseleave', onML)
    })

    /* ── Count-up stats ── */
    const counters = document.querySelectorAll<HTMLElement>('[data-cin-count]')
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = +(el.dataset.cinCount || 0)
        let cur = 0
        const step = target / 60
        const iv = setInterval(() => {
          cur = Math.min(cur + step, target)
          el.textContent = Math.floor(cur).toLocaleString('ar-SA')
          if (cur >= target) clearInterval(iv)
        }, 20)
        countObs.unobserve(el)
      })
    }, { threshold: 0.5 })
    counters.forEach(c => countObs.observe(c))

    /* ── Score bars ── */
    const bars = document.querySelectorAll<HTMLElement>('[data-cin-score]')
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          el.style.width = el.dataset.cinScore + '%'
          barObs.unobserve(el)
        }
      })
    }, { threshold: 0.5 })
    bars.forEach(b => barObs.observe(b))

    /* ── Scroll reveal ── */
    const revEls = document.querySelectorAll<HTMLElement>('.cin-reveal')
    const revObs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement
          setTimeout(() => {
            el.style.opacity = '1'
            el.style.transform = el.classList.contains('cin-reveal-x')
              ? 'translateX(0)' : 'translateY(0) scale(1)'
          }, i * 80)
          revObs.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    revEls.forEach(el => {
      el.style.opacity = '0'
      el.style.transition = 'opacity 0.7s, transform 0.7s'
      el.style.transform = el.classList.contains('cin-reveal-x')
        ? 'translateX(30px)' : 'translateY(20px) scale(0.98)'
      revObs.observe(el)
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
    }
  }, [])

  return (
    <>
      {/* ── Scroll progress bar ── */}
      <div id="cin-progress" style={{
        position:'fixed', top:0, right:0, height:3, width:'0%',
        background:'linear-gradient(to left, #d4a852, #f5c842, #8b0000)',
        zIndex:9999, boxShadow:'0 0 12px rgba(212,168,82,0.6)',
        transition:'width 0.1s linear', pointerEvents:'none',
      }} />

      {/* ── Loader overlay ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:2000,
        background:'#08080f',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:30,
        opacity: loaded ? 0 : 1,
        visibility: loaded ? 'hidden' : 'visible',
        transition:'opacity 0.8s, visibility 0.8s',
        pointerEvents: loaded ? 'none' : 'all',
      }}>
        <div style={{ fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'3rem', fontWeight:900, background:'linear-gradient(135deg,#d4a852,#f5c842)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:8 }}>
          CINE
        </div>
        <div style={{ width:200, height:1, background:'rgba(212,168,82,0.15)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, right:0, height:'100%', background:'linear-gradient(to left,#f5c842,#d4a852)', animation:'cin-loadbar 2s ease-out forwards' }} />
        </div>
        <div style={{ fontSize:'0.6rem', letterSpacing:6, color:'rgba(212,168,82,0.4)', textTransform:'uppercase' }}>
          جاري تحميل عالم السينما
        </div>
      </div>

      {/* ── Custom cursor (hidden on mobile via CSS) ── */}
      <div id="cin-cursor" className="cin-cursor-el" style={{
        position:'fixed', width:12, height:12, background:'#d4a852',
        borderRadius:'50%', pointerEvents:'none', zIndex:10000,
        transform:'translate(-50%,-50%)',
        transition:'transform 0.1s, width 0.3s, height 0.3s',
        mixBlendMode:'screen',
      }} />
      <div id="cin-cursor-ring" className="cin-cursor-el" style={{
        position:'fixed', width:40, height:40,
        border:'1px solid rgba(212,168,82,0.5)',
        borderRadius:'50%', pointerEvents:'none', zIndex:9998,
        transform:'translate(-50%,-50%)',
        transition:'transform 0.15s ease-out, width 0.3s, height 0.3s',
      }} />
      <div id="cin-spotlight" className="cin-cursor-el" style={{
        position:'fixed', width:600, height:600,
        borderRadius:'50%', pointerEvents:'none', zIndex:2,
        background:'radial-gradient(circle, rgba(212,168,82,0.07) 0%, transparent 65%)',
        transform:'translate(-50%,-50%)',
        transition:'opacity 0.4s',
      }} />

      {/* ── Film grain overlay ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:4, pointerEvents:'none',
        opacity:0.45, mixBlendMode:'overlay',
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
        animation:'cin-grain 0.5s steps(2) infinite',
      }} />

      {/* ── Vignette ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:3, pointerEvents:'none',
        background:'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
      }} />
    </>
  )
}
