'use client'

/* ═══════════════════════════════════════════════════
   EMAIL CHIPS
   Controlled by react-hook-form Controller.
   Each email in value[] is already validated by zod.
   Component validates format locally before adding.

   UX: Enter / comma key adds email.
   Backspace on empty input removes last chip.

   Future: send real invite emails via Resend/SendGrid
   through /api/invite route.
   ═══════════════════════════════════════════════════ */

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailChipsProps {
  value: string[]
  onChange: (emails: string[]) => void
  error?: string
}

// RFC-lite email validator — zod will catch edge cases
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

export default function EmailChips({ value: valueProp, onChange, error }: EmailChipsProps) {
  const value = valueProp ?? []
  const [input, setInput] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addEmail = () => {
    const trimmed = input.trim().toLowerCase()
    if (!trimmed) return
    if (!isEmail(trimmed)) {
      setLocalError('Not a valid email address.')
      return
    }
    if (value.includes(trimmed)) {
      setLocalError('Already on the list.')
      return
    }
    onChange([...value, trimmed])
    setInput('')
    setLocalError(null)
    inputRef.current?.focus()
  }

  const removeEmail = (email: string) => {
    onChange(value.filter((e) => e !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addEmail() }
    if (e.key === ',')     { e.preventDefault(); addEmail() }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1))
    }
    if (localError) setLocalError(null)
  }

  const displayError = localError ?? error

  return (
    <div className="space-y-3">
      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3d3d3d] pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="email"
            value={input}
            onChange={(e) => { setInput(e.target.value); if (localError) setLocalError(null) }}
            onKeyDown={handleKeyDown}
            placeholder="rival@email.com"
            aria-label="Invite email address"
            aria-invalid={!!displayError}
            aria-describedby={displayError ? 'email-chip-error' : undefined}
            className={cn(
              'w-full bg-[#0a0a0a] font-condensed text-sm text-[#f0e6d3] tracking-wider',
              'pl-10 pr-4 py-3.5 border outline-none transition-all duration-200',
              'placeholder:text-[#3d3d3d]',
              displayError
                ? 'border-red-600 focus:border-red-500'
                : 'border-[#1a1a1a] hover:border-[#c8102e]/25 focus:border-[#c8102e]/50',
            )}
          />
        </div>

        <motion.button
          type="button"
          onClick={addEmail}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add email to invite list"
          className="flex items-center gap-2 font-condensed text-xs tracking-[0.15em] uppercase
            px-5 py-3.5 border border-[#1a1a1a] text-[#555] hover:border-[#c8102e]/50 hover:text-[#f0e6d3]
            transition-all duration-200
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8102e] focus-visible:outline-offset-4"
        >
          <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Add</span>
        </motion.button>
      </div>

      {/* Error */}
      <AnimatePresence>
        {displayError && (
          <motion.p
            id="email-chip-error"
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="font-condensed text-xs text-red-400 tracking-wider"
          >
            {displayError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Helper */}
      {value.length === 0 && !displayError && (
        <p className="font-condensed text-xs text-[#3d3d3d] tracking-wider">
          Press Enter or comma to add. Or share the room link once created.
        </p>
      )}

      {/* Chips */}
      {value.length > 0 && (
        <motion.ul
          layout
          className="flex flex-wrap gap-2"
          aria-label={`${value.length} invited rival${value.length !== 1 ? 's' : ''}`}
        >
          <AnimatePresence>
            {value.map((email) => (
              <motion.li
                key={email}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-2 bg-[#111] border border-[#2a2a2a]
                  font-condensed text-xs tracking-wider text-[#d4c9b8] px-3 py-2"
              >
                <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#e85d04]" />
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  aria-label={`Remove ${email}`}
                  className="text-[#3d3d3d] hover:text-red-400 transition-colors cursor-pointer ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {value.length > 0 && (
        <p className="font-condensed text-xs text-[#3d3d3d] tracking-wider">
          {value.length} rival{value.length !== 1 ? 's' : ''} invited.{' '}
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[#c8102e]/60 hover:text-[#c8102e] transition-colors underline underline-offset-2 cursor-pointer"
          >
            Clear all
          </button>
        </p>
      )}
    </div>
  )
}
