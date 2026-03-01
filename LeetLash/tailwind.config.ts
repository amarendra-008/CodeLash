import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ─────────────────────────────────────────────
      // WHIPLASH COLOR PALETTE
      // ─────────────────────────────────────────────
      colors: {
        // Blacks — layered like shadows under a stage light
        void: '#050505',
        obsidian: '#0a0a0a',
        cinder: '#111111',
        ash: '#1a1a1a',
        smoke: '#2a2a2a',
        lead: '#3d3d3d',
        // Reds — blood, pressure, intensity
        ember: {
          DEFAULT: '#c8102e',
          bright: '#ef233c',
          dim: '#8b0d1e',
          muted: 'rgba(200, 16, 46, 0.15)',
        },
        // Oranges — drum lights, spotlight warmth
        flame: {
          DEFAULT: '#e85d04',
          bright: '#f97316',
          dim: '#9a3d00',
        },
        // Whites — film parchment, aged paper
        parchment: '#f0e6d3',
        bone: '#d4c9b8',
        dust: '#b0a090',
        // Grays — utility, restraint
        slate: '#8a8a8a',
        charcoal: '#555555',
        fog: '#3d3d3d',
        // Aliases for create-room components (explicit color values requested)
        codeRed: '#dc2626',
        painOrange: '#f97316',
      },

      // ─────────────────────────────────────────────
      // TYPOGRAPHY
      // ─────────────────────────────────────────────
      fontFamily: {
        // Bebas Neue — cinematic muscle
        display: ['var(--font-bebas)', 'Impact', '"Arial Narrow"', 'sans-serif'],
        // Barlow Condensed — precision, discipline
        condensed: ['var(--font-barlow)', '"Barlow Condensed"', 'sans-serif'],
        // Crimson Pro — literary gravitas for quotes
        literary: ['var(--font-crimson)', '"Crimson Pro"', 'Georgia', 'serif'],
        // Mono — code, machine, relentless
        mono: ['"JetBrains Mono"', '"Fira Code"', '"Courier New"', 'monospace'],
      },

      // ─────────────────────────────────────────────
      // BACKGROUND GRADIENTS (stage lighting)
      // ─────────────────────────────────────────────
      backgroundImage: {
        'spotlight-top':
          'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(200, 16, 46, 0.22) 0%, transparent 70%)',
        'spotlight-left':
          'radial-gradient(ellipse 50% 80% at -8% 60%, rgba(200, 16, 46, 0.12) 0%, transparent 60%)',
        'spotlight-right':
          'radial-gradient(ellipse 45% 70% at 108% 40%, rgba(232, 93, 4, 0.10) 0%, transparent 60%)',
        'spotlight-bottom':
          'radial-gradient(ellipse 60% 35% at 50% 108%, rgba(200, 16, 46, 0.18) 0%, transparent 60%)',
        'gradient-hero':
          'linear-gradient(180deg, #050505 0%, #0a0a0a 60%, #050505 100%)',
        'gradient-card':
          'linear-gradient(145deg, #111111 0%, #090909 100%)',
        'gradient-ember':
          'linear-gradient(135deg, #c8102e 0%, #e85d04 100%)',
        'gradient-subtle':
          'linear-gradient(180deg, transparent 0%, rgba(200, 16, 46, 0.04) 100%)',
      },

      // ─────────────────────────────────────────────
      // SHADOWS — glow effects
      // ─────────────────────────────────────────────
      boxShadow: {
        ember:
          '0 0 20px rgba(200, 16, 46, 0.3), 0 0 60px rgba(200, 16, 46, 0.1)',
        'ember-lg':
          '0 0 40px rgba(200, 16, 46, 0.4), 0 0 80px rgba(200, 16, 46, 0.15), 0 0 120px rgba(200, 16, 46, 0.05)',
        'ember-intense':
          '0 0 20px rgba(200, 16, 46, 0.7), 0 0 60px rgba(200, 16, 46, 0.35), 0 0 100px rgba(200, 16, 46, 0.12)',
        flame:
          '0 0 20px rgba(232, 93, 4, 0.35), 0 0 60px rgba(232, 93, 4, 0.12)',
        card: '0 4px 24px rgba(0, 0, 0, 0.5), 0 1px 4px rgba(0, 0, 0, 0.7)',
        'card-hover':
          '0 8px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(200, 16, 46, 0.10)',
      },

      // ─────────────────────────────────────────────
      // KEYFRAMES
      // ─────────────────────────────────────────────
      keyframes: {
        // Pulsing ember glow on CTAs
        'pulse-ember': {
          '0%, 100%': {
            boxShadow:
              '0 0 20px rgba(200, 16, 46, 0.3), 0 0 60px rgba(200, 16, 46, 0.1)',
          },
          '50%': {
            boxShadow:
              '0 0 40px rgba(200, 16, 46, 0.65), 0 0 80px rgba(200, 16, 46, 0.28)',
          },
        },
        // Horizontal marquee scroll
        'marquee-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        // Breathing opacity for ambient elements
        breathe: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        // Slide up reveal
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // Float drift for background elements
        drift: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.015)' },
        },
        // Sporadic flicker for neon/recording lights
        flicker: {
          '0%, 87%, 89%, 91%, 100%': { opacity: '1' },
          '88%': { opacity: '0.3' },
          '90%': { opacity: '0.7' },
        },
        // The "AGAIN." hero flash — the Fletcher moment
        'again-flash': {
          '0%': { opacity: '0', transform: 'scale(0.97)' },
          '12%': { opacity: '0.09', transform: 'scale(1)' },
          '70%': { opacity: '0.09' },
          '100%': { opacity: '0', transform: 'scale(1.02)' },
        },
        // Word swap in hero (sharp cut, no fade)
        'word-enter': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '15%': { opacity: '1', transform: 'translateY(0)' },
          '85%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        // Red dot REC blink
        'rec-blink': {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        // Fade in simple
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        // Practice Room: timer critical — fast crimson throb when < 5min
        'timer-critical': {
          '0%, 100%': {
            textShadow: '0 0 0 transparent',
            transform: 'scale(1)',
          },
          '50%': {
            textShadow: '0 0 14px rgba(200, 16, 46, 0.85)',
            transform: 'scale(1.04)',
          },
        },
        // Practice Room: coach slide-in — Fletcher's feedback drops in
        'coach-slide-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Practice Room: submit shake — wrong answer tremor
        'submit-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-5px)' },
          '40%': { transform: 'translateX(5px)' },
          '60%': { transform: 'translateX(-3px)' },
          '80%': { transform: 'translateX(3px)' },
        },
        // Practice Room: pressure flash — full-screen red pulse at time warnings
        'pressure-flash': {
          '0%': { opacity: '0' },
          '8%': { opacity: '0.14' },
          '85%': { opacity: '0.14' },
          '100%': { opacity: '0' },
        },
        // Practice Room: code pulse — editor border throbs on submit loading
        'code-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(200, 16, 46, 0)' },
          '50%': {
            boxShadow:
              '0 0 0 1px rgba(200, 16, 46, 0.7), 0 0 30px rgba(200, 16, 46, 0.2)',
          },
        },
        // Practice Room: feedback slam — brutal message entrance
        'feedback-slam': {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.99)' },
          '60%': { opacity: '1', transform: 'translateY(-1px) scale(1.003)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },

      // ─────────────────────────────────────────────
      // ANIMATIONS
      // ─────────────────────────────────────────────
      animation: {
        'pulse-ember': 'pulse-ember 2.8s ease-in-out infinite',
        marquee: 'marquee-scroll 38s linear infinite',
        breathe: 'breathe 3.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        drift: 'drift 7s ease-in-out infinite',
        flicker: 'flicker 14s linear infinite',
        'again-flash': 'again-flash 3.5s ease-in-out 0.8s 1 forwards',
        'rec-blink': 'rec-blink 1.4s step-start infinite',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        // Practice Room animations
        'timer-critical': 'timer-critical 1s ease-in-out infinite',
        'coach-slide-in': 'coach-slide-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'submit-shake': 'submit-shake 0.45s ease-in-out',
        'pressure-flash': 'pressure-flash 5s ease-in-out 1 forwards',
        'code-pulse': 'code-pulse 1.4s ease-in-out infinite',
        'feedback-slam': 'feedback-slam 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}

export default config
