/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'border-primary': 'var(--border-primary)',
        'border-secondary': 'var(--border-secondary)',
        'accent': 'var(--accent-primary)',
        'accent-hover': 'var(--accent-hover)',
        'accent-fg': 'var(--accent-fg)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['monospace'],
      },
      fontSize: {
        'caption': ['10px', { lineHeight: '1.4', fontWeight: '500' }],
        'small': ['11px', { lineHeight: '1.4', fontWeight: '500' }],
        'label': ['12px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'heading-sm': ['16px', { lineHeight: '1.3', fontWeight: '700' }],
        'heading': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        'title': ['24px', { lineHeight: '1.2', fontWeight: '800' }],
      },
      borderRadius: {
        'subtle': '3px',
        'neo': '4px',
        'neo-md': '6px',
        'neo-lg': '8px',
        'neo-xl': '10px',
        'neo-2xl': '12px',
        'pill': '999px',
      },
      boxShadow: {
        'hard': '3px 3px 0 0 #27272a',
        'hard-accent': '3px 3px 0 0 var(--accent-primary)',
      },
    },
  },
  plugins: [],
}
