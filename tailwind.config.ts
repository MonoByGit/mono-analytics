import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#111111',
        'surface-raised': '#161616',
        border: '#222222',
        'border-subtle': '#1c1c1c',
        accent: {
          amber: '#E8773A',
          'amber-muted': '#9B5230',
          green: '#4A9B6F',
          red: '#C44B3A',
          blue: '#4A7BF7',
        },
        text: {
          primary: '#EFEFEF',
          secondary: '#666666',
          tertiary: '#333333',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'Fira Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
