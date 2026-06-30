import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Brand colours ──────────────────────────────────────────────────────
      colors: {
        primary: {
          DEFAULT: 'rgb(0, 113, 220)',
          dark:    'rgb(0, 90, 180)',
          light:   'rgb(51, 147, 230)',
        },
        secondary: {
          DEFAULT: 'rgb(250, 204, 21)',
          dark:    'rgb(202, 162, 10)',
          light:   'rgb(253, 224, 71)',
        },
        // Semantic aliases
        success: 'rgb(22, 163, 74)',
        danger:  'rgb(225, 29, 72)',
        warning: 'rgb(234, 179, 8)',
        info:    'rgb(2, 132, 199)',
      },

      // ── Typography ─────────────────────────────────────────────────────────
      fontFamily: {
        sans:    ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs:   ['0.75rem',   { lineHeight: '1rem' }],
        sm:   ['0.875rem',  { lineHeight: '1.25rem' }],
        base: ['1rem',      { lineHeight: '1.5rem' }],
        lg:   ['1.125rem',  { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',   { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem',   { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2rem',     { lineHeight: '2.5rem' }],
      },
      letterSpacing: {
        body:    '-0.01rem',
        heading: '-0.025rem',
        tight:   '-0.01em',
      },

      // ── Layout ─────────────────────────────────────────────────────────────
      maxWidth: {
        site: '1460px',
      },
      spacing: {
        // Theme gutter
        gutter: '30px',
        // Header heights
        'header':     '74px',
        'menu-bar':   '56px',
        'mobile-nav': '60px',
        // Drawer width
        'drawer':     '340px',
      },

      // ── Border radius ───────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '6px',
        sm:      '4px',
        full:    '9999px',
        none:    '0px',
      },

      // ── Height scale (buttons & inputs) ────────────────────────────────────
      height: {
        'btn-xs':   '32px',
        'btn-sm':   '38px',
        'btn-mob':  '40px',
        'btn':      '44px',
        'btn-lg':   '48px',
        'input-xs': '32px',
        'input-sm': '38px',
        'input':    '44px',
        'input-lg': '48px',
        'header':   '74px',
      },

      // ── Z-index ─────────────────────────────────────────────────────────────
      zIndex: {
        dropdown:  '100',
        sticky:    '200',
        fixed:     '300',
        'modal-bg':'400',
        modal:     '500',
        popover:   '600',
        toast:     '700',
        drawer:    '999',
      },

      // ── Box shadow ──────────────────────────────────────────────────────────
      boxShadow: {
        input:   '0 0.0625rem 0.125rem rgba(2, 6, 23, 0.05)',
        card:    '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)',
        product: '0 4px 16px rgba(0, 0, 0, 0.08)',
        drawer:  '4px 0 24px rgba(0, 0, 0, 0.12)',
      },

      // ── Shimmer / skeleton animation ─────────────────────────────────────
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out infinite',
      },

      // ── Transition timing ────────────────────────────────────────────────
      transitionTimingFunction: {
        button: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        drawer: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
      },
      transitionDuration: {
        button: '100ms',
        drawer: '350ms',
      },

      // ── Screens (breakpoints from theme CSS) ─────────────────────────────
      screens: {
        xs:     '480px',
        sm:     '576px',
        md:     '768px',
        lg:     '1024px',
        xl:     '1280px',
        '2xl':  '1460px',   /* site max-width */
      },

      // ── Background image gradients ────────────────────────────────────────
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, rgb(0, 113, 220), rgb(51, 147, 230))',
        'hero-gradient':    'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
