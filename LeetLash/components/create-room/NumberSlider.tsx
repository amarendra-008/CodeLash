'use client'

/* ═══════════════════════════════════════════════════
   NUMBER SLIDER
   Ember-styled range input for selecting problem count.
   Track fill is a CSS gradient trick — no custom
   pseudo-element hacks needed.
   ═══════════════════════════════════════════════════ */

import { motion, AnimatePresence } from 'framer-motion'

interface NumberSliderProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
}

// Taunts that scale with problem count — Fletcher energy
const TAUNTS: Record<number, string> = {
  1:  'One problem. Are you serious.',
  3:  'Three. Warming up.',
  5:  'Five. Standard.',
  8:  'Eight. Now we\'re talking.',
  10: 'Ten. You want punishment.',
  15: 'Fifteen. Masochist.',
  20: 'Twenty. Not my tempo yet.',
}

function getTaunt(val: number): string {
  const keys = Object.keys(TAUNTS).map(Number).sort((a, b) => a - b)
  let best = keys[0]
  for (const k of keys) {
    if (val >= k) best = k
  }
  return TAUNTS[best]
}

export default function NumberSlider({
  value,
  onChange,
  min = 1,
  max = 20,
}: NumberSliderProps) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="space-y-5">
      {/* Big number display */}
      <div className="flex items-end gap-3">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -10, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.92 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-8xl text-ember leading-none tabular-nums"
            aria-live="polite"
            aria-atomic="true"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <div className="pb-2">
          <p className="font-condensed text-sm tracking-[0.2em] uppercase text-bone">
            {value === 1 ? 'problem' : 'problems'}
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={getTaunt(value)}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-condensed text-xs text-charcoal tracking-wider italic"
            >
              {getTaunt(value)}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="room-slider w-full"
          style={{
            // Gradient track fill: ember up to thumb, ash after
            background: `linear-gradient(to right, #c8102e 0%, #c8102e ${pct}%, #1a1a1a ${pct}%, #1a1a1a 100%)`,
          }}
          aria-label="Number of problems"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value} ${value === 1 ? 'problem' : 'problems'}`}
        />
      </div>

      {/* Scale labels */}
      <div className="flex justify-between">
        <span className="font-condensed text-xs text-fog tracking-wider">{min}</span>
        {[5, 10, 15].map((mark) => (
          <span key={mark} className="font-condensed text-xs text-fog tracking-wider">
            {mark}
          </span>
        ))}
        <span className="font-condensed text-xs text-fog tracking-wider">{max}</span>
      </div>
    </div>
  )
}
