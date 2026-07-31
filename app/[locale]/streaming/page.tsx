import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VPNBanner from '@/components/VPNBanner'
import AdUnit from '@/components/AdUnit'
import { STREAMING_PLATFORMS, VPN_OFFERS } from '@/lib/affiliates'
import { LOCALES } from '@/lib/types'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

const META: Record<string, { title: string; description: string }> = {
  ar: { title: 'شاهد الأفلام — المنصات والخدمات', description: 'دليل شامل لمنصات مشاهدة الأفلام — Netflix وAmazon Prime وشاهد وأكثر' },
  en: { title: 'Watch Movies — Streaming Platforms', description: 'Complete guide to movie streaming platforms — Netflix, Amazon Prime, Shahid and more' },
  fr: { title: 'Regarder — Plateformes de streaming', description: 'Guide complet des plateformes de streaming' },
  es: { title: 'Ver películas — Plataformas de streaming', description: 'Guía completa de plataformas de streaming' },
  tr: { title: 'Film İzle — Yayın Platformları', description: 'Yayın platformlarına kapsamlı rehber' },
  de: { title: 'Filme schauen — Streaming-Plattformen', description: 'Vollständiger Leitfaden zu Streaming-Plattformen' },
  ja: { title: '映画を見る — ストリーミングプラットフォーム', description: 'ストリーミングプラットフォームの完全ガイド' },
  pt: { title: 'Assistir — Plataformas de streaming', description: 'Guia completo para plataformas de streaming' },
}

const UI: Record<string, Record<string, string>> = {
  ar: {
    hero: '📺 شاهد الأفلام من أي مكان',
    heroSub: 'دليلك الكامل لمنصات البث — اختر المنصة المناسبة لك',
    platforms: 'منصات البث',
    platformsSub: 'اضغط على أي منصة للبحث فيها',
    vpnSection: '🔒 هل تواجه محتوى محجوب؟',
    vpnSub: 'VPN يفتح كل المنصات من أي مكان في العالم',
    free: 'مجاني جزئياً',
    paid: 'مدفوع',
    arabic: 'عربي',
    back: '← العودة للرئيسية',
  },
  en: {
    hero: '📺 Watch Movies From Anywhere',
    heroSub: 'Your complete guide to streaming platforms — find the right one for you',
    platforms: 'Streaming Platforms',
    platformsSub: 'Click any platform to search for films',
    vpnSection: '🔒 Facing Geo-blocked Content?',
    vpnSub: 'A VPN unlocks all platforms from anywhere in the world',
    free: 'Partially Free',
    paid: 'Paid',
    arabic: 'Arabic',
    back: '← Back to Home',
  },
  fr: { hero: '📺 Regarder de partout', heroSub: 'Guide complet des plateformes', platforms: 'Plateformes de streaming', platformsSub: 'Cliquez pour rechercher', vpnSection: '🔒 Contenu bloqué ?', vpnSub: 'Un VPN débloque tout', free: 'Partiellement gratuit', paid: 'Payant', arabic: 'Arabe', back: '← Retour' },
  es: { hero: '📺 Ver desde cualquier lugar', heroSub: 'Guía completa de plataformas', platforms: 'Plataformas de streaming', platformsSub: 'Haz clic para buscar', vpnSection: '🔒 ¿Contenido bloqueado?', vpnSub: 'VPN desbloquea todo', free: 'Parcialmente gratis', paid: 'De pago', arabic: 'Árabe', back: '← Volver' },
  tr: { hero: '📺 Her Yerden İzle', heroSub: 'Yayın platformlarına rehber', platforms: 'Yayın Platformları', platformsSub: 'Arama için tıklayın', vpnSection: '🔒 İçerik Engellendi mi?', vpnSub: 'VPN her şeyi açar', free: 'Kısmen ücretsiz', paid: 'Ücretli', arabic: 'Arapça', back: '← Geri' },
  de: { hero: '📺 Von überall schauen', heroSub: 'Vollständiger Plattform-Leitfaden', platforms: 'Streaming-Plattformen', platformsSub: 'Klicken zum Suchen', vpnSection: '🔒 Geo-blockierte Inhalte?', vpnSub: 'VPN entsperrt alles', free: 'Teilweise kostenlos', paid: 'Kostenpflichtig', arabic: 'Arabisch', back: '← Zurück' },
  ja: { hero: '📺 どこからでも視聴', heroSub: 'ストリーミングプラットフォームガイド', platforms: 'ストリーミングサービス', platformsSub: '検索するにはクリック', vpnSection: '🔒 地域制限コンテンツ？', vpnSub: 'VPNで全てを解除', free: '部分的無料', paid: '有料', arabic: 'アラビア語', back: '← 戻る' },
  pt: { hero: '📺 Assista de qualquer lugar', heroSub: 'Guia completo de plataformas', platforms: 'Plataformas de streaming', platformsSub: 'Clique para pesquisar', vpnSection: '🔒 Conteúdo bloqueado?', vpnSub: 'VPN desbloqueia tudo', free: 'Parcialmente grátis', paid: 'Pago', arabic: 'Árabe', back: '← Voltar' },
}

