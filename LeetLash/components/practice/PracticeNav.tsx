'use client'

/* ═══════════════════════════════════════════════════
   PRACTICE NAV
   Fixed top bar for the practice room.
   Left:   CODELASH logo + REC dot
   Centre: Problem title (truncated)
   Right:  Difficulty filter  •  Next Problem  •  Timer
   ═══════════════════════════════════════════════════ */

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Drum, SkipForward, Users, MessageSquare, BarChart2 } from 'lucide-react'
import Timer from './Timer'
import { cn } from '@/lib/utils'

interface PracticeNavProps {
  problemTitle: string
  timerSeconds: number
  onNextProblem: () => void
  hasRoom?: boolean
  onRoomToggle?: () => void
  onInterviewToggle?: () => void
}

export default function PracticeNav({
  problemTitle,
  timerSeconds,
  onNextProblem,
  hasRoom,
  onRoomToggle,
  onInterviewToggle,
}: PracticeNavProps) {
  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 inset-x-0 z-50 h-14 flex items-center bg-obsidian/95 backdrop-blur-sm border-b border-ash"
      role="banner"
    >
      <div className="w-full px-4 md:px-6 flex items-center gap-4">

        {/* ── Logo ─────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 group flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
          aria-label="CodeLash — return to home"
        >
          <Drum
            className="w-4 h-4 text-ember transition-transform duration-300 group-hover:rotate-12"
            aria-hidden="true"
          />
          <span className="font-display text-xl tracking-wider text-parchment group-hover:text-bone transition-colors hidden sm:block">
            CODE<span className="text-ember">LASH</span>
          </span>

          {/* REC dot */}
          <span
            className="flex items-center gap-1 ml-0.5"
            title="Practice in session"
            aria-hidden="true"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-rec-blink" />
          </span>
        </Link>

        {/* Divider */}
        <span
          className="hidden md:block w-px h-5 bg-ash flex-shrink-0"
          aria-hidden="true"
        />

        {/* ── Practice Room label ───────────────────── */}
        <span className="hidden md:block font-condensed text-xs tracking-[0.18em] uppercase text-charcoal flex-shrink-0">
          Practice Room
        </span>

        {/* ── Problem title (centre, truncated) ─────── */}
        <div
          className="flex-1 min-w-0 mx-2 hidden lg:block"
          aria-live="polite"
          aria-label={`Current problem: ${problemTitle}`}
        >
          <p className="font-condensed text-sm text-dust tracking-wide truncate text-center">
            {problemTitle}
          </p>
        </div>

        {/* ── Right controls ────────────────────────── */}
        <div className="flex items-center gap-3 ml-auto flex-shrink-0">

          {/* Profile link */}
          <Link
            href="/profile"
            className={cn(
              'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
              'text-dust border border-ash px-3 py-1.5',
              'hover:text-parchment hover:border-lead transition-colors duration-150',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
            )}
            aria-label="View your profile and progress"
          >
            <BarChart2 className="w-3 h-3" aria-hidden="true" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          {/* Interview / Chat button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onInterviewToggle}
            className={cn(
              'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
              'text-dust border border-ash px-3 py-1.5',
              'hover:text-parchment hover:border-lead transition-colors duration-150',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
            )}
            aria-label="Open interview chat"
          >
            <MessageSquare className="w-3 h-3" aria-hidden="true" />
            <span className="hidden sm:inline">Interview</span>
          </motion.button>

          {/* Room button — only shown when a room is active */}
          {hasRoom && (
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={onRoomToggle}
              className={cn(
                'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
                'text-ember border border-ember/30 px-3 py-1.5',
                'hover:border-ember/70 hover:bg-ember/10 transition-colors duration-150',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
              )}
              aria-label="View room details and invite"
            >
              <Users className="w-3 h-3" aria-hidden="true" />
              <span className="hidden sm:inline">Room</span>
            </motion.button>
          )}

          {/* Next problem button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onNextProblem}
            className={cn(
              'flex items-center gap-1.5 font-condensed text-xs tracking-[0.12em] uppercase',
              'text-dust border border-ash px-3 py-1.5',
              'hover:text-parchment hover:border-lead transition-colors duration-150',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
            )}
            aria-label="Load next random problem"
          >
            <SkipForward className="w-3 h-3" aria-hidden="true" />
            <span className="hidden sm:inline">Next</span>
          </motion.button>

          {/* Thin vertical separator */}
          <span className="w-px h-5 bg-ash" aria-hidden="true" />

          {/* Timer */}
          <Timer seconds={timerSeconds} aria-live="off" />
        </div>
      </div>
    </motion.header>
  )
}
