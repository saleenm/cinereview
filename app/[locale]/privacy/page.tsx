import { Metadata } from 'next'
import Link from 'next/link'
import { LOCALES } from '@/lib/types'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Props { params: Promise<{ locale: string }> }

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'
  return {
    title: isAr ? 'سياسة الخصوصية | سينيريفيو' : 'Privacy Policy | CineReview',
    description: isAr
      ? 'سياسة الخصوصية لموقع سينيريفيو — كيفية جمع واستخدام البيانات'
      : 'CineReview Privacy Policy — how we collect and use data',
    alternates: { canonical: `https://cinereview-mu.vercel.app/${locale}/privacy` },
  }
}

const LAST_UPDATED = '2026-06-01'

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const isAr = locale === 'ar'

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1 bg-gray-950">
        <section className="bg-gray-950 border-b border-gray-800 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
              {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </h1>
            <p className="text-gray-500 text-sm mt-3">
              {isAr ? `آخر تحديث: ${LAST_UPDATED}` : `Last updated: ${LAST_UPDATED}`}
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">

          {isAr ? (
            <>
              <Section title="مقدمة">
                موقع سينيريفيو (<strong>cinereview-mu.vercel.app</strong>) يهتم بخصوصية زواره. توضح هذه الصفحة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام موقعنا.
              </Section>

              <Section title="المعلومات التي نجمعها">
                <ul className="list-disc ms-5 space-y-1">
                  <li><strong>بيانات الاستخدام:</strong> نجمع معلومات عن كيفية تفاعلك مع الموقع مثل الصفحات التي تزورها والوقت الذي تقضيه فيها.</li>
                  <li><strong>الكوكيز:</strong> نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربة التصفح وتذكر إعداداتك.</li>
                  <li><strong>بيانات المصادقة:</strong> إذا سجّلت دخولك بحساب Google، نجمع اسمك وبريدك الإلكتروني وصورتك الشخصية من Google OAuth.</li>
                </ul>
              </Section>

              <Section title="الإعلانات — Google AdSense">
                يستخدم موقعنا <strong>Google AdSense</strong> لعرض الإعلانات. قد تستخدم Google وشركاؤها ملفات تعريف الارتباط لتخصيص الإعلانات بناءً على زياراتك السابقة لهذا الموقع وغيره. يمكنك تعطيل الإعلانات المخصصة من خلال{' '}
                <a href="https://www.google.com/settings/ads" className="text-amber-400 hover:underline" target="_blank" rel="noopener">إعدادات إعلانات Google</a>.
              </Section>

              <Section title="قائمة المشاهدة والبيانات المحلية">
                يتم حفظ قائمة مشاهدتك محلياً في متصفحك (localStorage) ولا يتم إرسالها إلى خوادمنا إلا إذا قمت بتسجيل الدخول.
              </Section>

              <Section title="الخدمات الخارجية">
                <ul className="list-disc ms-5 space-y-1">
                  <li><strong>Vercel:</strong> استضافة الموقع. قد يجمعون سجلات الوصول.</li>
                  <li><strong>Supabase:</strong> قاعدة بياناتنا لحفظ القوائم المخصصة.</li>
                  <li><strong>TMDB:</strong> مصدر بيانات الأفلام والصور.</li>
                </ul>
              </Section>

              <Section title="حقوقك">
                يحق لك طلب حذف بياناتك الشخصية في أي وقت. تواصل معنا على: <strong>contact@cinereview-mu.vercel.app</strong>
              </Section>

              <Section title="التواصل">
                لأي استفسارات تتعلق بالخصوصية، راسلنا على: <strong>contact@cinereview-mu.vercel.app</strong>
              </Section>
            </>
          ) : (
            <>
              <Section title="Introduction">
                CineReview (<strong>cinereview-mu.vercel.app</strong>) values your privacy. This page explains how we collect, use, and protect your personal information when you use our website.
              </Section>

              <Section title="Information We Collect">
                <ul className="list-disc ms-5 space-y-1">
                  <li><strong>Usage Data:</strong> We collect information about how you interact with our site, such as pages visited and time spent.</li>
                  <li><strong>Cookies:</strong> We use cookies to improve your browsing experience and remember your preferences.</li>
                  <li><strong>Authentication Data:</strong> If you sign in with Google, we collect your name, email, and profile picture via Google OAuth.</li>
                </ul>
              </Section>

              <Section title="Advertising — Google AdSense">
                We use <strong>Google AdSense</strong> to display advertisements. Google and its partners may use cookies to personalize ads based on your visits to this and other websites. You can opt out of personalized advertising through{' '}
                <a href="https://www.google.com/settings/ads" className="text-amber-400 hover:underline" target="_blank" rel="noopener">Google Ad Settings</a>.
              </Section>

              <Section title="Watchlist & Local Storage">
                Your watchlist is stored locally in your browser (localStorage) and is not sent to our servers unless you are signed in.
              </Section>

              <Section title="Third-Party Services">
                <ul className="list-disc ms-5 space-y-1">
                  <li><strong>Vercel:</strong> Our hosting provider — may collect access logs.</li>
                  <li><strong>Supabase:</strong> Our database for custom lists.</li>
                  <li><strong>TMDB:</strong> Source for movie data and images.</li>
                </ul>
              </Section>

              <Section title="Your Rights">
                You may request deletion of your personal data at any time. Contact us at: <strong>contact@cinereview-mu.vercel.app</strong>
              </Section>

              <Section title="Contact">
                For privacy-related inquiries, email us at: <strong>contact@cinereview-mu.vercel.app</strong>
              </Section>
            </>
          )}

          <div className="flex gap-4 pt-4">
            <Link href={`/${locale}`}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-colors">
              {isAr ? 'الرئيسية' : 'Home'}
            </Link>
            <Link href={`/${locale}/about`}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm border border-gray-700 transition-colors">
              {isAr ? 'من نحن' : 'About Us'}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-lg font-black text-amber-400 mb-3">{title}</h2>
      <div className="text-gray-300 leading-relaxed">{children}</div>
    </div>
  )
}
