import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        graphite: '#070B12',
        obsidian: '#0B111C',
        aurum: '#D6B66A',
        mint: '#62D6B3',
        cyanSoft: '#7DD3FC',
      },
      boxShadow: {
        glow: '0 0 38px rgba(214, 182, 106, 0.22)',
        cyan: '0 0 28px rgba(125, 211, 252, 0.16)',
      },
    },
  },
  plugins: [],
} satisfies Config;
