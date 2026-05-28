interface Props {
  title: string
  year: number
  locale?: string
}

// UTM source for affiliate tracking
const UTM = 'utm_source=cinereview&utm_medium=affiliate&utm_campaign=where-to-watch'

const PLATFORMS = [
  {
    name: 'JustWatch',
    icon: '🔍',
    color: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/60 text-yellow-400',
    // JustWatch affiliate tag can be added via their partner program
    getUrl: (title: string) =>
      `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}&${UTM}`,
  },
  {
    name: 'Netflix',
    icon: '🔴',
    color: 'bg-red-500/10 border-red-500/30 hover:border-red-500/60 text-red-400',
    getUrl: (title: string) =>
      `https://www.netflix.com/search?q=${encodeURIComponent(title)}&${UTM}`,
  },
  {
    name: 'Prime Video',
    icon: '🔵',
    color: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60 text-blue-400',
    // Amazon Associates tag: cinereview-20
    getUrl: (title: string) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(title)}+film&i=instant-video&tag=cinereview-20&${UTM}`,
  },
  {
    name: 'Apple TV+',
    icon: '⬜',
    color: 'bg-gray-500/10 border-gray-500/30 hover:border-gray-400/60 text-gray-300',
    getUrl: (title: string) =>
      `https://tv.apple.com/search/${encodeURIComponent(title)}?${UTM}`,
  },
  {
    name: 'Disney+',
    icon: '🔷',
    color: 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500/60 text-indigo-400',
    getUrl: (title: string) =>
      `https://www.disneyplus.com/search/${encodeURIComponent(title)}?${UTM}`,
  },
  {
    name: 'MUBI',
    icon: '🎞️',
    color: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/60 text-purple-400',
    // MUBI affiliate via Impact Radius
    getUrl: (title: string) =>
      `https://mubi.com/films?q=${encodeURIComponent(title)}&${UTM}`,
  },
]

const LABELS: Record<string, string> = {
  ar: 'أين أشاهد؟',
  en: 'Where to Watch',
  fr: 'Où regarder',
  es: 'Dónde ver',
  tr: 'Nerede İzlenir',
  de: 'Wo zu sehen',
  ja: 'どこで見る',
  pt: 'Onde Assistir',
}

export default function WhereToWatch({ title, year, locale = 'en' }: Props) {
  const label = LABELS[locale] || LABELS.en

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide text-gray-400">
        📺 {label}
      </h3>
      <div className="grid grid-cols-1 gap-2">
        {PLATFORMS.map((p) => (
          <a
            key={p.name}
            href={p.getUrl(title)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 ${p.color}`}
          >
            <span className="text-base leading-none">{p.icon}</span>
            <span className="font-semibold text-sm">{p.name}</span>
            <svg className="ms-auto w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        ))}
      </div>
      <p className="text-gray-600 text-xs mt-3 text-center">
        {locale === 'ar' ? 'روابط خارجية — قد تتطلب اشتراكاً' : 'External links — subscription may be required'}
      </p>
    </div>
  )
}
