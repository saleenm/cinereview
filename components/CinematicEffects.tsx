'use client'

import { useEffect, useState } from 'react'

export default function CinematicEffects() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    /* ── Loader ── */
    const loaderTimer = setTimeout(() => setLoaded(true), 600)

    /* ── Subtle spotlight only — no custom cursor ── */
    const spotlight = document.getElementById('cin-spotlight')
    let sx = -500, sy = -500

    const onMouseMove = (e: MouseEvent) => {
      sx = e.clientX; sy = e.clientY
      spotlight?.style.setProperty('transform', `translate3d(${sx - 350}px,${sy - 350}px,0)`)
    }

    document.addEventListener('mousemove', onMouseMove)

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

    /* ── Respect reduced motion ── */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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

    /* ── Global 3-D card tilt (.card-glow) ── */
    const tiltEls: { el: HTMLElement; rafId: number; tRX: number; tRY: number; cRX: number; cRY: number; glare: HTMLDivElement }[] = []

    if (!prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>('.card-glow').forEach(el => {
        el.style.position = 'relative'

        const glare = document.createElement('div')
        glare.style.cssText = `
          position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;
          background:radial-gradient(circle at 50% 50%,rgba(255,255,255,0.10) 0%,transparent 65%);
          opacity:0;transition:opacity 0.3s ease;
        `
        el.appendChild(glare)

        const state = { el, rafId: 0, tRX: 0, tRY: 0, cRX: 0, cRY: 0, glare }

        const loop = () => {
          state.cRX += (state.tRX - state.cRX) * 0.11
          state.cRY += (state.tRY - state.cRY) * 0.11
          el.style.transform = `perspective(800px) rotateX(${state.cRX}deg) rotateY(${state.cRY}deg) scale(1.04)`
          state.rafId = requestAnimationFrame(loop)
        }

        const onEnter = () => {
          state.rafId = requestAnimationFrame(loop)
          glare.style.opacity = '1'
          el.style.zIndex = '10'
          el.style.boxShadow = '0 28px 70px rgba(0,0,0,0.6),0 0 40px rgba(212,168,82,0.22),0 0 80px rgba(212,168,82,0.08)'
        }

        const onLeave = () => {
          state.tRX = 0; state.tRY = 0
          setTimeout(() => {
            cancelAnimationFrame(state.rafId)
            el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
            el.style.zIndex = ''
            el.style.boxShadow = ''
          }, 400)
          glare.style.opacity = '0'
        }

        const onMove = (e: MouseEvent) => {
          const r  = el.getBoundingClientRect()
          const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2)
          const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2)
          state.tRY =  dx * 15
          state.tRX = -dy * 15 * 0.65
          const gx = ((e.clientX - r.left) / r.width)  * 100
          const gy = ((e.clientY - r.top)  / r.height) * 100
          glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%,rgba(255,255,255,0.13) 0%,transparent 60%)`
        }

        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        el.addEventListener('mousemove',  onMove)
        el.style.willChange = 'transform'
        tiltEls.push(state)
      })
    }

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
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('keydown', onKeyDown)
      tiltEls.forEach(s => cancelAnimationFrame(s.rafId))
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

      {/* ── Mouse spotlight glow ── */}
      <div id="cin-spotlight" style={{
        position:'fixed', top:0, left:0,
        width:600, height:600,
        borderRadius:'50%', pointerEvents:'none', zIndex:2,
        background:'radial-gradient(circle, rgba(212,168,82,0.22) 0%, rgba(212,168,82,0.08) 35%, transparent 65%)',
        transform:'translate3d(-500px,-500px,0)',
        willChange:'transform',
        transition:'transform 0.06s linear',
      }} />

      {/* ── Film grain overlay — slower, more subtle ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:4, pointerEvents:'none',
        opacity:0.10, mixBlendMode:'overlay',
        backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        animation:'cin-grain 1.8s steps(2) infinite',
      }} />

      {/* ── Vignette — lighter edges ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:3, pointerEvents:'none',
        background:'radial-gradient(ellipse 90% 90% at 50% 40%, transparent 50%, rgba(0,0,0,0.35) 100%)',
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
