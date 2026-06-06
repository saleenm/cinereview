'use client'

import { useState, useEffect } from 'react'

const LABELS: Record<string, Record<string, string>> = {
  subscribe:   { ar: '🔔 فيلم اليوم يومياً', en: '🔔 Daily Film Alert', fr: '🔔 Film du jour', es: '🔔 Alerta diaria', tr: '🔔 Günlük film', de: '🔔 Täglicher Film', ja: '🔔 毎日映画通知', pt: '🔔 Alerta diário' },
  subscribed:  { ar: '✅ مفعّل', en: '✅ Subscribed', fr: '✅ Abonné', es: '✅ Suscrito', tr: '✅ Abone', de: '✅ Abonniert', ja: '✅ 登録済み', pt: '✅ Inscrito' },
  unsupported: { ar: 'المتصفح لا يدعم الإشعارات', en: 'Browser not supported', fr: 'Navigateur non supporté', es: 'Navegador no soportado', tr: 'Tarayıcı desteklenmiyor', de: 'Browser nicht unterstützt', ja: 'ブラウザ非対応', pt: 'Navegador não suportado' },
}

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export default function PushNotificationButton({ locale = 'en' }: { locale?: string }) {
  const [state, setState] = useState<'idle' | 'subscribed' | 'unsupported' | 'loading'>('idle')
  const L = (k: string) => LABELS[k]?.[locale] || LABELS[k]?.en || k

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      setState('unsupported')
      return
    }
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setState('subscribed')
        })
      })
    }
  }, [])

  const subscribe = async () => {
    if (!('Notification' in window) || !VAPID_PUBLIC_KEY) return
    setState('loading')

    const perm = await Notification.requestPermission()
    if (perm !== 'granted') { setState('idle'); return }

    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), locale }),
      })

      reg.showNotification('CineReview 🎬', {
        body: locale === 'ar' ? 'ستصلك إشعارات بأفضل الأفلام يومياً!' : "You'll get daily film recommendations!",
        icon: '/logos/icon-192.png',
      })

      setState('subscribed')
    } catch {
      setState('idle')
    }
  }

  if (state === 'unsupported') return null

  return (
    <button
      onClick={subscribe}
      disabled={state === 'subscribed' || state === 'loading'}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
        state === 'subscribed'
          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
      }`}
    >
      {state === 'loading' ? '...' : state === 'subscribed' ? L('subscribed') : L('subscribe')}
    </button>
  )
}
