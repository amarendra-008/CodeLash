'use client'

import { motion } from 'framer-motion'
import GlowButton from './GlowButton'

export default function CTASection() {
  return (
    <section
      id="cta"
      className="relative bg-void py-20 md:py-32 px-6 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Spotlight from above */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(200, 16, 46, 0.28) 0%, transparent 70%)',
        }}
      />

      {/* Noise */}
      <div
        aria-hidden="true"
        className="noise-overlay absolute inset-0 pointer-events-none"
      />

      {/* "AGAIN." watermark pinned to bottom — clear of all text */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 flex justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="font-display text-[clamp(8rem,32vw,26rem)] text-ember/[0.03] leading-none tracking-tight translate-y-2/5">
          AGAIN.
        </span>
      </div>

      {/* All content in one staggered block — no y-transforms so nothing shifts into neighbours */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        {/* Eyebrow */}
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
          className="font-mono text-ember text-xs tracking-[0.45em] uppercase mb-6"
        >
          The Practice Room Awaits
        </motion.p>

        {/* Main headline */}
        <motion.h2
          id="cta-heading"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.75 } } }}
          className="font-display text-parchment leading-none tracking-tight mb-6"
          style={{ fontSize: 'clamp(3.5rem, 12vw, 9.5rem)' }}
        >
          FACE THE <span className="text-gradient-ember">TEMPO</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.7 } } }}
          className="font-condensed text-slate text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
        >
          The first step is showing up.{' '}
          <span className="text-bone">Code the right way, under real pressure.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <GlowButton href="/create-room" variant="primary" size="lg" aria-label="Enter the practice room">
            Start Grinding
          </GlowButton>
          <GlowButton href="/create-room" variant="ghost" size="lg" aria-label="Go to practice room">
            Enter the Room
          </GlowButton>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, delay: 0.2 } } }}
          className="mt-8 font-mono text-[11px] text-charcoal tracking-[0.25em] uppercase"
        >
          No free passes. No shortcuts. No excuses.
        </motion.p>
      </motion.div>
    </section>
  )
}
