'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LOCALE_NAMES } from '@/lib/types'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'
import UserMenu from './UserMenu'

interface Props { locale: string }

// ── Minimal SVG icons ────────────────────────────────────────────
function IconFilm()    { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 4v16M17 4v16M2 9h5m10 0h5M2 15h5m10 0h5"/></svg> }
function IconStar()    { return <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> }
function IconPen()     { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> }
function IconGrid()    { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> }
function IconChevron() { return <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg> }
function IconHome()    { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg> }
function IconMenu()    { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg> }
function IconClose()   { return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg> }
function IconGlobe()   { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg> }

export default function Header({ locale }: Props) {
  const t = useTranslations('nav')
  const ts = useTranslations('site')
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isRTL = locale === 'ar'

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  const isActive = (href: string) =>
    pathname === href || (href !== `/${locale}` && pathname.startsWith(href))

  const primaryNav = [
    { href: `/${locale}`,          label: t('home'),      icon: <IconHome /> },
    { href: `/${locale}/movies`,   label: t('movies'),    icon: <IconFilm /> },
    { href: `/${locale}/top-rated`,label: t('topRated'),  icon: <IconStar /> },
    { href: `/${locale}/blog`,     label: t('blog'),      icon: <IconPen /> },
  ]

  const exploreLinks = [
    { href: `/${locale}/genre/all`,   label: t('genres') },
    { href: `/${locale}/directors`,   label: t('directors') },
    { href: `/${locale}/actors`,      label: t('actors') },
    { href: `/${locale}/compare`,     label: t('compare') },
    { href: `/${locale}/movie-of-day`,label: t('movieOfDay') },
    { href: `/${locale}/map`,         label: t('worldMap') },
    { href: `/${locale}/watchlist`,   label: t('watchlist') },
    { href: `/${locale}/list/create`, label: t('myList') },
  ]

  const allMobileLinks = [...primaryNav.map(l => ({ href: l.href, label: l.label })), ...exploreLinks]

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4zM4 10h4v4H4zM10 10h4v4h-4zM16 10h4v4h-4zM4 16h4v4H4zM10 16h4v4h-4zM16 16h4v4h-4z" opacity="0.4"/>
              <rect x="2" y="2" width="20" height="20" rx="2" stroke="white" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="4" fill="white"/>
            </svg>
          </div>
          <span className="font-black text-white text-lg hidden sm:block gold-text tracking-tight">{ts('name')}</span>
        </Link>

        {/* ── Desktop Primary Nav ── */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNav.map((l) => (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isActive(l.href)
                  ? 'nav-link-active'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/80'
              }`}>
              <span className="opacity-70">{l.icon}</span>
              {l.label}
            </Link>
          ))}

          {/* Explore dropdown */}
          <div className="relative">
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              onBlur={() => setTimeout(() => setExploreOpen(false), 150)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/80 transition-all"
            >
              <span className="opacity-70"><IconGrid /></span>
              {isRTL ? 'استكشف' : 'Explore'}
              <span className={`opacity-60 transition-transform duration-200 ${exploreOpen ? 'rotate-180' : ''}`}>
                <IconChevron />
              </span>
            </button>
            {exploreOpen && (
              <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} w-48 glass-card border border-gray-700/60 rounded-xl shadow-2xl z-50 py-1 overflow-hidden`}>
                {exploreLinks.map((l) => (
                  <Link key={l.href} href={l.href}
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700/60 transition-colors">
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* ── Search ── */}
        <SearchBar locale={locale} />

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-sm text-gray-300 transition-all border border-gray-700/60"
            >
              <IconGlobe />
              <span className="uppercase font-bold text-xs">{locale}</span>
              <span className={`text-gray-500 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}>
                <IconChevron />
              </span>
            </button>
            {langOpen && (
              <div className={`absolute top-full mt-2 ${isRTL ? 'left-0' : 'right-0'} glass-card border border-gray-700/60 rounded-xl overflow-hidden shadow-2xl z-50 min-w-40`}>
                {Object.entries(LOCALE_NAMES).map(([code, name]) => (
                  <button key={code} onClick={() => switchLocale(code)}
                    className={`w-full px-4 py-2.5 text-sm text-start transition-colors flex items-center justify-between
                      ${code === locale ? 'text-amber-400 bg-amber-500/10' : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'}`}>
                    <span>{name}</span>
                    {code === locale && <span className="text-amber-400">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <UserMenu locale={locale} />
          <ThemeToggle />

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-800/80 text-gray-300 border border-gray-700/60 hover:bg-gray-700 transition-colors">
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <div className={`lg:hidden border-t border-gray-800/60 glass-card overflow-hidden transition-all duration-300 ease-out ${
        menuOpen ? 'max-h-[70vh] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="py-2 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {allMobileLinks.map((l, i) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ transitionDelay: menuOpen ? `${i * 25}ms` : '0ms' }}
              className={`flex items-center px-4 py-3 text-sm border-b border-gray-800/30 last:border-0
                transition-all duration-200
                ${isActive(l.href) ? 'text-amber-400 bg-amber-500/5' : 'text-gray-300 hover:text-white hover:bg-gray-800/50'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
