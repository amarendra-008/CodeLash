'use client'

/* ═══════════════════════════════════════════════════
   DIFFICULTY SELECTOR
   Three toggle buttons — Easy/Medium/Hard.
   Color-coded: green / orange / crimson.
   Multi-select: press multiple to stack difficulties.
   ═══════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { Difficulty } from '@/lib/problems'

interface DifficultySelectorProps {
  selected: Difficulty[]
  onChange: (difficulties: Difficulty[]) => void
}

const DIFFICULTIES: {
  value: Difficulty
  label: string
  description: string
  activeClass: string
  inactiveClass: string
  glowColor: string
}[] = [
  {
    value: 'Easy',
    label: 'Easy',
    description: 'Warm-up. No excuses.',
    activeClass: 'bg-green-950/60 border-green-500 text-green-400 shadow-[0_0_18px_rgba(34,197,94,0.35)]',
    inactiveClass: 'bg-transparent border-ash text-charcoal hover:border-green-900 hover:text-green-700',
    glowColor: 'rgba(34,197,94,0.3)',
  },
  {
    value: 'Medium',
    label: 'Medium',
    description: 'Real pressure starts here.',
    activeClass: 'bg-orange-950/60 border-[#e85d04] text-[#f97316] shadow-[0_0_18px_rgba(232,93,4,0.4)]',
    inactiveClass: 'bg-transparent border-ash text-charcoal hover:border-[#9a3d00] hover:text-[#e85d04]',
    glowColor: 'rgba(232,93,4,0.3)',
  },
  {
    value: 'Hard',
    label: 'Hard',
    description: 'Either you rise or you don\'t.',
    activeClass: 'bg-ember-muted border-ember text-ember-bright shadow-ember',
    inactiveClass: 'bg-transparent border-ash text-charcoal hover:border-ember-dim hover:text-ember',
    glowColor: 'rgba(200,16,46,0.35)',
  },
]

export default function DifficultySelector({
  selected,
  onChange,
}: DifficultySelectorProps) {
  const toggle = (diff: Difficulty) => {
    if (selected.includes(diff)) {
      onChange(selected.filter((d) => d !== diff))
    } else {
      onChange([...selected, diff])
    }
  }

  return (
    <div
      role="group"
      aria-label="Select difficulty levels"
      className="flex gap-3 flex-wrap"
    >
      {DIFFICULTIES.map(({ value, label, description, activeClass, inactiveClass }) => {
        const active = selected.includes(value)
        return (
          <motion.button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            aria-pressed={active}
            className={cn(
              'relative flex flex-col items-start gap-0.5 font-condensed tracking-[0.12em] uppercase',
              'px-7 py-4 border transition-all duration-200 cursor-pointer min-w-[120px]',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4',
              active ? activeClass : inactiveClass,
            )}
          >
            {/* Active indicator dot */}
            {active && (
              <motion.span
                layoutId={`diff-dot-${value}`}
                className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-current animate-rec-blink"
                aria-hidden="true"
              />
            )}
            <span className="text-sm font-bold">{label}</span>
            <span className={cn(
              'text-[10px] tracking-wider normal-case font-normal transition-opacity duration-200',
              active ? 'opacity-70' : 'opacity-0'
            )}>
              {description}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
