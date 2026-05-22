import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://cinereview-ar.vercel.app'),
  robots: { index: true, follow: true },
  keywords: ['movie reviews', 'film ratings', 'cinema', 'تقييمات أفلام', 'سينما', 'مراجعات'],
  openGraph: {
    siteName: 'CineReview',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4272698055490735"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
