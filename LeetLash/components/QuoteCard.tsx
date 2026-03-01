'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────────────
   QUOTE CARD
   Testimonial with Crimson Pro italic and
   oversized ember quotation mark.
   ───────────────────────────────────────────────────── */

interface QuoteCardProps {
  quote: string
  author: string
  role: string
  result?: string
  variant?: 'elevated' | 'default' | 'recessed'
  index?: number
}

export default function QuoteCard({
  quote,
  author,
  role,
  result,
  variant = 'default',
  index = 0,
}: QuoteCardProps) {
  const offsets = {
    elevated: 'md:-translate-y-6',
    default: 'md:translate-y-0',
    recessed: 'md:translate-y-6',
  }

  return (
    <motion.figure
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.1,
      }}
      className={cn(
        'card-ember relative bg-gradient-card p-8 md:p-10 flex flex-col',
        'border border-ash',
        offsets[variant]
      )}
    >
      {/* Giant quotation mark */}
      <span
        aria-hidden="true"
        className="font-literary text-[7rem] leading-none text-ember/20 absolute top-2 left-5 select-none"
      >
        "
      </span>

      {/* Quote text */}
      <blockquote className="relative z-10 font-literary text-xl md:text-2xl italic text-bone leading-relaxed mb-8 mt-6">
        {quote}
      </blockquote>

      {/* Attribution */}
      <figcaption className="mt-auto border-t border-ash pt-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-condensed font-semibold text-parchment tracking-wide">
            {author}
          </p>
          <p className="font-condensed text-slate text-sm tracking-wide">
            {role}
          </p>
        </div>
        {result && (
          <span className="font-mono text-xs tracking-[0.2em] text-ember uppercase border border-ember/30 px-2.5 py-1 flex-shrink-0 bg-ember/5">
            {result}
          </span>
        )}
      </figcaption>
    </motion.figure>
  )
}
