'use client'

/* ═══════════════════════════════════════════════════
   CONTROLS BAR
   Language selector, Run, Submit, Reset.
   Submit is the focal point — ember red, always
   pulsing when the session is active.
   ═══════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { Play, Zap, RotateCcw, ChevronDown, Lightbulb, CheckCircle } from 'lucide-react'
import { type Language } from '@/lib/problems'
import { cn } from '@/lib/utils'

interface ControlsBarProps {
  language: Language
  onLanguageChange: (lang: Language) => void
  onRun: () => void
  onSubmit: () => void
  onReset: () => void
  onShowSolution: () => void
  onMarkSolved: () => void
  isSolved: boolean
  isSubmitLoading: boolean
  isRunLoading: boolean
  timerSeconds: number
  className?: string
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python 3' },
]

export default function ControlsBar({
  language,
  onLanguageChange,
  onRun,
  onSubmit,
  onReset,
  onShowSolution,
  onMarkSolved,
  isSolved,
  isSubmitLoading,
  isRunLoading,
  timerSeconds,
  className,
}: ControlsBarProps) {
  const isCritical = timerSeconds > 0 && timerSeconds <= 300
  const isDead = timerSeconds <= 0

  return (
    <div
      className={cn(
        'flex-shrink-0 flex items-center gap-2 px-4 py-2.5 border-t border-ash bg-cinder/80 backdrop-blur-sm overflow-x-auto',
        className,
      )}
      role="toolbar"
      aria-label="Code controls"
    >
      {/* ── Language selector ─────────────────────── */}
      <div className="relative flex-shrink-0">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className={cn(
            'appearance-none font-condensed text-xs tracking-wider uppercase',
            'bg-ash border border-smoke text-dust pl-3 pr-7 py-2',
            'hover:border-lead focus:border-ember focus:outline-none',
            'transition-colors duration-150 cursor-pointer',
          )}
          aria-label="Select programming language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-charcoal pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* ── Reset ─────────────────────────────────── */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onReset}
        className={cn(
          'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
          'text-charcoal border border-ash px-3 py-2',
          'hover:text-dust hover:border-smoke transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
        )}
        aria-label="Reset code to starter template"
        title="Reset to starter code"
      >
        <RotateCcw className="w-3 h-3" aria-hidden="true" />
        Reset
      </motion.button>

      {/* ── Dumb — reveal solution ─────────────────── */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onShowSolution}
        className={cn(
          'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
          'text-charcoal/60 border border-ash/60 px-3 py-2',
          'hover:text-amber-500/80 hover:border-amber-500/30 transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
        )}
        aria-label="Show solution"
        title="I give up — show me the solution"
      >
        <Lightbulb className="w-3 h-3" aria-hidden="true" />
        Dumb
      </motion.button>

      {/* ── Mark Solved ───────────────────────────── */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onMarkSolved}
        className={cn(
          'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
          'border px-3 py-2 transition-colors duration-150',
          isSolved
            ? 'text-emerald-400 border-emerald-400/40 cursor-default'
            : 'text-charcoal/60 border-ash/60 hover:text-emerald-500/80 hover:border-emerald-500/30',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
        )}
        aria-label={isSolved ? 'Already marked as solved' : 'Mark problem as solved'}
        title={isSolved ? 'Solved!' : 'Mark as solved'}
        disabled={isSolved}
      >
        <CheckCircle className="w-3 h-3" aria-hidden="true" />
        {isSolved ? 'Solved' : 'Mark'}
      </motion.button>

      {/* ── Run ───────────────────────────────────── */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onRun}
        disabled={isRunLoading}
        className={cn(
          'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
          'text-parchment border border-lead px-4 py-2',
          'hover:border-dust hover:text-bone transition-colors duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
        )}
        aria-label="Run code against test cases"
      >
        <Play
          className={cn('w-3 h-3', isRunLoading && 'animate-spin')}
          aria-hidden="true"
        />
        {isRunLoading ? 'Running…' : 'Run'}
      </motion.button>

      {/* ── Submit — the centrepiece ───────────────── */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={onSubmit}
        disabled={isSubmitLoading || isDead}
        className={cn(
          'relative flex items-center gap-2 font-condensed font-semibold text-xs tracking-[0.14em] uppercase',
          'bg-ember text-parchment border border-ember px-5 py-2 overflow-hidden',
          'hover:bg-ember-bright hover:shadow-ember transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parchment',
          // Intensify glow as time runs out
          !isSubmitLoading && !isDead && isCritical && 'shadow-ember animate-pulse-ember',
          isSubmitLoading && 'animate-submit-shake',
        )}
        aria-label="Submit code for AI feedback"
        aria-busy={isSubmitLoading}
      >
        {/* Shimmer layer */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-transparent via-parchment/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"
        />

        <Zap
          className={cn(
            'relative z-10 w-3.5 h-3.5',
            isSubmitLoading && 'animate-breathe',
          )}
          aria-hidden="true"
        />
        <span className="relative z-10">
          {isSubmitLoading ? 'Submitting…' : isDead ? "Time's Up" : 'Submit'}
        </span>
      </motion.button>
    </div>
  )
}
