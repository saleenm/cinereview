import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import NewsletterForm from './NewsletterForm'

interface Props { locale: string }

export default async function Footer({ locale }: Props) {
  const t = await getTranslations('footer')
  const ts = await getTranslations('site')
  const tn = await getTranslations('nav')

  return (
    <footer className="border-t border-gray-800 bg-gray-950 mt-auto">
      {/* Newsletter */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <NewsletterForm locale={locale} />
      </div>
      <div className="border-t border-gray-800/50" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎬</span>
            <div>
              <p className="font-black text-white gold-text">{ts('name')}</p>
              <p className="text-xs text-gray-500">{ts('tagline')}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:text-gray-300 transition-colors">{tn('home')}</Link>
            <Link href={`/${locale}/movies`} className="hover:text-gray-300 transition-colors">{tn('movies')}</Link>
            <Link href={`/${locale}/top-rated`} className="hover:text-gray-300 transition-colors">{tn('topRated')}</Link>
          </div>
          <div className="text-center md:text-end">
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} {ts('name')} · {t('rights')}</p>
            <p className="text-xs text-gray-600 mt-1">{t('disclaimer')}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
