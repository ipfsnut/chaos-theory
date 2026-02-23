import { ImageResponse } from 'next/og'
import { POSTS } from '../posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return POSTS.map(post => ({ slug: post.slug }))
}

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS.find(p => p.slug === slug)

  const title = post?.title || 'ChaosTheory Blog'
  const date = post?.date || ''
  const excerpt = post?.excerpt || ''

  // Truncate excerpt for OG image
  const shortExcerpt = excerpt.length > 140 ? excerpt.slice(0, 137) + '...' : excerpt

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#090B0A',
          padding: '60px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #00D98A, #00FF9D, #00D98A)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D98A, #00FF9D)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              <span style={{ color: '#090B0A', fontWeight: 900 }}>C</span>
            </div>
            <span style={{ color: '#00D98A', fontSize: '24px', fontWeight: 700 }}>
              ChaosTheory
            </span>
          </div>
          {date && (
            <span style={{ color: '#6C7A73', fontSize: '20px' }}>
              {date}
            </span>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              color: '#ECF0ED',
              fontSize: title.length > 60 ? '36px' : '44px',
              fontWeight: 700,
              lineHeight: 1.3,
              margin: 0,
              marginBottom: '24px',
            }}
          >
            {title}
          </h1>
          {shortExcerpt && (
            <p
              style={{
                color: '#9AA7A0',
                fontSize: '20px',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {shortExcerpt}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #1B211E',
            paddingTop: '24px',
          }}
        >
          <span style={{ color: '#6C7A73', fontSize: '18px' }}>
            chaos-theory.epicdylan.com
          </span>
          <span style={{ color: '#00D98A', fontSize: '18px' }}>
            $CHAOS Rails
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
