const c = (name) => `rgb(var(--c-${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: c('ink'),
        surface: c('surface'),
        raised: c('raised'),
        line: c('line'),
        bone: c('bone'),
        muted: c('muted'),
        accent: c('accent'),
        'accent-ink': c('accent-ink'),
        sale: c('sale'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
    },
  },
  plugins: [],
}