const PLATFORM_EXTRAS: Record<string, { badge?: string; type: string; highlight?: boolean }> = {
  justwatch: { type: 'free', badge: '🔍 أداة بحث', highlight: false },
  netflix:   { type: 'paid', highlight: true },
  prime:     { type: 'paid', highlight: true },
  shahid:    { type: 'paid', badge: '🌟 عربي', highlight: true },
  apple:     { type: 'paid' },
  disney:    { type: 'paid' },
  mubi:      { type: 'paid', badge: '🎬 فن' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale] || META.en
  return {
    title: m.title,
    description: m.description,
    alternates: { canonical: `https://cinereview-mu.vercel.app/${locale}/streaming` },
  }
}

export default async function StreamingPage({ params }: Props) {
  const { locale } = await params
  const ui = UI[locale] || UI.en
  const isRTL = locale === 'ar'

  return (
    <>
      <Header locale={locale} />
      <main id="main-content" className="min-h-screen pt-24 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-4 mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-cinzel,Cinzel,serif)' }}>
            {ui.hero}
          </h1>
          <p className="text-gray-400 text-lg mb-6">{ui.heroSub}</p>
          <Link href={`/${locale}`} className="text-amber-400 hover:text-amber-300 text-sm transition-colors">
            {ui.back}
          </Link>
        </section>

        {/* ── Streaming Platforms ── */}
        <section className="max-w-5xl mx-auto px-4 mb-14">
          <h2 className="text-2xl font-black text-white mb-2">{ui.platforms}</h2>
          <p className="text-gray-500 text-sm mb-8">{ui.platformsSub}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STREAMING_PLATFORMS.map((p) => {
              const extra = PLATFORM_EXTRAS[p.id] || { type: 'paid' }
              return (
                <a
                  key={p.id}
                  href={p.getUrl('movies')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                    extra.highlight
                      ? 'border-amber-500/20 bg-gray-900/80 hover:border-amber-500/40'
                      : 'border-gray-800/50 bg-gray-900/40 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <div>
                        <h3 className="font-black text-white text-base">
                          {locale === 'ar' && p.name_ar ? p.name_ar : (p.name_en || p.name)}
                        </h3>
                        <p className="text-gray-500 text-xs">
                          {locale === 'ar' ? p.description_ar : p.description_en}
                        </p>
                      </div>
                    </div>
                    {extra.badge && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold flex-shrink-0">
                        {extra.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${
                      extra.type === 'free'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-gray-800 text-gray-400'
                    }`}>
                      {extra.type === 'free' ? ui.free : ui.paid}
                    </span>
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-amber-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </div>
                </a>
              )
            })}
          </div>
        </section>

        {/* ── Ad ── */}
        <div className="max-w-4xl mx-auto px-4 mb-14">
          <AdUnit slot="5678901234" format="horizontal" className="rounded-xl overflow-hidden" />
        </div>

        {/* ── VPN Section ── */}
        <section className="max-w-4xl mx-auto px-4 mb-14">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-black text-white mb-2">{ui.vpnSection}</h2>
            <p className="text-gray-400">{ui.vpnSub}</p>
          </div>
          <VPNBanner locale={locale} variant="banner" />

          {/* VPN comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {VPN_OFFERS.map((v) => (
              <a
                key={v.id}
                href={v.getUrl()}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group block rounded-2xl border p-6 transition-all hover:scale-[1.02]"
                style={{ borderColor: `${v.color}30`, background: `${v.color}08` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-white text-xl">{v.name}</h3>
                  <span className="font-black text-2xl" style={{ color: v.color }}>{v.discount}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  {locale === 'ar' ? v.tagline_ar : v.tagline_en}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: v.color }}>
                    {locale === 'ar' ? v.price_ar : v.price_en}
                  </span>
                  <span className="text-sm font-bold text-white px-4 py-2 rounded-xl transition-all group-hover:scale-105"
                    style={{ background: v.color }}>
                    {isRTL ? 'احصل عليه' : 'Get it'} →
                  </span>
                </div>
              </a>
            ))}
          </div>
          <p className="text-gray-600 text-xs text-center mt-4">
            {isRTL
              ? '* روابط شراكة — نحصل على عمولة بدون تكلفة إضافية عليك'
              : '* Affiliate links — we earn a commission at no extra cost to you'}
          </p>
        </section>

      </main>
      <Footer locale={locale} />
    </>
  )
}
