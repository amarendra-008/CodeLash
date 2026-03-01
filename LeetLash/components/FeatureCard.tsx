'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────────────
   FEATURE CARD
   Dark card with ember left-border accent.
   Accepts `icon` as ReactNode so it can receive
   pre-rendered JSX from a Server Component parent.
   ───────────────────────────────────────────────────── */

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  tag?: string
  accent?: 'ember' | 'flame'
  index?: number
}

export default function FeatureCard({
  icon,
  title,
  description,
  tag,
  accent = 'ember',
  index = 0,
}: FeatureCardProps) {
  const accentColor =
    accent === 'ember'
      ? 'border-l-ember hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(200,16,46,0.1)]'
      : 'border-l-flame hover:shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_30px_rgba(232,93,4,0.1)]'

  const iconColor =
    accent === 'ember' ? 'text-ember' : 'text-flame'

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
      className={cn(
        'group relative bg-gradient-card border-l-2 border border-ash p-7 md:p-8',
        'transition-all duration-300 cursor-default',
        accentColor
      )}
    >
      {/* Corner accent — top right */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          accent === 'ember'
            ? 'border-t border-r border-ember/30'
            : 'border-t border-r border-flame/30'
        )}
      />

      {/* Tag / badge */}
      {tag && (
        <span
          className={cn(
            'inline-block font-mono text-[10px] tracking-[0.35em] uppercase px-2 py-0.5 mb-5',
            accent === 'ember'
              ? 'text-ember bg-ember/10 border border-ember/20'
              : 'text-flame bg-flame/10 border border-flame/20'
          )}
        >
          {tag}
        </span>
      )}

      {/* Icon */}
      <div
        className={cn(
          'mb-5 w-7 h-7 transition-transform duration-300 group-hover:scale-110',
          iconColor
        )}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl md:text-3xl text-parchment tracking-wide mb-3 leading-tight">
        {title}
      </h3>

      {/* Description */}
      <p className="font-condensed text-slate text-base leading-relaxed font-normal">
        {description}
      </p>

      {/* Hover reveal — "Enter →" */}
      <div
        aria-hidden="true"
        className="mt-6 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        <span
          className={cn(
            'font-mono text-xs tracking-[0.2em] uppercase',
            accent === 'ember' ? 'text-ember' : 'text-flame'
          )}
        >
          Explore
        </span>
        <span
          className={cn(
            'text-xs transition-transform duration-300 group-hover:translate-x-1',
            accent === 'ember' ? 'text-ember' : 'text-flame'
          )}
        >
          →
        </span>
      </div>
    </motion.article>
  )
}
