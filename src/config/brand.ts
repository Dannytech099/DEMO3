/**
 * BRAND CONFIG: edit this file to re-skin the whole store for a new prospect.
 * Colours, fonts, name, copy, currency and shipping rules all live here.
 */
export const brand = {
  name: 'Halden',
  tagline: 'Considered goods for everyday life',
  /** Shown in the top bar and admin banner, e.g. "Concept for Adaeze Boutique". Leave '' to hide. */
  preparedFor: '',
  /** Footer credit line. Leave '' to hide. */
  credit: 'Prototype by XTech Web Hub',
  /** Set to an image path (e.g. '/logo.svg' placed in /public) to replace the text logo. */
  logoUrl: '' as string,
  /** Prefix for localStorage keys, change per prospect so demos never clash. */
  storagePrefix: 'halden',

  currency: { code: 'NGN', locale: 'en-NG' },
  freeShippingThreshold: 150000,
  shippingFee: 3500,
  expressFee: 8500,

  contact: {
    email: 'hello@halden.example',
    phone: '+234 800 000 0000',
    address: '12 Admiralty Way, Lekki Phase 1, Lagos',
  },

  hero: {
    headline: 'Goods made to be used, every day.',
    subline:
      'Leather bags, sneakers, watches and home pieces, made in small batches and delivered across Nigeria in 2 to 4 days.',
    proof: 'Rated 4.9 out of 5 by 2,300 customers',
  },

  /** Hex colours. The whole UI is driven from these values. */
  colors: {
    ink: '#0C1A16', // page background
    surface: '#13221E', // cards, inputs
    raised: '#1B2E28', // hover and raised areas
    line: '#2B4139', // borders
    bone: '#EFE9DD', // main text
    muted: '#9DAEA5', // secondary text
    accent: '#C9A25D', // buttons and highlights
    accentInk: '#14100A', // text on accent
    sale: '#E2574C', // sale badges and errors
  },

  /** Any Google Font pair works. Update `url` and the two family strings together. */
  fonts: {
    display: "'Instrument Serif', Georgia, serif",
    body: "'Hanken Grotesk', system-ui, sans-serif",
    url: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap',
  },
}
