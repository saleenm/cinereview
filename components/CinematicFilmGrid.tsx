'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Movie } from '@/lib/types'

interface Props {
  movies: Movie[]
  locale: string
}

const GENRE_LABELS: Record<string, string> = {
  all: 'الكل', action: 'أكشن', drama: 'دراما',
  thriller: 'إثارة', horror: 'رعب', scifi: 'خيال علمي',
  romance: 'رومانسي', animation: 'أنيمي', documentary: 'وثائقي',
  comedy: 'كوميدي', crime: 'جريمة', fantasy: 'فانتازيا',
}

const FALLBACK_POSTER = 'https://image.tmdb.org/t/p/w500/wwemzKWzjKYJFfCeiB57q3r4Bcm.png'

export default function CinematicFilmGrid({ movies, locale }: Props) {
  const [activeGenre, setActiveGenre] = useState<string>('all')
  const [modalMovie, setModalMovie]   = useState<Movie | null>(null)

  const isRTL      = locale === 'ar'
  const displayed  = movies.slice(0, 5)
  const genres     = ['all', ...Array.from(new Set(movies.flatMap(m => m.genres))).slice(0, 4)]

  const dimmed = (m: Movie) =>
    activeGenre !== 'all' && !m.genres.includes(activeGenre as Movie['genres'][number])

  return (
    <div>
      {/* Genre filter tabs */}
      <div style={{ display:'flex', gap:12, marginBottom:40, flexWrap:'wrap' }}>
        {genres.map(g => (
          <button
            key={g}
            onClick={() => setActiveGenre(g)}
            className="cin-magnetic"
            style={{
              padding:'10px 26px',
              background: activeGenre === g ? 'linear-gradient(135deg,#d4a852,#f5c842)' : 'transparent',
              border: `1px solid ${activeGenre === g ? '#d4a852' : 'rgba(212,168,82,0.2)'}`,
              color: activeGenre === g ? '#000' : 'rgba(232,220,200,0.6)',
              fontFamily:'var(--font-cairo,Cairo,sans-serif)',
              fontSize:'0.8rem', letterSpacing:2,
              cursor:'pointer', transition:'all 0.3s',
              position:'relative', overflow:'hidden',
            }}
          >
            {GENRE_LABELS[g] || g}
          </button>
        ))}
      </div>

      {/* 3-D bento grid */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'2fr 1fr 1fr',
        gridTemplateRows:'auto auto',
        gap:3,
        height:650,
        perspective:1500,
      }} className="cin-grid-responsive">
        {displayed.map((m, idx) => (
          <FilmCard
            key={m.slug}
            movie={m}
            locale={locale}
            isRTL={isRTL}
            first={idx === 0}
            dimmed={dimmed(m)}
            onPlay={() => setModalMovie(m)}
          />
        ))}
      </div>

      {/* Trailer modal */}
      {modalMovie && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModalMovie(null) }}
          style={{
            position:'fixed', inset:0, zIndex:5000,
            background:'rgba(3,3,6,0.88)', backdropFilter:'blur(16px)',
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'20px',
          }}
        >
          <div className="cin-glass-modal" style={{ width:'min(900px,90vw)', borderRadius:16, padding:28 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontFamily:'var(--font-cinzel,Cinzel,serif)', fontSize:'1.2rem', color:'#d4a852', letterSpacing:2 }}>
                {isRTL ? modalMovie.title_ar : modalMovie.title}
              </div>
              <button
                onClick={() => setModalMovie(null)}
                style={{ color:'rgba(212,168,82,0.7)', fontSize:'1.2rem', background:'none', border:'none', cursor:'pointer', padding:'4px 8px', lineHeight:1 }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div style={{
              aspectRatio:'16/9',
              background:'linear-gradient(135deg,#0a0a14,#1a1030,#0a0a14)',
              border:'1px solid rgba(212,168,82,0.2)',
              borderRadius:10,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 60px rgba(212,168,82,0.1)', position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', inset:0, background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 3px)', pointerEvents:'none' }} />
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:'3.5rem', color:'#d4a852', opacity:0.5, marginBottom:12 }}>▶</div>
                <div style={{ fontSize:'0.7rem', letterSpacing:4, color:'rgba(212,168,82,0.4)', textTransform:'uppercase' }}>
                  {isRTL ? 'المقطع الدعائي' : 'Trailer'}
                </div>
              </div>
            </div>
            <div style={{ marginTop:16, display:'flex', gap:16, flexWrap:'wrap', fontSize:'0.8rem', color:'rgba(232,220,200,0.5)' }}>
              <span>★ {modalMovie.rating_overall}/10</span>
              <span>{modalMovie.year}</span>
              <span>{isRTL ? modalMovie.director_ar : modalMovie.director}</span>
              <span>{modalMovie.duration}{isRTL ? 'د' : 'm'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function FilmCard({ movie, locale, isRTL, first, dimmed, onPlay }: {
  movie: Movie; locale: string; isRTL: boolean
  first: boolean; dimmed: boolean; onPlay: () => void
}) {
  const [hovered, setHovered]   = useState(false)
  const [imgSrc,  setImgSrc]    = useState(movie.backdrop_url || movie.poster_url || FALLBACK_POSTER)
  const genre = movie.genres[0] || ''

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top)  / r.height
    e.currentTarget.style.transform = `rotateX(${(0.5-py)*14}deg) rotateY(${(px-0.5)*14}deg) translateZ(10px)`
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'rotateX(0) rotateY(0) translateZ(0)'
    setHovered(false)
  }

  return (
    <Link
      href={`/${locale}/movies/${movie.slug}`}
      data-cursor="play"
      style={{
        position:'relative', overflow:'hidden', background:'#111',
        transformStyle:'preserve-3d',
        transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1), box-shadow 0.5s, opacity 0.4s, filter 0.4s',
        willChange:'transform',
        gridRow: first ? '1 / 3' : undefined,
        opacity:  dimmed ? 0.25 : 1,
        filter:   dimmed ? 'grayscale(0.8)' : 'none',
        boxShadow: hovered ? '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(212,168,82,0.15)' : 'none',
        display:'block', textDecoration:'none',
        cursor: 'pointer',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={e => {
        // Check if play button was clicked
        const target = e.target as HTMLElement
        if (target.closest('.cin-play-btn')) {
          e.preventDefault()
          onPlay()
        }
      }}
    >
      {/* Background image */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
        <Image
          src={imgSrc}
          alt={isRTL ? movie.title_ar : movie.title}
          fill
          className="object-cover"
          sizes="(max-width:900px) 50vw, 33vw"
          onError={() => setImgSrc(FALLBACK_POSTER)}
          unoptimized={imgSrc.includes('wikimedia') || imgSrc.includes('imgur')}
          style={{ transition:'transform 0.7s', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
        />
      </div>

      {/* Gradient overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.3) 50%, transparent 100%)' }} />

      {/* Play button */}
      <div
        className="cin-play-btn"
        style={{
          position:'absolute', top:'50%', left:'50%',
          transform:`translate(-50%,-50%) scale(${hovered ? 1 : 0.8}) translateZ(80px)`,
          width:60, height:60, border:'2px solid rgba(212,168,82,0.7)',
          borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
          opacity: hovered ? 1 : 0, transition:'opacity 0.3s, transform 0.3s',
          backdropFilter:'blur(4px)', background:'rgba(0,0,0,0.3)',
        }}
        onClick={e => { e.preventDefault(); onPlay() }}
      >
        <span style={{ color:'#d4a852', fontSize:'1.2rem', marginRight:-4 }}>▶</span>
      </div>

      {/* Film info */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        padding:first ? 30 : 20,
        transform:`translateY(${hovered ? 0 : 8}px) translateZ(40px)`,
        transition:'transform 0.4s',
      }}>
        <div style={{ fontSize:'0.6rem', letterSpacing:4, color:'#d4a852', textTransform:'uppercase', marginBottom:8 }}>
          {genre} · {movie.year}
        </div>
        <div style={{
          fontFamily:'var(--font-cinzel,Cinzel,serif)',
          fontSize: first ? '2rem' : '1.2rem',
          fontWeight:700, lineHeight:1.2, marginBottom:8, color:'#fff',
        }}>
          {isRTL ? movie.title_ar : movie.title}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:'0.75rem', color:'rgba(255,255,255,0.5)' }}>
          <span style={{ display:'flex', alignItems:'center', gap:4, color:'#d4a852', fontWeight:700 }}>
            ★ {movie.rating_overall}
          </span>
          <span>{movie.duration}{locale === 'ar' ? 'د' : 'm'}</span>
          <span>{isRTL ? movie.director_ar : movie.director}</span>
        </div>
      </div>
    </Link>
  )
}
