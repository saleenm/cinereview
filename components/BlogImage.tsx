'use client'

import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export default function BlogImage({ src, alt, className }: Props) {
  const [broken, setBroken] = useState(false)

  if (broken || !src) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 flex items-center justify-center ${className ?? ''}`}
        aria-label={alt}
      >
        <span className="text-4xl opacity-30">🎬</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`absolute inset-0 w-full h-full object-cover ${className ?? ''}`}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  )
}
