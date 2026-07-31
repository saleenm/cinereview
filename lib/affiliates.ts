/**
 * Affiliate configuration — update these IDs after signing up for each program
 *
 * HOW TO SIGN UP:
 * 1. NordVPN:   https://nordvpn.com/affiliates/  → get your affiliate_id
 * 2. Surfshark: https://surfshark.com/affiliates/ → get your aff_id
 * 3. ExpressVPN:https://www.expressvpn.com/affiliates → get your offer_id
 * 4. JustWatch: https://www.justwatch.com/us/partner → apply, then impact.com gives you link
 * 5. MUBI:      https://www.impact.com (search MUBI) → affiliate link
 * 6. Shahid:    https://www.shahid.net/en/advertise → contact them
 */

export const AFFILIATE_IDS = {
  nordvpn:    'YOUR_NORDVPN_ID',      // Replace after signup
  surfshark:  'YOUR_SURFSHARK_ID',    // Replace after signup
  expressvpn: 'YOUR_EXPRESSVPN_ID',  // Replace after signup
  amazon:     'cinereview-20',        // Your existing tag
  justwatch:  '',                      // Add after impact.com approval
}

export const UTM = 'utm_source=cinereview&utm_medium=affiliate'

// VPN Links — highest commission $30-100 per signup
export const VPN_OFFERS = [
  {
    id: 'nordvpn',
    name: 'NordVPN',
    tagline_ar: 'شاهد الأفلام بدون قيود',
    tagline_en: 'Stream Without Limits',
    discount: '73% OFF',
    price_ar: 'من $2.99 / شهر',
    price_en: 'From $2.99/mo',
    color: '#4687FF',
    getUrl: () =>
      AFFILIATE_IDS.nordvpn !== 'YOUR_NORDVPN_ID'
        ? `https://go.nordvpn.net/aff_c?offer_id=15&aff_id=${AFFILIATE_IDS.nordvpn}&${UTM}&utm_campaign=vpn`
        : `https://nordvpn.com/?${UTM}&utm_campaign=vpn`,
  },
  {
    id: 'surfshark',
    name: 'Surfshark',
    tagline_ar: 'بث غير محدود وأمان كامل',
    tagline_en: 'Unlimited Streaming & Privacy',
    discount: '82% OFF',
    price_ar: 'من $1.99 / شهر',
    price_en: 'From $1.99/mo',
    color: '#1FCECB',
    getUrl: () =>
      AFFILIATE_IDS.surfshark !== 'YOUR_SURFSHARK_ID'
        ? `https://surfshark.com/deal?coupon=${AFFILIATE_IDS.surfshark}&${UTM}&utm_campaign=vpn`
        : `https://surfshark.com/?${UTM}&utm_campaign=vpn`,
  },
]

// Streaming platforms
export const STREAMING_PLATFORMS = [
  {
    id: 'justwatch',
    name: 'JustWatch',
    name_ar: 'JustWatch',
    icon: '🔍',
    description_ar: 'اكتشف أين تشاهد الفيلم',
    description_en: 'Find where to stream',
    color: '#f5c518',
    getUrl: (title: string) =>
      `https://www.justwatch.com/us/search?q=${encodeURIComponent(title)}&${UTM}&utm_campaign=where-to-watch`,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    icon: '🔴',
    description_ar: 'ابحث على نتفليكس',
    description_en: 'Search on Netflix',
    color: '#E50914',
    getUrl: (title: string) =>
      `https://www.netflix.com/search?q=${encodeURIComponent(title)}&${UTM}&utm_campaign=streaming`,
  },
  {
    id: 'prime',
    name: 'Prime Video',
    icon: '📦',
    description_ar: 'أمازون برايم فيديو',
    description_en: 'Amazon Prime Video',
    color: '#00A8E0',
    getUrl: (title: string) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video&tag=${AFFILIATE_IDS.amazon}&${UTM}&utm_campaign=streaming`,
  },
  {
    id: 'shahid',
    name: 'شاهد',
    name_en: 'Shahid',
    icon: '📺',
    description_ar: 'المنصة العربية الأولى',
    description_en: 'Top Arabic streaming',
    color: '#8B2FC9',
    getUrl: (title: string) =>
      `https://shahid.mbc.net/ar/search/query/${encodeURIComponent(title)}?${UTM}&utm_campaign=streaming`,
  },
  {
    id: 'apple',
    name: 'Apple TV+',
    icon: '🍎',
    description_ar: 'آبل TV+',
    description_en: 'Apple TV+',
    color: '#555555',
    getUrl: (title: string) =>
      `https://tv.apple.com/search/${encodeURIComponent(title)}?${UTM}&utm_campaign=streaming`,
  },
  {
    id: 'disney',
    name: 'Disney+',
    icon: '✨',
    description_ar: 'ديزني بلاس',
    description_en: 'Disney+',
    color: '#113CCF',
    getUrl: (title: string) =>
      `https://www.disneyplus.com/search/${encodeURIComponent(title)}?${UTM}&utm_campaign=streaming`,
  },
  {
    id: 'mubi',
    name: 'MUBI',
    icon: '🎞️',
    description_ar: 'أفلام مختارة بعناية',
    description_en: 'Curated Art Cinema',
    color: '#7B2FBE',
    getUrl: (title: string) =>
      AFFILIATE_IDS.justwatch
        ? `https://mubi.com/films?q=${encodeURIComponent(title)}&${UTM}&utm_campaign=streaming`
        : `https://mubi.com/films?q=${encodeURIComponent(title)}&${UTM}&utm_campaign=streaming`,
  },
]
