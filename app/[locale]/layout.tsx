import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { Cairo, Cinzel, Noto_Sans_JP } from 'next/font/google'
import { RTL_LOCALES } from '@/lib/types'
import PageTransition from '@/components/PageTransition'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '700', '900'],
})

const notoJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-noto-jp',
  weight: ['400', '500', '700'],
})

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return ['ar', 'en', 'fr', 'es', 'tr', 'de', 'ja', 'pt'].map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  const BASE = 'https://cinereview-mu.vercel.app'
  return {
    title: { default: t('name'), template: `%s | ${t('name')}` },
    description: t('description'),
    openGraph: {
      siteName: 'CineReview',
      images: [{ url: `${BASE}/${locale}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`${BASE}/${locale}/opengraph-image`],
    },
  }
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CineReview',
  url: 'https://cinereview-mu.vercel.app',
  description: 'Movie reviews, ratings, and analysis in 8 languages',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://cinereview-mu.vercel.app/en/search?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  const messages = await getMessages()
  const isRTL = RTL_LOCALES.includes(locale as any)

  return (
    <html
      lang={locale}
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`${cairo.variable} ${cinzel.variable} ${notoJP.variable}`}
    >
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4272698055490735"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-gray-950 text-gray-100 antialiased min-h-screen flex flex-col font-sans">
        {/* Skip to main content — accessibility */}
        <a href="#main-content" className="skip-nav">
          {isRTL ? 'انتقل إلى المحتوى الرئيسي' : 'Skip to main content'}
        </a>
        <NextIntlClientProvider messages={messages}>
          <PageTransition>{children}</PageTransition>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
