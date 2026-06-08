import { ImageResponse } from 'next/og'
import { getMovies } from '@/lib/movies'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export async function GET() {
  const top = getMovies({ sort: 'rating', limit: 3 })

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #030712 0%, #0a0e17 50%, #0f1629 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background movie posters */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', opacity: 0.15 }}>
          {top.map((m, i) => (
            <img
              key={i}
              src={m.backdrop_url || m.poster_url}
              style={{ flex: 1, objectFit: 'cover', objectPosition: 'center' }}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(3,7,18,0.3) 0%, rgba(3,7,18,0.8) 60%, rgba(3,7,18,0.95) 100%)',
          display: 'flex',
        }} />

        {/* Amber top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
          display: 'flex',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {/* Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
            borderRadius: '999px', padding: '6px 20px',
            color: '#f59e0b', fontSize: '18px', fontWeight: 600,
          }}>
            🎬 Professional Investigative Reviews
          </div>

          {/* Title */}
          <div style={{
            fontSize: '80px', fontWeight: 900, color: '#ffffff',
            textAlign: 'center', lineHeight: 1.1,
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}>
            CineReview
          </div>

          {/* Subtitle */}
          <div style={{
            fontSize: '28px', color: '#9ca3af', textAlign: 'center', maxWidth: '800px',
          }}>
            Discover the World of Cinema — 1000+ Films · 8 Languages
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '16px' }}>
            {[
              { num: '1000+', label: 'Films' },
              { num: '8', label: 'Languages' },
              { num: '13', label: 'Genres' },
              { num: '100%', label: 'Free' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '36px', fontWeight: 900, color: '#f59e0b' }}>{s.num}</span>
                <span style={{ fontSize: '16px', color: '#6b7280' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute', bottom: '24px',
          color: '#4b5563', fontSize: '18px', display: 'flex',
        }}>
          cinereview-mu.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
