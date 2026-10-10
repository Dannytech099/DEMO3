import { useId, type ReactNode } from 'react'
import type { ArtKind, Tone } from '../types'
import { luminance, shade } from '../lib/color'

/**
 * Generated product artwork (SVG). Gives the demo zero broken images and works offline.
 * For real photography, put image paths in a product's `images` array instead.
 */
const TONES: Record<Tone, [string, string]> = {
  sand: ['#EEE5D3', '#D9CBB1'],
  clay: ['#E6CDB8', '#CFA88B'],
  sage: ['#CFD9C8', '#AEBCA6'],
  mist: ['#D8DFE3', '#B6C2C9'],
  blush: ['#F0DCD5', '#DDB9B0'],
  stone: ['#E0DCD4', '#C3BDB1'],
  deep: ['#2F4D44', '#17302A'],
}

const BRASS = '#C9A25D'

interface Props {
  kind: ArtKind
  tone: Tone
  color: string
  view?: number
  className?: string
  label?: string
}

const VIEW_TRANSFORMS = [
  '',
  'translate(200 240) scale(1.6) translate(-200 -250)',
  'rotate(-7 200 300)',
  'translate(200 275) scale(0.78) translate(-200 -250)',
]

export function ProductArt({ kind, tone, color, view = 0, className = '', label }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const [t1, t2] = TONES[tone]
  const v = ((view % 4) + 4) % 4
  const sh = `url(#sh${uid})`

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ?? kind}
      className={className}
    >
      <defs>
        <linearGradient id={`bg${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t1} />
          <stop offset="1" stopColor={t2} />
        </linearGradient>
        <linearGradient id={`sh${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.24" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#bg${uid})`} />
      {v === 0 && <circle cx="200" cy="230" r="170" fill="#fff" opacity="0.12" />}
      {v === 2 && <circle cx="310" cy="110" r="190" fill="#fff" opacity="0.16" />}
      {v === 3 && (
        <>
          <rect y="350" width="400" height="150" fill="#000" opacity="0.08" />
          <rect y="350" width="400" height="3" fill="#000" opacity="0.08" />
        </>
      )}
      <g transform={VIEW_TRANSFORMS[v]}>
        <ellipse cx="200" cy="424" rx="130" ry="13" fill="#000" opacity="0.15" />
        {draw(kind, color, sh)}
      </g>
    </svg>
  )
}

