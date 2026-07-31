import { STREAMING_PLATFORMS } from '@/lib/affiliates'

interface Props {
  title: string
  year: number
  locale?: string
}

const LABELS: Record<string, string> = {
  ar: 'أين أشاهد الفيلم؟',
  en: 'Where to Watch',
  fr: 'Où regarder',
  es: 'Dónde ver',
  tr: 'Nerede İzlenir',
  de: 'Wo zu sehen',
  ja: 'どこで見る',
  pt: 'Onde Assistir',
}

const SUBLABELS: Record<string, string> = {
  ar: 'اختر المنصة وابحث عن الفيلم',
  en: 'Choose a platform to find this film',
  fr: 'Choisissez une plateforme',
  es: 'Elige una plataforma',
  tr: 'Bir platform seçin',
  de: 'Wählen Sie eine Plattform',
  ja: 'プラットフォームを選択',
  pt: 'Escolha uma plataforma',
}

const PLATFORM_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  justwatch: { bg: 'hover:bg-yellow-500/8',  border: 'border-yellow-500/20 hover:border-yellow-500/50', text: 'text-yellow-400', dot: '#f5c518' },
  netflix:   { bg: 'hover:bg-red-500/8',     border: 'border-red-500/20 hover:border-red-500/50',       text: 'text-red-400',    dot: '#E50914' },
  prime:     { bg: 'hover:bg-blue-500/8',    border: 'border-blue-500/20 hover:border-blue-500/50',     text: 'text-blue-400',   dot: '#00A8E0' },
  shahid:    { bg: 'hover:bg-purple-500/8',  border: 'border-purple-500/20 hover:border-purple-500/50', text: 'text-purple-400', dot: '#8B2FC9' },
  apple:     { bg: 'hover:bg-gray-500/8',    border: 'border-gray-600/20 hover:border-gray-400/50',     text: 'text-gray-300',   dot: '#888888' },
  disney:    { bg: 'hover:bg-indigo-500/8',  border: 'border-indigo-500/20 hover:border-indigo-500/50', text: 'text-indigo-400', dot: '#113CCF' },
  mubi:      { bg: 'hover:bg-violet-500/8',  border: 'border-violet-500/20 hover:border-violet-500/50', text: 'text-violet-400', dot: '#7B2FBE' },
}

export default function WhereToWatch({ title, year, locale = 'en' }: Props) {
  const label    = LABELS[locale]    || LABELS.en
  const sublabel = SUBLABELS[locale] || SUBLABELS.en
  const isRTL    = locale === 'ar'

  return (
    <div className="bg-gray-900/70 border border-gray-800/50 rounded-2xl p-5" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">📺</span>
        <h3 className="font-black text-white text-sm">{label}</h3>
      </div>
      <p className="text-gray-500 text-xs mb-4 ms-7">{sublabel}</p>

      <div className="grid grid-cols-1 gap-1.5">
        {STREAMING_PLATFORMS.map((p) => {
          const c = PLATFORM_COLORS[p.id] || PLATFORM_COLORS.justwatch
          return (
            <a
              key={p.id}
              href={p.getUrl(title)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 bg-transparent ${c.bg} ${c.border}`}
            >
              {/* Color dot */}
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.dot }} />
              <span className={`font-semibold text-sm ${c.text} flex-1`}>
                {locale === 'ar' && p.name_ar ? p.name_ar : (p.name_en || p.name)}
              </span>
              <span className="text-gray-600 text-xs group-hover:text-gray-400 transition-colors">
                {locale === 'ar' ? p.description_ar : p.description_en}
              </span>
              <svg className="w-3.5 h-3.5 opacity-30 group-hover:opacity-70 flex-shrink-0 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          )
        })}
      </div>

      <p className="text-gray-700 text-[10px] mt-3 text-center">
        {isRTL
          ? 'الروابط خارجية — قد يتطلب بعضها اشتراكاً مدفوعاً'
          : 'External links — some may require a paid subscription'}
      </p>
    </div>
  )
}
