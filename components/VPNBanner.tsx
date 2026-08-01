'use client'

import { useState } from 'react'
import { VPN_OFFERS } from '@/lib/affiliates'

const LABELS: Record<string, {
  title: string; subtitle: string; why: string[]
  cta: string; disclaimer: string; badge: string
}> = {
  ar: {
    title: '🔓 شاهد كل فيلم — بدون قيود',
    subtitle: 'بعض الأفلام محجوبة في منطقتك — VPN يحل المشكلة فوراً',
    why: ['✅ Netflix و Prime و Disney+ بلا حجب', '✅ خصوصية كاملة وتشفير عالي', '✅ بث HD بدون تقطيع', '✅ ألغِ الاشتراك في أي وقت'],
    cta: 'احصل على VPN الآن',
    disclaimer: 'رابط شراكة — نحصل على عمولة صغيرة بدون تكلفة إضافية عليك',
    badge: 'موصى به',
  },
  en: {
    title: '🔓 Watch Every Film — No Restrictions',
    subtitle: 'Some films are geo-blocked in your region — VPN solves it instantly',
    why: ['✅ Netflix, Prime & Disney+ anywhere', '✅ Complete privacy & encryption', '✅ HD streaming without buffering', '✅ Cancel anytime'],
    cta: 'Get VPN Now',
    disclaimer: 'Affiliate link — we earn a small commission at no extra cost to you',
    badge: 'Recommended',
  },
  fr: {
    title: '🔓 Regardez chaque film — sans restrictions',
    subtitle: 'Certains films sont bloqués — VPN résout le problème instantanément',
    why: ['✅ Netflix, Prime & Disney+ partout', '✅ Confidentialité totale', '✅ Streaming HD sans interruption', '✅ Annulez à tout moment'],
    cta: 'Obtenir VPN',
    disclaimer: 'Lien affilié — nous touchons une petite commission sans frais supplémentaires',
    badge: 'Recommandé',
  },
  es: {
    title: '🔓 Ve cada película — sin restricciones',
    subtitle: 'Algunas películas están bloqueadas — VPN lo resuelve al instante',
    why: ['✅ Netflix, Prime y Disney+ en cualquier lugar', '✅ Privacidad y cifrado completos', '✅ Streaming HD sin interrupciones', '✅ Cancela cuando quieras'],
    cta: 'Obtener VPN',
    disclaimer: 'Enlace de afiliado — ganamos una pequeña comisión sin costo adicional',
    badge: 'Recomendado',
  },
  tr: {
    title: '🔓 Her Filmi İzleyin — Sınırsız',
    subtitle: 'Bazı filmler bölgenizde engellenmiş — VPN anında çözer',
    why: ['✅ Netflix, Prime & Disney+ her yerde', '✅ Tam gizlilik ve şifreleme', '✅ HD kesintisiz yayın', '✅ İstediğinizde iptal edin'],
    cta: 'VPN Al',
    disclaimer: 'Ortaklık bağlantısı — size ek maliyet olmadan küçük komisyon alırız',
    badge: 'Önerilen',
  },
  de: {
    title: '🔓 Jeden Film sehen — ohne Einschränkungen',
    subtitle: 'Einige Filme sind in Ihrer Region gesperrt — VPN löst es sofort',
    why: ['✅ Netflix, Prime & Disney+ überall', '✅ Vollständige Privatsphäre', '✅ HD-Streaming ohne Unterbrechung', '✅ Jederzeit kündigen'],
    cta: 'VPN holen',
    disclaimer: 'Affiliate-Link — wir verdienen eine kleine Provision ohne Mehrkosten',
    badge: 'Empfohlen',
  },
  ja: {
    title: '🔓 すべての映画を視聴 — 制限なし',
    subtitle: '一部の映画はあなたの地域でブロックされています — VPNで即解決',
    why: ['✅ Netflix、Prime、Disney+がどこでも', '✅ 完全なプライバシーと暗号化', '✅ HDストリーミング', '✅ いつでもキャンセル可能'],
    cta: 'VPNを取得',
    disclaimer: 'アフィリエイトリンク — 追加費用なしで小額の手数料を受け取ります',
    badge: 'おすすめ',
  },
  pt: {
    title: '🔓 Assista a qualquer filme — sem restrições',
    subtitle: 'Alguns filmes estão bloqueados — VPN resolve imediatamente',
    why: ['✅ Netflix, Prime e Disney+ em qualquer lugar', '✅ Privacidade e criptografia completas', '✅ Streaming HD sem interrupções', '✅ Cancele a qualquer momento'],
    cta: 'Obter VPN',
    disclaimer: 'Link de afiliado — recebemos uma pequena comissão sem custo adicional',
    badge: 'Recomendado',
  },
}

interface Props {
  locale?: string
  variant?: 'sidebar' | 'banner' | 'compact'
}

