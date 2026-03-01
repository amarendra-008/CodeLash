'use client'

/* ═══════════════════════════════════════════════════
   DIFFICULTY TOGGLES
   Controlled by react-hook-form Controller.
   Receives value/onChange directly — no internal state.

   Easy   → green  (#22c55e)
   Medium → amber  (#f59e0b)
   Hard   → red    (#ef4444 / ember)

   Accessibility: role="group", aria-pressed per button,
   keyboard-navigable (Tab + Enter/Space).
   ═══════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

interface DifficultyTogglesProps {
  value: Difficulty[]
  onChange: (val: Difficulty[]) => void
  error?: string
}

const DIFFICULTIES: {
  value: Difficulty
  label: string
  description: string
  activeClass: string
  inactiveClass: string
  glowStyle: string
}[] = [
  {
    value: 'Easy',
    label: 'Easy',
    description: 'Warm-up only.',
    activeClass: 'bg-green-950/50 border-green-500 text-green-400',
    inactiveClass:
      'bg-transparent border-[#1a1a1a] text-[#555] hover:border-green-900 hover:text-green-700',
    glowStyle: '0 0 20px rgba(34,197,94,0.3)',
  },
  {
    value: 'Medium',
    label: 'Medium',
    description: 'Real pressure.',
    activeClass: 'bg-amber-950/50 border-amber-500 text-amber-400',
    inactiveClass:
      'bg-transparent border-[#1a1a1a] text-[#555] hover:border-amber-900 hover:text-amber-600',
    glowStyle: '0 0 20px rgba(245,158,11,0.3)',
  },
  {
    value: 'Hard',
    label: 'Hard',
    description: 'Either you rise.',
    activeClass: 'bg-red-950/50 border-red-600 text-red-400',
    inactiveClass:
      'bg-transparent border-[#1a1a1a] text-[#555] hover:border-red-900 hover:text-red-700',
    glowStyle: '0 0 20px rgba(239,68,68,0.35)',
  },
]

export default function DifficultyToggles({
  value: valueProp,
  onChange,
  error,
}: DifficultyTogglesProps) {
  const value = valueProp ?? []
  const toggle = (diff: Difficulty) => {
    if (value.includes(diff)) {
      onChange(value.filter((d) => d !== diff))
    } else {
      onChange([...value, diff])
    }
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Select difficulty levels"
        className="flex gap-3 flex-wrap"
      >
        {DIFFICULTIES.map(({ value: diff, label, description, activeClass, inactiveClass, glowStyle }) => {
          const active = value.includes(diff)
          return (
            <motion.button
              key={diff}
              type="button"
              onClick={() => toggle(diff)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              aria-pressed={active}
              style={active ? { boxShadow: glowStyle } : undefined}
              className={cn(
                'relative flex flex-col items-start gap-0.5 px-8 py-4 border',
                'font-condensed tracking-[0.12em] uppercase text-sm',
                'transition-all duration-200 cursor-pointer min-w-[110px]',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4',
                active ? activeClass : inactiveClass,
              )}
            >
              {/* Active blink dot */}
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-current animate-rec-blink"
                />
              )}
              <span className="font-bold">{label}</span>
              <span
                className={cn(
                  'text-[10px] tracking-wide normal-case font-normal transition-opacity duration-200',
                  active ? 'opacity-60' : 'opacity-0',
                )}
              >
                {description}
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* Zod error */}
      {error && (
        <p role="alert" className="mt-2 font-condensed text-xs text-red-400 tracking-wider">
          {error}
        </p>
      )}
    </div>
  )
}
