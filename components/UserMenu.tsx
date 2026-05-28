'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Props { locale: string }

export default function UserMenu({ locale }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/${locale}/profile` },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setOpen(false)
  }

  if (loading) return null

  if (!user) {
    return (
      <button
        onClick={signInWithGoogle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 transition-colors border border-gray-700"
        title="Sign in"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        <span className="hidden sm:inline">{locale === 'ar' ? 'دخول' : 'Sign in'}</span>
      </button>
    )
  }

  const initials = (user.user_metadata?.full_name || user.email || 'U').charAt(0).toUpperCase()
  const avatar = user.user_metadata?.avatar_url

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full overflow-hidden border-2 border-amber-500/40 hover:border-amber-500 transition-colors"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={initials} className="w-8 h-8 object-cover" />
        ) : (
          <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-gray-950 font-black text-sm">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 end-0 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-2 min-w-48 z-50">
          <div className="px-3 py-2 border-b border-gray-800 mb-1">
            <p className="text-white font-semibold text-sm truncate">
              {user.user_metadata?.full_name || user.email}
            </p>
            <p className="text-gray-500 text-xs truncate">{user.email}</p>
          </div>
          <a
            href={`/${locale}/profile`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-800 text-sm text-gray-300 transition-colors"
          >
            👤 {locale === 'ar' ? 'ملفي الشخصي' : 'My Profile'}
          </a>
          <a
            href={`/${locale}/watchlist`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-800 text-sm text-gray-300 transition-colors"
          >
            ★ {locale === 'ar' ? 'قائمتي' : 'My Watchlist'}
          </a>
          <hr className="border-gray-800 my-1" />
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-900/30 text-sm text-red-400 transition-colors w-full"
          >
            ↩ {locale === 'ar' ? 'تسجيل الخروج' : 'Sign out'}
          </button>
        </div>
      )}
    </div>
  )
}