export default function VPNBanner({ locale = 'en', variant = 'sidebar' }: Props) {
  const l = LABELS[locale] || LABELS.en
  const isRTL = locale === 'ar'
  const [active, setActive] = useState(0)
  const offer = VPN_OFFERS[active]

  if (variant === 'compact') {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'}
        className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-indigo-950/30 p-4 text-center">
        <p className="text-white font-bold text-sm mb-1">🔓 {isRTL ? 'شاهد بدون قيود' : 'Stream Without Limits'}</p>
        <p className="text-gray-400 text-xs mb-3">{isRTL ? 'VPN يفتح كل المنصات' : 'VPN unlocks all platforms'}</p>
        <a href={VPN_OFFERS[0].getUrl()} target="_blank" rel="noopener noreferrer sponsored"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${VPN_OFFERS[0].color}, ${VPN_OFFERS[1].color})` }}>
          {l.cta} →
        </a>
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'}
        className="relative overflow-hidden rounded-2xl border border-blue-500/20 p-6"
        style={{ background: 'linear-gradient(135deg, #0a0e17 0%, #0d1930 50%, #080f1a 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #4687FF 0%, transparent 50%), radial-gradient(circle at 80% 50%, #1FCECB 0%, transparent 50%)' }} />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="inline-block bg-blue-500/20 text-blue-400 text-xs font-black px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              🛡️ {isRTL ? 'وصول غير محدود' : 'Unlimited Access'}
            </div>
            <h3 className="text-xl font-black text-white mb-2">{l.title}</h3>
            <p className="text-gray-400 text-sm">{l.subtitle}</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {VPN_OFFERS.map((v, i) => (
              <a key={v.id} href={v.getUrl()} target="_blank" rel="noopener noreferrer sponsored"
                className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 hover:shadow-lg"
                style={{ background: `${v.color}22`, border: `1px solid ${v.color}44` }}>
                <span className="font-black text-lg" style={{ color: v.color }}>{v.discount}</span>
                <span>{v.name}</span>
                <span className="text-xs opacity-60" style={{ color: v.color }}>{isRTL ? v.price_ar : v.price_en}</span>
              </a>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-[10px] mt-4 text-center">{l.disclaimer}</p>
      </div>
    )
  }

  // Sidebar variant (default)
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}
      className="relative overflow-hidden rounded-2xl border border-blue-500/25 p-5"
      style={{ background: 'linear-gradient(160deg, #070d1a 0%, #0d1525 60%, #080e1c 100%)' }}>

      {/* Glow orbs */}
      <div className="absolute -top-6 -start-6 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ background: offer.color }} />
      <div className="absolute -bottom-6 -end-6 w-20 h-20 rounded-full opacity-15 blur-2xl"
        style={{ background: VPN_OFFERS[(active + 1) % VPN_OFFERS.length].color }} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="bg-blue-500/15 text-blue-400 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
            🛡️ VPN
          </span>
          <span className="bg-amber-500/15 text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full">
            {l.badge}
          </span>
        </div>

        <h3 className="text-white font-black text-sm mb-1 leading-snug">{l.title}</h3>
        <p className="text-gray-500 text-xs mb-4">{l.subtitle}</p>

        {/* Why list */}
        <ul className="space-y-1 mb-4">
          {l.why.map((item, i) => (
            <li key={i} className="text-gray-400 text-xs">{item}</li>
          ))}
        </ul>

        {/* VPN selector tabs */}
        <div className="flex gap-2 mb-3">
          {VPN_OFFERS.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActive(i)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={{
                background: active === i ? `${v.color}30` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active === i ? v.color + '60' : 'rgba(255,255,255,0.06)'}`,
                color: active === i ? v.color : '#6b7280',
              }}
            >
              {v.name}
            </button>
          ))}
        </div>

        {/* Offer card */}
        <div className="rounded-xl p-3 mb-3 transition-all"
          style={{ background: `${offer.color}12`, border: `1px solid ${offer.color}30` }}>
          <div className="flex items-center justify-between mb-1">
            <span className="font-black text-white text-sm">{offer.name}</span>
            <span className="font-black text-lg" style={{ color: offer.color }}>{offer.discount}</span>
          </div>
          <p className="text-gray-400 text-xs mb-0.5">{isRTL ? offer.tagline_ar : offer.tagline_en}</p>
          <p className="text-xs font-bold" style={{ color: offer.color }}>{isRTL ? offer.price_ar : offer.price_en}</p>
        </div>

        {/* CTA Button */}
        <a
          href={offer.getUrl()}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-sm text-white transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          style={{
            background: `linear-gradient(135deg, ${offer.color}, ${offer.color}bb)`,
            boxShadow: `0 4px 20px ${offer.color}30`,
          }}
        >
          {l.cta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d={isRTL ? 'M19 12H5M12 5l-7 7 7 7' : 'M5 12h14M12 5l7 7-7 7'}/>
          </svg>
        </a>

        <p className="text-gray-700 text-[9px] mt-2 text-center leading-relaxed">{l.disclaimer}</p>
      </div>
    </div>
  )
}
