'use client'

/* ═══════════════════════════════════════════════════
   TIMER
   Countdown display with progressive pressure states.
   > 10 min : cool white
   5–10 min : flame orange (pulsing)
   < 5 min  : ember crimson (animate-timer-critical)
   0:00     : "TIME'S UP" — full red
   ═══════════════════════════════════════════════════ */

import { cn } from '@/lib/utils'

interface TimerProps {
  seconds: number
  className?: string
}

function formatTime(s: number): string {
  if (s <= 0) return '00:00'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function Timer({ seconds, className }: TimerProps) {
  const isDead = seconds <= 0
  const isCritical = seconds > 0 && seconds <= 300      // < 5 min
  const isWarning = seconds > 300 && seconds <= 600     // 5–10 min

  return (
    <div
      className={cn('flex items-center gap-2 select-none', className)}
      aria-live="polite"
      aria-label={`Time remaining: ${formatTime(seconds)}`}
    >
      {/* Blinking dot — pressure indicator */}
      <span
        aria-hidden="true"
        className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          isDead
            ? 'bg-ember opacity-0'
            : isCritical
              ? 'bg-ember animate-rec-blink'
              : isWarning
                ? 'bg-flame animate-breathe'
                : 'bg-slate opacity-50',
        )}
      />

      {/* Time display */}
      <span
        className={cn(
          'font-display tracking-widest tabular-nums',
          isDead
            ? 'text-ember text-sm'
            : isCritical
              ? 'text-ember animate-timer-critical text-sm'
              : isWarning
                ? 'text-flame-bright text-sm'
                : 'text-dust text-sm',
        )}
      >
        {isDead ? "TIME'S UP" : formatTime(seconds)}
      </span>
    </div>
  )
}
