'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const WATCHLIST_KEY = 'cinereview_watchlist'
const RATINGS_KEY = 'cinereview_ratings'

function getWatchlist(): string[] {
  try { return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '[]') } catch { return [] }
}
function getRatings(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}') } catch { return {} }
}

const LABELS: Record<string, Record<string, string>> = {
  title: { ar: 'ملفي الشخصي', en: 'My Profile', fr: 'Mon Profil', es: 'Mi Perfil', tr: 'Profilim', de: 'Mein Profil', ja: 'マイプロフィール', pt: 'Meu Perfil' },
  watchlist: { ar: 'قائمة المشاهدة', en: 'Watchlist', fr: 'Ma Liste', es: 'Mi Lista', tr: 'İzleme Listesi', de: 'Merkliste', ja: 'ウォッチリスト', pt: 'Lista de Filmes' },
  myRatings: { ar: 'تقييماتي', en: 'My Ratings', fr: 'Mes Notes', es: 'Mis Calificaciones', tr: 'Puanlarım', de: 'Meine Bewertungen', ja: '私の評価', pt: 'Minhas Avaliações' },
  films: { ar: 'فيلم', en: 'films', fr: 'films', es: 'películas', tr: 'film', de: 'Filme', ja: '作品', pt: 'filmes' },
  signInPrompt: { ar: 'سجّل دخولك للحفظ في السحابة', en: 'Sign in to save to cloud', fr: 'Connectez-vous pour sauvegarder', es: 'Inicia sesión para guardar', tr: 'Buluta kaydetmek için giriş yap', de: 'Anmelden zum Speichern', ja: 'クラウドに保存するにはサインイン', pt: 'Entre para salvar na nuvem' },
  noWatchlist: { ar: 'قائمة المشاهدة فارغة', en: 'Watchlist is empty', fr: 'Liste vide', es: 'Lista vacía', tr: 'Liste boş', de: 'Liste leer', ja: 'リストが空です', pt: 'Lista vazia' },
  noRatings: { ar: 'لم تقيّم أي فيلم بعد', en: 'No ratings yet', fr: 'Aucune note', es: 'Sin calificaciones', tr: 'Henüz puan yok', de: 'Keine Bewertungen', ja: '評価なし', pt: 'Sem avaliações' },
}

export default function ProfilePage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const [user, setUser] = useState<User | null>(null)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const supabase = createClient()

  const L = (key: string) => LABELS[key]?.[locale] || LABELS[key]?.en || key

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    setWatchlist(getWatchlist())
    setRatings(getRatings())
  }, [])

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/${locale}/profile` },
    })
  }

  const avatar = user?.user_metadata?.avatar_url
  const name = user?.user_metadata?.full_name || user?.email

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* User card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 flex items-center gap-5">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name || ''} className="w-20 h-20 rounded-full border-2 border-amber-500/40" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/30 flex items-center justify-center text-3xl">
              👤
            </div>
          )}
          <div className="flex-1">
            {user ? (
              <>
                <h1 className="text-2xl font-black text-white">{name}</h1>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="flex gap-4 mt-3 text-sm text-gray-400">
                  <span>★ {watchlist.length} {L('films')}</span>
                  <span>⭐ {Object.keys(ratings).length} {L('films')}</span>
                </div>
              </>
            ) : (
              <div>
                <h1 className="text-xl font-black text-white mb-2">{L('title')}</h1>
                <p className="text-gray-500 text-sm mb-4">{L('signInPrompt')}</p>
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-950 font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Google
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Watchlist */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="font-black text-white mb-4 flex items-center gap-2">
              ★ {L('watchlist')}
              <span className="text-amber-400 text-sm font-normal">({watchlist.length})</span>
            </h2>
            {watchlist.length === 0 ? (
              <p className="text-gray-500 text-sm">{L('noWatchlist')}</p>
            ) : (
              <div className="space-y-2">
                {watchlist.slice(0, 8).map((slug) => (
                  <Link key={slug} href={`/${locale}/movies/${slug}`}
                    className="block px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 hover:text-white transition-colors truncate">
                    🎬 {slug.replace(/-/g, ' ')}
                  </Link>
                ))}
                {watchlist.length > 8 && (
                  <Link href={`/${locale}/watchlist`} className="text-amber-400 text-xs hover:underline">
                    +{watchlist.length - 8} more...
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Ratings */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h2 className="font-black text-white mb-4 flex items-center gap-2">
              ⭐ {L('myRatings')}
              <span className="text-amber-400 text-sm font-normal">({Object.keys(ratings).length})</span>
            </h2>
            {Object.keys(ratings).length === 0 ? (
              <p className="text-gray-500 text-sm">{L('noRatings')}</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(ratings).slice(0, 8).map(([slug, r]) => (
                  <Link key={slug} href={`/${locale}/movies/${slug}`}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm transition-colors">
                    <span className="text-gray-300 truncate">{slug.replace(/-/g, ' ')}</span>
                    <span className="text-amber-400 font-bold flex-shrink-0">{'★'.repeat(r)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
