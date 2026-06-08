'use client'

import { useState } from 'react'

interface Props { locale?: string }

const LABELS: Record<string, Record<string, string>> = {
  title: { ar: 'اشترك في النشرة الأسبوعية', en: 'Subscribe to Weekly Newsletter', fr: 'Abonnez-vous à la newsletter', es: 'Suscríbete al boletín', tr: 'Haftalık bültene abone ol', de: 'Newsletter abonnieren', ja: '週刊ニュースレターを購読', pt: 'Assine a newsletter semanal' },
  subtitle: { ar: 'أفضل 5 أفلام كل أسبوع — مباشرة لبريدك', en: 'Top 5 films every week — straight to your inbox', fr: '5 meilleurs films chaque semaine dans votre boîte', es: '5 mejores películas cada semana en tu correo', tr: 'Her hafta en iyi 5 film — doğrudan gelen kutunuza', de: 'Top 5 Filme jede Woche — direkt in Ihr Postfach', ja: '毎週トップ5映画 — 受信トレイへ直接', pt: 'Top 5 filmes toda semana — direto na sua caixa' },
  placeholder: { ar: 'بريدك الإلكتروني', en: 'Your email address', fr: 'Votre email', es: 'Tu correo electrónico', tr: 'E-posta adresiniz', de: 'Ihre E-Mail-Adresse', ja: 'メールアドレス', pt: 'Seu endereço de e-mail' },
  btn: { ar: 'اشترك مجاناً', en: 'Subscribe Free', fr: 'S\'abonner', es: 'Suscribirse', tr: 'Ücretsiz abone ol', de: 'Kostenlos abonnieren', ja: '無料購読', pt: 'Assinar grátis' },
  success: { ar: 'شكراً! ستصلك النشرة قريباً', en: 'Thanks! Newsletter coming soon', fr: 'Merci! Newsletter bientôt', es: '¡Gracias! Newsletter pronto', tr: 'Teşekkürler! Bülten çok yakında', de: 'Danke! Newsletter kommt bald', ja: 'ありがとう！ニュースレターは近日公開', pt: 'Obrigado! Newsletter em breve' },
}

export default function NewsletterForm({ locale = 'en' }: Props) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const L = (k: string) => LABELS[k]?.[locale] || LABELS[k]?.en || k

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
    } catch { /* ignore */ }
    setSent(true)
  }

  return (
    <div className="bg-gradient-to-br from-amber-900/20 via-gray-900 to-gray-900 border border-amber-500/20 rounded-2xl p-6">
      <div className="text-center mb-5">
        <div className="text-3xl mb-2">📧</div>
        <h3 className="font-black text-white text-lg mb-1">{L('title')}</h3>
        <p className="text-gray-400 text-sm">{L('subtitle')}</p>
      </div>
      {sent ? (
        <div className="text-center py-2">
          <div className="text-2xl mb-1">✅</div>
          <p className="text-green-400 font-semibold">{L('success')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={L('placeholder')}
            required
            className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm rounded-xl transition-colors flex-shrink-0"
          >
            {L('btn')}
          </button>
        </form>
      )}
    </div>
  )
}
