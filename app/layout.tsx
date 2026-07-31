import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://cinereview-mu.vercel.app'),
  robots: { index: true, follow: true },
  keywords: ['movie reviews', 'film ratings', 'cinema', 'تقييمات أفلام', 'سينما', 'مراجعات'],
  openGraph: {
    siteName: 'CineReview',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  other: {
    'impact-site-verification': '7ccaeef5-42ae-4b3e-a23c-20dce7667066',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4272698055490735"
          crossOrigin="anonymous"
        />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))` }} />
        <meta name="impact-site-verification" content="c785a95c-8a0f-4576-bd05-922532bfd08e" />
      </head>
      <body>{children}</body>
    </html>
  )
}
