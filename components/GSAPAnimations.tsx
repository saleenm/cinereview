'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function GSAPAnimations() {
  const pathname = usePathname()

  useEffect(() => {
    let gsap: any, ScrollTrigger: any, SplitText: any
    let ctx: any

    const init = async () => {
      const gsapMod = await import('gsap')
      const stMod   = await import('gsap/ScrollTrigger')
      gsap        = gsapMod.gsap
      ScrollTrigger = stMod.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {

        /* ── 1. Section headers — slide in from left ── */
        gsap.utils.toArray<HTMLElement>('.gsap-heading').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, x: -40 },
            {
              opacity: 1, x: 0, duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            }
          )
        })

        /* ── 2. Movie card grids — stagger reveal ── */
        gsap.utils.toArray<HTMLElement>('.gsap-grid').forEach((grid) => {
          const cards = grid.querySelectorAll<HTMLElement>('.gsap-card')
          if (!cards.length) return
          gsap.fromTo(cards,
            { opacity: 0, y: 36, scale: 0.94 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.65,
              ease: 'power3.out',
              stagger: 0.06,
              scrollTrigger: {
                trigger: grid,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        })

        /* ── 3. Top-rated list items — slide from right ── */
        gsap.utils.toArray<HTMLElement>('.gsap-list-item').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, x: 60 },
            {
              opacity: 1, x: 0, duration: 0.7,
              ease: 'power3.out',
              delay: i * 0.07,
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          )
        })

        /* ── 4. Stats counters — scale up ── */
        gsap.utils.toArray<HTMLElement>('.gsap-stat').forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, scale: 0.8, y: 20 },
            {
              opacity: 1, scale: 1, y: 0,
              duration: 0.7,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        })

        /* ── 5. Section divider lines — grow from center ── */
        gsap.utils.toArray<HTMLElement>('.cin-section-line').forEach((el) => {
          gsap.fromTo(el,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1, opacity: 1, duration: 1.2,
              ease: 'power2.out',
              transformOrigin: 'left center',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          )
        })

        /* ── 6. Genre cards — fan-in ── */
        gsap.utils.toArray<HTMLElement>('.gsap-genre-grid').forEach((grid) => {
          const cards = grid.querySelectorAll<HTMLElement>('a')
          gsap.fromTo(cards,
            { opacity: 0, y: 30, rotation: -3 },
            {
              opacity: 1, y: 0, rotation: 0,
              duration: 0.55,
              ease: 'power2.out',
              stagger: 0.04,
              scrollTrigger: {
                trigger: grid,
                start: 'top 87%',
                toggleActions: 'play none none none',
              },
            }
          )
        })

        /* ── 7. Blog cards — slide up with blur ── */
        gsap.utils.toArray<HTMLElement>('.gsap-blog-card').forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 50, filter: 'blur(4px)' },
            {
              opacity: 1, y: 0, filter: 'blur(0px)',
              duration: 0.75,
              ease: 'power3.out',
              delay: i * 0.1,
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          )
        })

        /* ── 8. Hero CTA banner ── */
        const banner = document.querySelector<HTMLElement>('.gsap-cta-banner')
        if (banner) {
          gsap.fromTo(banner,
            { opacity: 0, scale: 0.96, y: 30 },
            {
              opacity: 1, scale: 1, y: 0,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: banner,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

      })
    }

    // Small delay to let DOM render
    const timer = setTimeout(init, 200)

    return () => {
      clearTimeout(timer)
      ctx?.revert()
      ScrollTrigger?.getAll().forEach((t: any) => t.kill())
    }
  }, [pathname])

  return null
}
