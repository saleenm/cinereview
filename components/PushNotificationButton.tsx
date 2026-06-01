'use client'

import { useState, useEffect } from 'react'

const LABELS: Record<string, Record<string, string>> = {
  subscribe:   { ar: '🔔 فيلم اليوم يومياً', en: '🔔 Daily Film Alert', fr: '🔔 Film du jour', es: '🔔 Alerta diaria', tr: '🔔 Günlük film', de: '🔔 Täglicher Film', ja: '🔔 毎日映画通知', pt: '🔔 Alerta diário' },
  subscribed:  { ar: '✅ مفعّل', en: '✅ Subscribed', fr: '✅ Abonné', es: '✅ Suscrito', tr: '✅ Abone', de: '✅ Abonniert', ja: '✅ 登録済み', pt: '✅ Inscrito' },
  unsupported: { ar: 'المتصفح لا يدعم الإشعارات', en: 'Browser not supported', fr: 'Navigateur non supporté', es: 'Navegador no soportado', tr: 'Tarayıcı desteklenmiyor', de: 'Browser nicht unterstützt', ja: 'ブラウザ非対応', pt: 'Navegador não suportado' },
}

export default function PushNotificationButton({ locale = 'en' }: { locale?: string }) {
  const [state, setState] = useState<'idle' | 'subscribed' | 'unsupported'>('idle')
  const L = (k: string) => LABELS[k]?.[locale] || LABELS[k]?.en || k

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'granted') setState('subscribed')
  }, [])

  const subscribe = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setState('subscribed')
      // Show welcome notification
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.ready
        reg.showNotification('CineReview 🎬', {
          body: locale === 'ar' ? 'ستصلك إشعارات بأفضل الأفلام يومياً!' : 'You\'ll get daily film recommendations!',
          icon: '/logos/icon-192.png',
        })
      }
    }
  }

  if (state === 'unsupported') return null

  return (
    <button
      onClick={subscribe}
      disabled={state === 'subscribed'}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
        state === 'subscribed'
          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
      }`}
    >
      {state === 'subscribed' ? L('subscribed') : L('subscribe')}
    </button>
  )
}
