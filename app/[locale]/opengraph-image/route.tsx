import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const contentType = 'image/png'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #030712 0%, #0a0e17 60%, #0f1629 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Amber top line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
          display: 'flex',
        }} />

        {/* Amber glow */}
        <div style={{
          position: 'absolute',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)',
          top: '50px', left: '300px',
          display: 'flex',
        }} />

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)',
          borderRadius: '999px', padding: '8px 24px', marginBottom: '24px',
          color: '#f59e0b', fontSize: '20px', fontWeight: 600,
        }}>
          🎬  Professional Investigative Reviews
        </div>

        {/* Title */}
        <div style={{
          fontSize: '96px', fontWeight: 900,
          color: '#ffffff', marginBottom: '16px',
          letterSpacing: '-2px',
        }}>
          CineReview
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: '28px', color: '#9ca3af', textAlign: 'center',
          maxWidth: '800px', marginBottom: '40px',
        }}>
          Discover the World of Cinema
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '48px' }}>
          {[
            { num: '1000+', label: 'Films' },
            { num: '8', label: 'Languages' },
            { num: '13', label: 'Genres' },
            { num: '100%', label: 'Free' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '40px', fontWeight: 900, color: '#f59e0b' }}>{s.num}</span>
              <span style={{ fontSize: '18px', color: '#6b7280' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute', bottom: '24px',
          color: '#374151', fontSize: '18px', display: 'flex',
        }}>
          cinereview-mu.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
