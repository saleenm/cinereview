'use client'

import dynamic from 'next/dynamic'

const FilmReel3D = dynamic(() => import('./FilmReel3D'), { ssr: false })

export default function FilmReel3DWrapper() {
  return <FilmReel3D />
}
