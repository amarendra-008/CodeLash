'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import GlowButton from './GlowButton'

/* ─────────────────────────────────────────────────────
   HERO
   Full-viewport opening. The practice room.
   Features:
     • Layered red stage-light radial gradients
     • Film-grain noise + CRT scanlines
     • One-time "AGAIN." flash (Fletcher's opening bark)
     • Cycling pressure words
     • Staggered content reveal
     • Stats bar
     • Scroll indicator
   ───────────────────────────────────────────────────── */

const PRESSURE_WORDS = ['AGAIN.', 'PUSH.', 'BLEED.', 'CODE.', 'WIN.', 'GRIND.']

const CONTAINER_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
}

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
}

const STATS = [
  { value: '12', label: 'CS Topics' },
  { value: '∞', label: 'Pressure' },
]

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)

  // Cycle through pressure words on an interval
  useEffect(() => {
    const id = setInterval(() => {
      setWordIdx((i) => (i + 1) % PRESSURE_WORDS.length)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-void pb-4"
      aria-label="Hero — LeetLash landing"
    >
      {/* ── BACKGROUND LAYERS ─────────────────────── */}

      {/* Stage light top — primary red spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-spotlight-top pointer-events-none"
      />
      {/* Stage light left — secondary warm wash */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-spotlight-left pointer-events-none"
      />
      {/* Stage light right — orange edge glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-spotlight-right pointer-events-none"
      />
      {/* Bottom ambient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-spotlight-bottom pointer-events-none"
      />

      {/* Noise / film grain overlay */}
      <div
        aria-hidden="true"
        className="noise-overlay scanlines absolute inset-0 pointer-events-none"
      />

      {/* Subtle grid lines — practice room floor */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── THE FLETCHER MOMENT ───────────────────────
          "AGAIN." appears ghostly on first load and fades.
          Like Fletcher barking at you before you've begun.
         ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="again-flash absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[3]"
      >
        <span className="font-display text-[clamp(8rem,35vw,30rem)] text-ember leading-none tracking-tight">
          AGAIN.
        </span>
      </div>

      {/* ── HERO CONTENT ──────────────────────────────── */}
      <motion.div
        variants={CONTAINER_VARIANTS}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-24"
      >
        {/* Eyebrow */}
        <motion.p
          variants={ITEM_VARIANTS}
          className="font-mono text-ember text-xs tracking-[0.45em] uppercase mb-6 md:mb-8"
        >
          Not quite my tempo
        </motion.p>

        {/* ── MAIN HEADLINE ─ */}
        <motion.h1
          variants={ITEM_VARIANTS}
          className="font-display leading-none tracking-tight mb-0 select-none"
          style={{ fontSize: 'clamp(5.5rem, 20vw, 16rem)' }}
        >
          <span className="text-parchment">CODE</span>
          <span
            className="text-ember relative inline-block"
            aria-label="LASH"
          >
            LASH
            {/* Underline that breathes */}
            <span
              aria-hidden="true"
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-ember animate-breathe"
            />
          </span>
        </motion.h1>

        {/* Subheadline line 2 */}
        <motion.p
          variants={ITEM_VARIANTS}
          className="font-display text-[clamp(1.5rem,5vw,4rem)] text-charcoal tracking-wider mb-6 mt-2"
          aria-label="Master CS the Right Way"
        >
          MASTER CS THE RIGHT WAY
        </motion.p>

        {/* ── CYCLING PRESSURE WORD ─────────────────── */}
        <motion.div
          variants={ITEM_VARIANTS}
          className="h-12 md:h-16 flex items-center justify-center mb-6"
          aria-live="polite"
          aria-label={`Current pressure: ${PRESSURE_WORDS[wordIdx]}`}
        >
          <motion.span
            key={wordIdx}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(1.8rem,5.5vw,4.5rem)] text-gradient-ember block"
          >
            {PRESSURE_WORDS[wordIdx]}
          </motion.span>
        </motion.div>

        {/* ── SUBHEADLINE ──────────────────────────── */}
        <motion.p
          variants={ITEM_VARIANTS}
          className="font-condensed text-slate text-lg md:text-xl max-w-2xl mx-auto mb-10 md:mb-14 leading-relaxed"
        >
          AI companion for LeetCode domination, database mastery, and core CS
          skills.{' '}
          <span className="text-bone">
            Inspired by Whiplash. Because greatness demands discipline.
          </span>
        </motion.p>

        {/* ── CTAs ───────────────────────────────────── */}
        <motion.div
          variants={ITEM_VARIANTS}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <GlowButton
            href="/create-room"
            variant="primary"
            size="lg"
            aria-label="Enter the practice room — start grinding"
          >
            Enter the Practice Room
          </GlowButton>
          <GlowButton
            href="#features"
            variant="ghost"
            size="lg"
            aria-label="See what LeetLash offers"
          >
            See What Awaits
          </GlowButton>
        </motion.div>
      </motion.div>

      {/* ── STATS BAR ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-12 flex justify-center"
        aria-label="Platform statistics"
      >
        <dl className="flex gap-8 md:gap-16 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center">
              <dt className="font-display text-2xl md:text-3xl text-parchment leading-none">
                {value}
              </dt>
              <dd className="font-mono text-[10px] md:text-xs text-charcoal tracking-[0.3em] uppercase mt-1">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>

      {/* Divider between stats and scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        aria-hidden="true"
        className="relative z-10 mt-8 w-px h-10 bg-gradient-to-b from-fog to-transparent"
      />

      {/* ── SCROLL INDICATOR ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.1 }}
        className="relative z-10 mb-8 flex flex-col items-center gap-2 group cursor-pointer"
        onClick={() =>
          document
            .getElementById('features')
            ?.scrollIntoView({ behavior: 'smooth' })
        }
        role="button"
        tabIndex={0}
        aria-label="Scroll to features"
        onKeyDown={(e) => {
          if (e.key === 'Enter')
            document
              .getElementById('features')
              ?.scrollIntoView({ behavior: 'smooth' })
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase text-fog group-hover:text-ember transition-colors duration-200">
          Again.
        </span>
        <ChevronDown
          className="w-4 h-4 text-fog group-hover:text-ember animate-breathe transition-colors duration-200"
          aria-hidden="true"
        />
      </motion.div>
    </section>
  )
}
