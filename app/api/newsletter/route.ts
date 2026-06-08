import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const WELCOME: Record<string, { subject: string; html: string }> = {
  ar: {
    subject: '🎬 مرحباً بك في سينيريفيو!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#030712;color:#fff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0a0e17,#0f1629);padding:40px 32px;text-align:center;border-bottom:1px solid rgba(245,158,11,0.3)">
          <div style="font-size:48px;margin-bottom:12px">🎬</div>
          <h1 style="color:#f59e0b;font-size:28px;margin:0">سينيريفيو</h1>
          <p style="color:#9ca3af;margin:8px 0 0">اكتشف عوالم السينما</p>
        </div>
        <div style="padding:32px;direction:rtl;text-align:right">
          <h2 style="color:#fff;font-size:22px">مرحباً بك! 🎉</h2>
          <p style="color:#9ca3af;line-height:1.8">شكراً لاشتراكك في نشرة سينيريفيو الأسبوعية. ستصلك كل أسبوع:</p>
          <ul style="color:#9ca3af;line-height:2">
            <li>🏆 أفضل 5 أفلام مختارة بعناية</li>
            <li>📝 تقييمات تحقيقية معمّقة</li>
            <li>🎭 اكتشافات سينمائية من كل العالم</li>
            <li>⭐ فيلم الأسبوع مع تحليل كامل</li>
          </ul>
          <div style="text-align:center;margin:32px 0">
            <a href="https://cinereview-mu.vercel.app/ar" style="background:#f59e0b;color:#000;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px">
              استكشف الأفلام الآن ←
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;text-align:center">1000+ فيلم · 8 لغات · مجاناً 100%</p>
        </div>
        <div style="background:#0a0e17;padding:20px;text-align:center;border-top:1px solid #1f2937">
          <p style="color:#6b7280;font-size:12px;margin:0">cinereview-mu.vercel.app</p>
        </div>
      </div>
    `,
  },
  en: {
    subject: '🎬 Welcome to CineReview!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#030712;color:#fff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0a0e17,#0f1629);padding:40px 32px;text-align:center;border-bottom:1px solid rgba(245,158,11,0.3)">
          <div style="font-size:48px;margin-bottom:12px">🎬</div>
          <h1 style="color:#f59e0b;font-size:28px;margin:0">CineReview</h1>
          <p style="color:#9ca3af;margin:8px 0 0">Discover the World of Cinema</p>
        </div>
        <div style="padding:32px">
          <h2 style="color:#fff;font-size:22px">Welcome! 🎉</h2>
          <p style="color:#9ca3af;line-height:1.8">Thanks for subscribing to the CineReview weekly newsletter. Every week you'll get:</p>
          <ul style="color:#9ca3af;line-height:2">
            <li>🏆 Top 5 hand-picked films</li>
            <li>📝 In-depth investigative reviews</li>
            <li>🎭 Cinema discoveries from around the world</li>
            <li>⭐ Film of the week with full analysis</li>
          </ul>
          <div style="text-align:center;margin:32px 0">
            <a href="https://cinereview-mu.vercel.app/en" style="background:#f59e0b;color:#000;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:16px">
              Explore Movies Now →
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;text-align:center">1000+ Films · 8 Languages · 100% Free</p>
        </div>
        <div style="background:#0a0e17;padding:20px;text-align:center;border-top:1px solid #1f2937">
          <p style="color:#6b7280;font-size:12px;margin:0">cinereview-mu.vercel.app</p>
        </div>
      </div>
    `,
  },
}

export async function POST(req: NextRequest) {
  const { email, locale = 'en' } = await req.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  // Save to Supabase
  await supabase.from('newsletter_subscribers').upsert(
    { email: email.toLowerCase().trim(), locale, subscribed_at: new Date().toISOString() },
    { onConflict: 'email' }
  )

  // Send welcome email
  const template = WELCOME[locale] || WELCOME.en
  await resend.emails.send({
    from: 'CineReview <onboarding@resend.dev>',
    to: email,
    subject: template.subject,
    html: template.html,
  })

  return NextResponse.json({ ok: true })
}
