'use client'

import Image from 'next/image'
import { useState } from 'react'

const FALLBACK = 'https://image.tmdb.org/t/p/original/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'

interface Props {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export default function BlogImage({ src, alt, className, sizes, priority }: Props) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setImgSrc(FALLBACK)}
    />
  )
}
