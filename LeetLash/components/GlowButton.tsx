'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────────────
   GLOW BUTTON
   The CTA workhorse. Three variants:
     primary → solid ember red, pulsing glow
     ghost   → transparent, ember border on hover
     outline → ember border, fills on hover
   ───────────────────────────────────────────────────── */

interface GlowButtonProps {
  href: string
  variant?: 'primary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  'aria-label'?: string
}

const BASE =
  'relative inline-flex items-center justify-center font-condensed font-bold tracking-[0.12em] uppercase overflow-hidden transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4 cursor-pointer'

const VARIANTS = {
  primary:
    'bg-ember text-parchment border border-ember hover:bg-ember-bright active:scale-95 animate-pulse-ember',
  ghost:
    'bg-transparent text-dust border border-ash hover:border-ember hover:text-parchment active:scale-95',
  outline:
    'bg-transparent text-ember border border-ember hover:bg-ember hover:text-parchment active:scale-95',
}

const SIZES = {
  sm: 'text-xs px-5 py-2.5 gap-1.5',
  md: 'text-sm px-8 py-3.5 gap-2',
  lg: 'text-base px-12 py-5 gap-2.5',
}

export default function GlowButton({
  href,
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
  'aria-label': ariaLabel,
}: GlowButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.965 }}
      className="relative inline-flex"
    >
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      >
        {/* Inner shimmer for primary — the glow lives on the element itself via animate-pulse-ember */}
        {variant === 'primary' && (
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ember via-ember-bright to-ember opacity-0 hover:opacity-100 transition-opacity duration-300"
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Link>
    </motion.div>
  )
}
