'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LOCALE_NAMES } from '@/lib/types'
import SearchBar from './SearchBar'

interface Props {
  locale: string
}

export default function Header({ locale }: Props) {
  const t = useTranslations('nav')
  const ts = useTranslations('site')
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isRTL = locale === 'ar'

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/movies`, label: t('movies') },
    { href: `/${locale}/top-rated`, label: t('topRated') },
    { href: `/${locale}/genre/all`, label: t('genres') },
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/watchlist`, label: t('watchlist') },
  ]

  return (
    <header className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🎬</span>
          <span className="font-black text-white text-lg hidden sm:block gold-text">{ts('name')}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <SearchBar locale={locale} />

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors border border-gray-700"
            >
              <span>🌐</span>
              <span className="uppercase font-bold text-xs">{locale}</span>
              <span className="text-gray-500">▾</span>
            </button>
            {langOpen && (
              <div className={`absolute top-full mt-1 ${isRTL ? 'left-0' : 'right-0'} bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl z-50 min-w-36`}>
                {Object.entries(LOCALE_NAMES).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => switchLocale(code)}
                    className={`w-full px-4 py-2.5 text-sm text-start hover:bg-gray-700 transition-colors flex items-center justify-between ${code === locale ? 'text-amber-400 bg-gray-700/50' : 'text-gray-300'}`}
                  >
                    <span>{name}</span>
                    {code === locale && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800 text-gray-300"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-b border-gray-800/50"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
