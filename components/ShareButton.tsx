'use client'

import { useState } from 'react'

interface Props {
  title: string
  url?: string
  poster?: string
}

export default function ShareButton({ title, url, poster }: Props) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const text = `🎬 ${title} — CineReview`

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: text, url: shareUrl })
        return
      } catch { /* user cancelled */ }
    }
    setOpen(true)
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = [
    {
      label: 'Twitter / X',
      icon: '𝕏',
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-gray-800',
    },
    {
      label: 'Facebook',
      icon: 'f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-900/40',
    },
    {
      label: 'WhatsApp',
      icon: '✉',
      href: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      color: 'hover:bg-green-900/40',
    },
    {
      label: 'Telegram',
      icon: '✈',
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
      color: 'hover:bg-sky-900/40',
    },
  ]

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="flex items-center gap-2 w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm transition-colors border border-gray-700"
      >
        <span className="mx-auto flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share
        </span>
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 start-0 end-0 z-50 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-4 space-y-2 min-w-[200px]">
          <p className="text-gray-400 text-xs mb-3 font-medium uppercase tracking-wide">Share via</p>
          {shareLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm text-white ${s.color}`}
            >
              <span className="w-6 text-center font-bold text-base">{s.icon}</span>
              {s.label}
            </a>
          ))}
          <hr className="border-gray-800" />
          <button
            onClick={copyLink}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-900/30 transition-colors text-sm text-white w-full"
          >
            <span className="w-6 text-center">
              {copied ? '✓' : '🔗'}
            </span>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 end-3 text-gray-600 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