function draw(kind: ArtKind, c: string, sh: string): ReactNode {
  const dark = shade(c, -0.3)
  const light = shade(c, 0.28)

  switch (kind) {
    case 'bag': {
      const body = 'M104 226 H296 L316 388 Q318 408 298 408 H102 Q82 408 84 388 Z'
      return (
        <g>
          <path d="M148 232 C148 140 252 140 252 232" fill="none" stroke={dark} strokeWidth="11" strokeLinecap="round" />
          <path d={body} fill={c} />
          <path d="M104 226 H296 L300 262 H100 Z" fill={dark} opacity="0.35" />
          <path d={body} fill={sh} />
          <rect x="188" y="248" width="24" height="34" rx="4" fill={BRASS} />
          <circle cx="200" cy="265" r="3.5" fill={shade(BRASS, -0.4)} />
          <path d="M92 362 H308" stroke={dark} strokeWidth="2" strokeDasharray="5 5" opacity="0.55" />
        </g>
      )
    }
    case 'wallet':
      return (
        <g>
          <rect x="132" y="168" width="136" height="80" rx="9" fill={shade(c, 0.4)} />
          <rect x="144" y="188" width="112" height="12" rx="3" fill="#fff" opacity="0.5" />
          <rect x="108" y="206" width="184" height="226" rx="18" fill={c} />
          <path d="M108 262 H292" stroke={dark} strokeWidth="3" opacity="0.6" />
          <rect x="108" y="206" width="184" height="226" rx="18" fill={sh} />
          <rect x="120" y="218" width="160" height="202" rx="11" fill="none" stroke={dark} strokeWidth="2" strokeDasharray="5 5" opacity="0.55" />
          <circle cx="200" cy="356" r="13" fill={BRASS} />
        </g>
      )
    case 'shoe':
      return (
        <g>
          <path d="M64 352 Q64 332 86 332 H336 Q356 332 356 352 Q356 366 342 366 H78 Q64 366 64 352Z" fill="#F4F1EA" />
          <path d="M70 352 H350" stroke="#000" opacity="0.12" />
          <path d="M86 332 L92 238 Q94 222 112 224 L166 240 Q196 214 232 238 L296 284 Q338 298 344 332 Z" fill={c} />
          <path d="M268 272 L296 284 Q338 298 344 332 H262 Q270 304 268 272Z" fill={dark} opacity="0.25" />
          <path d="M150 232 L176 196 Q190 186 204 198 L212 236Z" fill={light} />
          <path d="M92 238 H124 L120 292 H88Z" fill={dark} opacity="0.7" />
          <path d="M178 220 L206 234 M192 238 L220 252 M208 254 L238 270" stroke="#F4F1EA" strokeWidth="5" strokeLinecap="round" />
          <path d="M86 332 L92 238 Q94 222 112 224 L166 240 Q196 214 232 238 L296 284 Q338 298 344 332 Z" fill={sh} />
        </g>
      )
    case 'watch': {
      const darkDial = luminance(c) > 0.55
      const dial = darkDial ? '#14221E' : '#F3EFE4'
      const mark = darkDial ? '#EFE9DD' : '#1D2623'
      return (
        <g>
          <path d="M165 60 H235 L242 170 H158Z" fill="#2B2622" />
          <path d="M158 330 H242 L235 440 H165Z" fill="#2B2622" />
          {[372, 392, 412].map((y) => <circle key={y} cx="200" cy={y} r="4" fill="#000" opacity="0.4" />)}
          <rect x="296" y="240" width="14" height="20" rx="3" fill={c} />
          <circle cx="200" cy="250" r="100" fill={c} />
          <circle cx="200" cy="250" r="100" fill={sh} />
          <circle cx="200" cy="250" r="84" fill={shade(c, -0.2)} />
          <circle cx="200" cy="250" r="78" fill={dial} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6
            const r1 = i % 3 === 0 ? 60 : 66
            return <line key={i} x1={200 + Math.sin(a) * r1} y1={250 - Math.cos(a) * r1} x2={200 + Math.sin(a) * 72} y2={250 - Math.cos(a) * 72} stroke={mark} strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" />
          })}
          <line x1="200" y1="250" x2="200" y2="204" stroke={mark} strokeWidth="5" strokeLinecap="round" />
          <line x1="200" y1="250" x2="236" y2="228" stroke={mark} strokeWidth="4" strokeLinecap="round" />
          <circle cx="200" cy="250" r="6" fill={BRASS} />
        </g>
      )
    }
    case 'eyewear':
      return (
        <g>
          <path d="M70 242 L40 230 M330 242 L360 230" stroke={c} strokeWidth="9" strokeLinecap="round" />
          <path d="M178 250 Q200 230 222 250" fill="none" stroke={c} strokeWidth="9" strokeLinecap="round" />
          <rect x="68" y="214" width="112" height="92" rx="42" fill="#1B2B27" fillOpacity="0.82" stroke={c} strokeWidth="9" />
          <rect x="220" y="214" width="112" height="92" rx="42" fill="#1B2B27" fillOpacity="0.82" stroke={c} strokeWidth="9" />
          <path d="M92 236 Q108 224 130 232" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.3" />
          <path d="M244 236 Q260 224 282 232" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.3" />
        </g>
      )
    case 'fragrance':
      return (
        <g>
          <rect x="170" y="130" width="60" height="64" rx="8" fill="#1D2623" />
          <rect x="170" y="130" width="60" height="64" rx="8" fill={sh} />
          <rect x="182" y="190" width="36" height="22" fill={BRASS} />
          <rect x="132" y="208" width="136" height="216" rx="20" fill="#fff" fillOpacity="0.4" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" />
          <rect x="142" y="266" width="116" height="148" rx="12" fill={c} fillOpacity="0.92" />
          <rect x="160" y="304" width="80" height="70" rx="4" fill="#F4F0E6" />
          <rect x="172" y="320" width="56" height="5" rx="2" fill="#1D2623" opacity="0.8" />
          <rect x="180" y="334" width="40" height="3" rx="1.5" fill="#1D2623" opacity="0.4" />
          <rect x="180" y="344" width="40" height="3" rx="1.5" fill="#1D2623" opacity="0.4" />
          <rect x="148" y="222" width="10" height="170" rx="5" fill="#fff" opacity="0.4" />
        </g>
      )
    case 'candle':
      return (
        <g>
          <path d="M200 192 C184 216 188 236 200 236 C212 236 216 216 200 192Z" fill="#F2B84B" />
          <path d="M200 212 C194 224 196 236 200 236 C204 236 206 224 200 212Z" fill="#FFE29A" />
          <line x1="200" y1="248" x2="200" y2="234" stroke="#2A2220" strokeWidth="3" strokeLinecap="round" />
          <path d="M120 252 H280 V400 Q280 420 260 420 H140 Q120 420 120 400Z" fill={c} />
          <path d="M120 252 H280 V400 Q280 420 260 420 H140 Q120 420 120 400Z" fill={sh} />
          <ellipse cx="200" cy="252" rx="80" ry="14" fill={shade(c, 0.5)} />
          <ellipse cx="200" cy="252" rx="66" ry="9" fill="#F1E7D2" />
          <rect x="156" y="316" width="88" height="56" rx="3" fill="#F4F0E6" />
          <rect x="168" y="332" width="64" height="5" rx="2" fill="#1D2623" opacity="0.8" />
          <rect x="178" y="346" width="44" height="3" rx="1.5" fill="#1D2623" opacity="0.4" />
        </g>
      )
    case 'vase': {
      const body = 'M170 150 H230 Q226 188 244 226 Q290 282 280 362 Q276 422 200 422 Q124 422 120 362 Q110 282 156 226 Q174 188 170 150Z'
      return (
        <g>
          <path d="M200 150 C200 108 218 76 252 54" fill="none" stroke="#5A6B4A" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="226" cy="96" rx="16" ry="7" transform="rotate(-40 226 96)" fill="#6F8259" />
          <ellipse cx="244" cy="68" rx="14" ry="6" transform="rotate(-55 244 68)" fill="#6F8259" />
          <ellipse cx="190" cy="118" rx="14" ry="6" transform="rotate(30 190 118)" fill="#6F8259" />
          <path d={body} fill={c} />
          <path d={body} fill={sh} />
          <ellipse cx="200" cy="150" rx="30" ry="7" fill={dark} />
          {[250, 290, 330, 370].map((y) => (
            <path key={y} d={`M124 ${y} Q200 ${y + 14} 276 ${y}`} fill="none" stroke={dark} strokeWidth="2" opacity="0.35" />
          ))}
        </g>
      )
    }
  }
}
