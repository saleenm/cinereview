'use client'

import { useState, useEffect, useTransition } from 'react'

interface Review {
  id: string
  name: string
  locale: string
  rating: number
  comment: string
  created_at: string
  helpful_count: number
}

interface Props {
  movieSlug: string
  movieTitle: string
  locale: string
}

const STAR_LABELS: Record<string, string[]> = {
  ar: ['فظيع', 'سيء', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز', 'رائع', 'استثنائي', 'تحفة', 'كامل'],
  en: ['Terrible', 'Bad', 'Fair', 'Good', 'Very Good', 'Excellent', 'Brilliant', 'Exceptional', 'Masterpiece', 'Perfect'],
  fr: ['Terrible', 'Mauvais', 'Passable', 'Bien', 'Très bien', 'Excellent', 'Brillant', 'Exceptionnel', 'Chef-d\'œuvre', 'Parfait'],
  es: ['Terrible', 'Malo', 'Aceptable', 'Bueno', 'Muy bueno', 'Excelente', 'Brillante', 'Excepcional', 'Obra maestra', 'Perfecto'],
  tr: ['Berbat', 'Kötü', 'Orta', 'İyi', 'Çok İyi', 'Mükemmel', 'Parlak', 'İstisnai', 'Başyapıt', 'Kusursuz'],
  de: ['Schrecklich', 'Schlecht', 'Akzeptabel', 'Gut', 'Sehr gut', 'Ausgezeichnet', 'Brillant', 'Außergewöhnlich', 'Meisterwerk', 'Perfekt'],
  ja: ['最悪', '悪い', '普通', '良い', 'とても良い', '素晴らしい', '輝かしい', '例外的', '傑作', '完璧'],
  pt: ['Terrível', 'Ruim', 'Regular', 'Bom', 'Muito bom', 'Excelente', 'Brilhante', 'Excepcional', 'Obra-prima', 'Perfeito'],
}

const UI: Record<string, Record<string, string>> = {
  ar: { title: 'تقييمات الزوار', writeReview: 'اكتب تقييمك', nameLabel: 'اسمك', commentLabel: 'تعليقك', ratingLabel: 'تقييمك', submitBtn: 'نشر التقييم', submitting: 'جاري النشر...', success: 'شكراً! تم نشر تقييمك', namePh: 'الاسم (اختياري)', commentPh: 'شاركنا رأيك في الفيلم...', ago: 'منذ', noReviews: 'كن أول من يقيّم هذا الفيلم', helpful: 'مفيد', chars: 'حرف', min: 'دقيقة', hours: 'ساعة', days: 'يوم' },
  en: { title: 'Visitor Reviews', writeReview: 'Write a Review', nameLabel: 'Your Name', commentLabel: 'Your Review', ratingLabel: 'Your Rating', submitBtn: 'Post Review', submitting: 'Posting...', success: 'Thank you! Your review has been posted', namePh: 'Name (optional)', commentPh: 'Share your thoughts on this film...', ago: 'ago', noReviews: 'Be the first to review this film', helpful: 'Helpful', chars: 'chars', min: 'min', hours: 'hr', days: 'd' },
  fr: { title: 'Avis des visiteurs', writeReview: 'Écrire un avis', nameLabel: 'Votre nom', commentLabel: 'Votre avis', ratingLabel: 'Votre note', submitBtn: 'Publier', submitting: 'Publication...', success: 'Merci! Votre avis a été publié', namePh: 'Nom (optionnel)', commentPh: 'Partagez votre opinion...', ago: 'il y a', noReviews: 'Soyez le premier à noter ce film', helpful: 'Utile', chars: 'c', min: 'min', hours: 'h', days: 'j' },
  es: { title: 'Reseñas de visitantes', writeReview: 'Escribir una reseña', nameLabel: 'Tu nombre', commentLabel: 'Tu reseña', ratingLabel: 'Tu calificación', submitBtn: 'Publicar', submitting: 'Publicando...', success: '¡Gracias! Tu reseña ha sido publicada', namePh: 'Nombre (opcional)', commentPh: 'Comparte tu opinión...', ago: 'hace', noReviews: 'Sé el primero en reseñar esta película', helpful: 'Útil', chars: 'c', min: 'min', hours: 'h', days: 'd' },
  tr: { title: 'Ziyaretçi Yorumları', writeReview: 'Yorum Yaz', nameLabel: 'Adınız', commentLabel: 'Yorumunuz', ratingLabel: 'Puanınız', submitBtn: 'Yorum Ekle', submitting: 'Ekleniyor...', success: 'Teşekkürler! Yorumunuz yayınlandı', namePh: 'İsim (isteğe bağlı)', commentPh: 'Film hakkında düşüncelerinizi paylaşın...', ago: 'önce', noReviews: 'Bu filmi ilk değerlendiren siz olun', helpful: 'Faydalı', chars: 'k', min: 'dk', hours: 's', days: 'g' },
  de: { title: 'Besucherbewertungen', writeReview: 'Bewertung schreiben', nameLabel: 'Ihr Name', commentLabel: 'Ihre Bewertung', ratingLabel: 'Ihre Bewertung', submitBtn: 'Bewertung abgeben', submitting: 'Wird gesendet...', success: 'Danke! Ihre Bewertung wurde veröffentlicht', namePh: 'Name (optional)', commentPh: 'Teilen Sie Ihre Meinung...', ago: 'vor', noReviews: 'Seien Sie der Erste, der diesen Film bewertet', helpful: 'Hilfreich', chars: 'Z', min: 'Min', hours: 'Std', days: 'T' },
  ja: { title: '訪問者レビュー', writeReview: 'レビューを書く', nameLabel: 'お名前', commentLabel: 'レビュー', ratingLabel: '評価', submitBtn: 'レビューを投稿', submitting: '投稿中...', success: 'ありがとう！レビューが投稿されました', namePh: 'お名前（任意）', commentPh: 'この映画についての感想を共有してください...', ago: '前', noReviews: 'この映画を最初にレビューしてください', helpful: '役立つ', chars: '文字', min: '分', hours: '時間', days: '日' },
  pt: { title: 'Avaliações de visitantes', writeReview: 'Escrever uma avaliação', nameLabel: 'Seu nome', commentLabel: 'Sua avaliação', ratingLabel: 'Sua nota', submitBtn: 'Publicar', submitting: 'Publicando...', success: 'Obrigado! Sua avaliação foi publicada', namePh: 'Nome (opcional)', commentPh: 'Compartilhe sua opinião...', ago: 'atrás', noReviews: 'Seja o primeiro a avaliar este filme', helpful: 'Útil', chars: 'c', min: 'min', hours: 'h', days: 'd' },
}

function timeAgo(dateStr: string, locale: string): string {
  const l = UI[locale] || UI.en
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return locale === 'ar' ? `منذ ${mins} ${l.min}` : `${mins} ${l.min} ${l.ago}`
  if (hours < 24) return locale === 'ar' ? `منذ ${hours} ${l.hours}` : `${hours} ${l.hours} ${l.ago}`
  return locale === 'ar' ? `منذ ${days} ${l.days}` : `${days} ${l.days} ${l.ago}`
}

function RatingColor(r: number) {
  if (r >= 8.5) return 'text-green-400'
  if (r >= 7) return 'text-yellow-400'
  if (r >= 5) return 'text-orange-400'
  return 'text-red-400'
}

export default function ReviewSection({ movieSlug, movieTitle, locale }: Props) {
  const l = UI[locale] || UI.en
  const labels = STAR_LABELS[locale] || STAR_LABELS.en
  const isRTL = locale === 'ar'

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0

  useEffect(() => {
    fetch(`/api/reviews?slug=${movieSlug}`)
      .then((r) => r.json())
      .then((data) => setReviews(data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [movieSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim() || comment.length < 10 || rating === 0) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_slug: movieSlug, name: name || (isRTL ? 'زائر' : 'Guest'), locale, rating, comment }),
      })
      if (!res.ok) throw new Error()
      const newReview = await res.json()
      setReviews((prev) => [newReview, ...prev])
      setStatus('success')
      setComment('')
      setName('')
      setRating(0)
      setShowForm(false)
    } catch {
      setStatus('error')
    }
  }

  const displayRating = hoverRating || rating
  const starLabel = displayRating > 0 ? labels[displayRating - 1] : ''

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white">{l.title}</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-2xl font-black ${RatingColor(avgRating)}`}>{avgRating}</span>
              <span className="text-gray-500 text-sm">/ 10 · {reviews.length} {isRTL ? 'تقييم' : 'reviews'}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-colors"
        >
          + {l.writeReview}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-amber-500/30 rounded-2xl p-6 mb-6">
          {/* Star Rating Picker */}
          <div className="mb-5">
            <label className="text-gray-400 text-sm mb-3 block">{l.ratingLabel}</label>
            <div className="flex items-center gap-1 flex-wrap">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`w-9 h-9 rounded-lg font-bold text-sm transition-all ${
                    n <= displayRating
                      ? 'bg-amber-500 text-gray-950 scale-110'
                      : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                  }`}
                >
                  {n}
                </button>
              ))}
              {starLabel && (
                <span className="ms-2 text-amber-400 text-sm font-semibold">{starLabel}</span>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">{l.nameLabel}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={l.namePh}
                maxLength={50}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 text-sm mb-1 block flex justify-between">
              <span>{l.commentLabel}</span>
              <span className={comment.length < 10 ? 'text-red-400' : 'text-gray-500'}>
                {comment.length} {l.chars}
              </span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={l.commentPh}
              rows={4}
              minLength={10}
              maxLength={1000}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={status === 'submitting' || comment.length < 10 || rating === 0}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-gray-950 font-bold text-sm transition-colors"
            >
              {status === 'submitting' ? l.submitting : l.submitBtn}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
            >
              {isRTL ? 'إلغاء' : 'Cancel'}
            </button>
          </div>

          {status === 'success' && (
            <p className="mt-3 text-green-400 text-sm">✓ {l.success}</p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-red-400 text-sm">{isRTL ? 'حدث خطأ. حاول مجدداً' : 'Error occurred. Please try again.'}</p>
          )}
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-full mb-1" />
              <div className="h-3 bg-gray-800 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl">
          <div className="text-4xl mb-3">⭐</div>
          <p className="text-gray-500">{l.noReviews}</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-amber-400 hover:text-amber-300 text-sm transition-colors"
          >
            + {l.writeReview}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm flex-shrink-0">
                    {(review.name || 'G')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{review.name || (isRTL ? 'زائر' : 'Guest')}</p>
                    <p className="text-gray-600 text-xs">{timeAgo(review.created_at, locale)}</p>
                  </div>
                </div>
                <div className={`text-xl font-black ${RatingColor(review.rating)} flex-shrink-0`}>
                  {review.rating}
                  <span className="text-gray-600 text-xs font-normal">/10</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
