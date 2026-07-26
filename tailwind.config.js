/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        ember: '#fc5000',
        'plasma-violet': '#524ae9',
        sulfur: '#f5f28e',
        limestone: '#f7f6f2',
        pumice: '#e2e2df',
        obsidian: '#070607',
        chalk: '#ffffff',
      },
      outlineColor: {
        ring: 'var(--ring)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['"PP Neue Corp Compact"', 'Bebas Neue', 'Anton', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"DM Sans"', 'Inter', 'Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'card': '40px',
        'pill': '800px',
        'input': '100px',
        'button': '40px',
        'tag': '16px',
      },
      spacing: {
        '18': '4.5rem',
        '80': '20rem',
        '92': '23rem',
      },
      fontSize: {
        'display': ['189px', { lineHeight: '0.94', letterSpacing: '0' }],
        'heading-3xl': ['96px', { lineHeight: '0.95' }],
        'heading-2xl': ['80px', { lineHeight: '1.1' }],
        'heading-lg': ['48px', { lineHeight: '1' }],
        'heading': ['32px', { lineHeight: '1', letterSpacing: '0.64px' }],
        'heading-sm': ['30px', { lineHeight: '1.5' }],
        'subheading': ['26px', { lineHeight: '1.2' }],
        'body': ['16px', { lineHeight: '1.55' }],
        'body-sm': ['14px', { lineHeight: '1.2' }],
        'caption': ['12px', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
}
