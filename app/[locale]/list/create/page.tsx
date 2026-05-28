'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createMovieList } from '@/lib/supabase'

interface Movie {
  slug: string; title: string; title_ar: string; year: number
  poster_url: string; rating_overall: number; genres: string[]
}

const LABELS: Record<string, Record<string, string>> = {
  pageTitle:     { ar: 'إنشاء قائمة أفلام', en: 'Create a Film List', fr: 'Créer une liste', es: 'Crear una lista', tr: 'Film Listesi Oluştur', de: 'Filmliste erstellen', ja: 'リストを作成', pt: 'Criar lista' },
  namePlaceholder: { ar: 'اسم القائمة (مثال: أفلامي المفضلة)', en: 'List name (e.g. My Top Picks)', fr: 'Nom de la liste', es: 'Nombre de la lista', tr: 'Liste adı', de: 'Listenname', ja: 'リスト名', pt: 'Nome da lista' },
  descPlaceholder: { ar: 'وصف اختياري...', en: 'Optional description...', fr: 'Description optionnelle...', es: 'Descripción opcional...', tr: 'Açıklama (isteğe bağlı)...', de: 'Optionale Beschreibung...', ja: '説明（任意）...', pt: 'Descrição opcional...' },
  searchPlaceholder: { ar: 'ابحث عن فيلم للإضافة...', en: 'Search a film to add...', fr: 'Rechercher un film...', es: 'Buscar película...', tr: 'Film ara...', de: 'Film suchen...', ja: '映画を検索...', pt: 'Pesquisar filme...' },
  createBtn:     { ar: 'إنشاء القائمة', en: 'Create List', fr: 'Créer la liste', es: 'Crear lista', tr: 'Listeyi oluştur', de: 'Liste erstellen', ja: 'リストを作成', pt: 'Criar lista' },
  shareMsg:      { ar: 'القائمة جاهزة! شارك الرابط:', en: 'List created! Share this link:', fr: 'Liste créée ! Partagez ce lien :', es: '¡Lista creada! Comparte este enlace:', tr: 'Liste oluşturuldu! Bu bağlantıyı paylaşın:', de: 'Liste erstellt! Diesen Link teilen:', ja: 'リスト作成完了！このリンクをシェア：', pt: 'Lista criada! Compartilhe este link:' },
  copied:        { ar: 'تم النسخ!', en: 'Copied!', fr: 'Copié !', es: '¡Copiado!', tr: 'Kopyalandı!', de: 'Kopiert!', ja: 'コピー完了！', pt: 'Copiado!' },
  minMovies:     { ar: 'أضف فيلمين على الأقل', en: 'Add at least 2 films', fr: 'Ajoutez au moins 2 films', es: 'Agrega al menos 2 películas', tr: 'En az 2 film ekleyin', de: 'Mindestens 2 Filme hinzufügen', ja: '最低2本追加してください', pt: 'Adicione pelo menos 2 filmes' },
  needName:      { ar: 'أدخل اسماً للقائمة', en: 'Enter a list name', fr: 'Entrez un nom', es: 'Ingresa un nombre', tr: 'Bir ad girin', de: 'Name eingeben', ja: 'リスト名を入力', pt: 'Digite um nome' },
  remove:        { ar: 'إزالة', en: 'Remove', fr: 'Supprimer', es: 'Eliminar', tr: 'Kaldır', de: 'Entfernen', ja: '削除', pt: 'Remover' },
}

export default function CreateListPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'en'
  const router = useRouter()

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [selected, setSelected] = useState<Movie[]>([])
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const L = (k: string) => LABELS[k]?.[locale] || LABELS[k]?.en || k

  useEffect(() => {
    if (q.length < 2) { setResults([]); return }
    fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}`)
      .then(r => r.json())
      .then(d => setResults((d.results || []).slice(0, 6).filter((m: Movie) => !selected.find(s => s.slug === m.slug))))
      .catch(() => setResults([]))
  }, [q, selected])

  const addMovie = (m: Movie) => {
    setSelected(prev => prev.find(s => s.slug === m.slug) ? prev : [...prev, m])
    setQ('')
    setResults([])
  }

  const removeMovie = (slug: string) => setSelected(prev => prev.filter(m => m.slug !== slug))

  const handleCreate = async () => {
    if (!name.trim()) { setError(L('needName')); return }
    if (selected.length < 2) { setError(L('minMovies')); return }
    setError('')
    setLoading(true)
    const { id, error: err } = await createMovieList({
      name: name.trim(),
      description: desc.trim(),
      slugs: selected.map(m => m.slug),
      locale,
    })
    setLoading(false)
    if (err || !id) { setError(err || 'Error'); return }
    const url = `${window.location.origin}/${locale}/list/${id}`
    setShareUrl(url)
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <>
      <Header locale={locale} />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black text-white mb-2">📋 {L('pageTitle')}</h1>
        <p className="text-gray-500 mb-8">{locale === 'ar' ? 'أنشئ قائمة أفلام وشاركها مع أصدقائك' : 'Build a film list and share it with friends'}</p>

        {shareUrl ? (
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-white font-bold text-lg mb-4">{L('shareMsg')}</p>
            <div className="flex gap-2 items-center bg-gray-800 rounded-xl px-4 py-3 mb-4">
              <span className="text-amber-400 text-sm flex-1 truncate">{shareUrl}</span>
              <button onClick={copyUrl} className="px-3 py-1.5 bg-amber-500 text-gray-950 font-bold text-xs rounded-lg hover:bg-amber-400 transition-colors flex-shrink-0">
                {copied ? L('copied') : '📋'}
              </button>
            </div>
            <Link href={shareUrl.replace(window.location.origin, '')} className="text-amber-400 hover:underline text-sm">
              {locale === 'ar' ? 'عرض القائمة' : 'View List'} →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Name + Description */}
            <div className="space-y-3">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={L('namePlaceholder')}
                maxLength={80}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder={L('descPlaceholder')}
                rows={2}
                maxLength={300}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
              />
            </div>

            {/* Search */}
            <div className="relative">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder={L('searchPlaceholder')}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              {results.length > 0 && (
                <div className="absolute top-full mt-1 start-0 end-0 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-xl z-50">
                  {results.map(m => (
                    <button key={m.slug} onClick={() => addMovie(m)}
                      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-gray-800 transition-colors text-sm text-start">
                      <Image src={m.poster_url || '/placeholder.jpg'} alt={m.title} width={28} height={40} className="rounded object-cover flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">{locale === 'ar' ? m.title_ar : m.title}</p>
                        <p className="text-gray-500 text-xs">{m.year} · ★ {m.rating_overall}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected films */}
            {selected.length > 0 && (
              <div className="space-y-2">
                <p className="text-gray-500 text-xs">{selected.length} {locale === 'ar' ? 'فيلم مضاف' : 'films added'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selected.map((m, i) => (
                    <div key={m.slug} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
                      <span className="text-gray-600 text-xs w-5 text-center font-mono">{i + 1}</span>
                      <Image src={m.poster_url || '/placeholder.jpg'} alt={m.title} width={24} height={34} className="rounded object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{locale === 'ar' ? m.title_ar : m.title}</p>
                        <p className="text-gray-500 text-xs">{m.year}</p>
                      </div>
                      <button onClick={() => removeMovie(m.slug)} className="text-gray-600 hover:text-red-400 transition-colors text-xs">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-gray-950 font-black rounded-xl transition-colors"
            >
              {loading ? '...' : `✨ ${L('createBtn')}`}
            </button>
          </div>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
