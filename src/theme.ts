import { brand } from './config/brand'
import { hexToChannels } from './lib/color'

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)

/** Pushes brand colours and fonts into CSS variables that Tailwind reads. */
export function applyTheme() {
  const root = document.documentElement
  Object.entries(brand.colors).forEach(([key, hex]) => {
    root.style.setProperty(`--c-${kebab(key)}`, hexToChannels(hex))
  })
  root.style.setProperty('--font-display', brand.fonts.display)
  root.style.setProperty('--font-body', brand.fonts.body)

  if (brand.fonts.url) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = brand.fonts.url
    document.head.appendChild(link)
  }

  document.title = `${brand.name} | ${brand.tagline}`
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', brand.colors.ink)
  document.querySelector('meta[name="description"]')?.setAttribute('content', brand.tagline)
}
