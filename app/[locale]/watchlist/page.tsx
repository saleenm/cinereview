import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WatchlistPageClient from './WatchlistPageClient'

interface Props { params: Promise<{ locale: string }> }

export default async function WatchlistPage({ params }: Props) {
  const { locale } = await params
  return (
    <>
      <Header locale={locale} />
      <WatchlistPageClient locale={locale} />
      <Footer locale={locale} />
    </>
  )
}
