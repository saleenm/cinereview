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
    title: isAr ? 'من نحن | سينيريفيو' : 'About Us | CineReview',
    description: isAr
      ? 'تعرف على سينيريفيو — المنصة الرائدة لتقييمات الأفلام بـ 8 لغات'
      : 'Learn about CineReview — the leading platform for movie reviews in 8 languages',
    alternates: { canonical: `https://cinereview-mu.vercel.app/${locale}/about` },
  }
}

const content: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
  ar: {
    title: 'من نحن',
    sections: [
      {
        h: 'مرحباً بك في سينيريفيو',
        p: 'سينيريفيو هي منصة تقييمات سينمائية متخصصة تقدم مراجعات احترافية ومعمّقة لأكثر من 720 فيلماً من أعظم الأفلام في تاريخ السينما، وذلك بـ 8 لغات: العربية، الإنجليزية، الفرنسية، الإسبانية، التركية، الألمانية، اليابانية والبرتغالية.',
      },
      {
        h: 'مهمتنا',
        p: 'نهدف إلى تقديم تجربة سينمائية ثرية لمحبي الأفلام حول العالم من خلال تقييمات دقيقة تشمل القصة والتمثيل والإخراج والتصوير والموسيقى. نؤمن أن كل فيلم عظيم يستحق أن يُكتشف ويُقدَّر من جماهير أوسع.',
      },
      {
        h: 'ما نقدمه',
        p: 'يحتوي موقعنا على أكثر من 720 فيلم مع تقييمات تفصيلية، صفحات مخصصة للمخرجين والممثلين، مقالات أسبوعية في المدونة، قائمة المشاهدة الشخصية، وميزة مقارنة الأفلام. تُضاف أفلام جديدة يومياً تلقائياً.',
      },
      {
        h: 'تواصل معنا',
        p: 'لأي استفسارات أو اقتراحات، يمكنك التواصل معنا عبر البريد الإلكتروني: contact@cinereview-mu.vercel.app',
      },
    ],
  },
  en: {
    title: 'About Us',
    sections: [
      {
        h: 'Welcome to CineReview',
        p: 'CineReview is a specialized film review platform offering professional, in-depth reviews of over 720 of the greatest films in cinema history, available in 8 languages: Arabic, English, French, Spanish, Turkish, German, Japanese, and Portuguese.',
      },
      {
        h: 'Our Mission',
        p: 'We aim to provide a rich cinematic experience for film lovers worldwide through precise ratings covering story, acting, direction, cinematography, and music. We believe every great film deserves to be discovered and appreciated by wider audiences.',
      },
      {
        h: 'What We Offer',
        p: 'Our platform features 720+ films with detailed ratings, dedicated pages for directors and actors, weekly blog articles, personal watchlists, and a film comparison feature. New films are added automatically every day.',
      },
      {
        h: 'Contact Us',
        p: 'For any inquiries or suggestions, feel free to reach us at: contact@cinereview-mu.vercel.app',
      },
    ],
  },
}

function getContent(locale: string) {
  return content[locale] ?? content.en
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const c = getContent(locale)
  const isRTL = locale === 'ar'

  return (
    <>
      <Header locale={locale} />
      <main className="flex-1 bg-gray-950">
        <section className="bg-gray-950 border-b border-gray-800 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{c.title}</h1>
            <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mt-3">
              <span>🎬</span>
              <span>CineReview</span>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            {c.sections.map((s, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-xl font-black text-amber-400 mb-3">{s.h}</h2>
                <p className="text-gray-300 leading-relaxed">{s.p}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Link href={`/${locale}`}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-sm transition-colors">
              {isRTL ? 'الرئيسية' : 'Home'}
            </Link>
            <Link href={`/${locale}/privacy`}
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-sm border border-gray-700 transition-colors">
              {isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
