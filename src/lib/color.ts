export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const hexToChannels = (hex: string) => hexToRgb(hex).join(' ')

const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

/** amount -1..0 darkens, 0..1 lightens */
export function shade(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const target = amount < 0 ? 0 : 255
  const p = Math.abs(amount)
  const mix = (c: number) => Math.round((target - c) * p + c)
  return toHex(mix(r), mix(g), mix(b))
}

export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}
