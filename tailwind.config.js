/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#0A0A0A',
          slot: '#111113',
          surface: '#121214',
          elevated: '#141416',
          text: '#F5F5F5',
          muted: '#8E8E93',
          lime: '#D2FF3A',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        technical: '0.12em',
      },
    },
  },
  plugins: [],
};
