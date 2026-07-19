/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'parchment': '#f3f1ed',
        'pure-white': '#ffffff',
        'ink-black': '#181011',
        'charcoal': '#222222',
        'aubergine': '#302023',
        'ash': '#aaaaaa',
        'dim': '#666666',
        'bone': '#d8d4d4',
      },
      borderRadius: {
        'card': '4px',
        'pill': '100px',
      },
      fontFamily: {
        body: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.1px' }],
        'body': ['14px', { lineHeight: '1.5' }],
        'body-lg': ['15px', { lineHeight: '1.5' }],
        'subheading': ['20px', { lineHeight: '1.4' }],
        'heading-sm': ['28px', { lineHeight: '1.3' }],
        'heading': ['32px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'display': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fade-in-up 0.25s ease-out forwards',
      },
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
