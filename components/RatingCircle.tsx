'use client'

interface Props {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  color?: string
}

const SIZE_MAP = { sm: 56, md: 80, lg: 110 }
const STROKE_MAP = { sm: 4, md: 5, lg: 7 }

export default function RatingCircle({ value, max = 10, size = 'md', label, color }: Props) {
  const px = SIZE_MAP[size]
  const stroke = STROKE_MAP[size]
  const r = (px - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(value / max, 1)
  const offset = circ * (1 - pct)

  const getColor = () => {
    if (color) return color
    if (pct >= 0.85) return '#22c55e'
    if (pct >= 0.70) return '#f59e0b'
    if (pct >= 0.55) return '#f97316'
    return '#ef4444'
  }

  const fontSize = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-lg' : 'text-sm'
  const labelSize = size === 'lg' ? 'text-xs' : 'text-[10px]'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: px, height: px }}>
        <svg width={px} height={px} className="-rotate-90">
          <circle
            cx={px / 2} cy={px / 2} r={r}
            fill="none" stroke="#1f2937"
            strokeWidth={stroke}
          />
          <circle
            cx={px / 2} cy={px / 2} r={r}
            fill="none"
            stroke={getColor()}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fontSize} font-black text-white leading-none`}>{value}</span>
          <span className="text-[9px] text-gray-500">/{max}</span>
        </div>
      </div>
      {label && (
        <span className={`${labelSize} text-gray-400 text-center leading-tight`}>{label}</span>
      )}
    </div>
  )
}
