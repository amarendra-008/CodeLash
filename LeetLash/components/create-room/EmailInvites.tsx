'use client'

/* ═══════════════════════════════════════════════════
   EMAIL INVITES
   Chip-based email input. Press Enter or comma to add.
   Each chip dismissible. Validates RFC-style email.
   "Bring your competition."
   ═══════════════════════════════════════════════════ */

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, X, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmailInvitesProps {
  emails: string[]
  onChange: (emails: string[]) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function EmailInvites({ emails, onChange }: EmailInvitesProps) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const addEmail = () => {
    const trimmed = input.trim().toLowerCase()
    if (!trimmed) return
    if (!EMAIL_RE.test(trimmed)) {
      setError('Not a valid email.')
      return
    }
    if (emails.includes(trimmed)) {
      setError('Already on the list.')
      return
    }
    onChange([...emails, trimmed])
    setInput('')
    setError(null)
    inputRef.current?.focus()
  }

  const removeEmail = (email: string) => {
    onChange(emails.filter((e) => e !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); addEmail() }
    if (e.key === ',')     { e.preventDefault(); addEmail() }
    if (e.key === 'Backspace' && !input && emails.length > 0) {
      // Remove last chip on backspace
      onChange(emails.slice(0, -1))
    }
    // Clear error on any typing
    if (error) setError(null)
  }

  return (
    <div className="space-y-3" aria-label="Invite by email">
      {/* Input row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="email"
            value={input}
            onChange={(e) => { setInput(e.target.value); if (error) setError(null) }}
            onKeyDown={handleKeyDown}
            placeholder="rival@email.com"
            aria-label="Enter email to invite"
            aria-invalid={!!error}
            aria-describedby={error ? 'invite-email-error' : undefined}
            className={cn(
              'w-full bg-obsidian font-condensed text-sm text-parchment tracking-wider',
              'pl-10 pr-4 py-3.5 border outline-none transition-all duration-200',
              'placeholder:text-charcoal',
              error
                ? 'border-ember focus:border-ember-bright'
                : 'border-ash hover:border-ember/30 focus:border-ember/60',
            )}
          />
        </div>

        <motion.button
          type="button"
          onClick={addEmail}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Add email to invite list"
          className={cn(
            'flex items-center gap-2 font-condensed text-xs tracking-[0.15em] uppercase',
            'px-5 py-3.5 border border-ash hover:border-ember text-slate hover:text-parchment',
            'transition-all duration-200 focus-visible:outline focus-visible:outline-2',
            'focus-visible:outline-ember focus-visible:outline-offset-4',
          )}
        >
          <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Add</span>
        </motion.button>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            id="invite-email-error"
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="font-condensed text-xs text-ember tracking-wider"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Helper text */}
      {emails.length === 0 && !error && (
        <p className="font-condensed text-xs text-charcoal tracking-wider">
          Press Enter or comma to add multiple. They'll receive an invite link when multiplayer goes live.
        </p>
      )}

      {/* Email chips */}
      {emails.length > 0 && (
        <motion.ul
          layout
          className="flex flex-wrap gap-2"
          aria-label={`${emails.length} invited email${emails.length !== 1 ? 's' : ''}`}
        >
          <AnimatePresence>
            {emails.map((email) => (
              <motion.li
                key={email}
                layout
                initial={{ opacity: 0, scale: 0.82, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.82 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-2 bg-cinder border border-lead font-condensed text-xs tracking-wider text-bone px-3 py-2"
              >
                <span
                  aria-hidden="true"
                  className="w-1 h-1 rounded-full bg-flame-bright"
                />
                {email}
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  aria-label={`Remove ${email} from invite list`}
                  className="text-charcoal hover:text-ember-bright transition-colors ml-0.5 cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {/* Count summary */}
      {emails.length > 0 && (
        <p className="font-condensed text-xs text-charcoal tracking-wider">
          {emails.length} rival{emails.length !== 1 ? 's' : ''} invited.{' '}
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-ember/60 hover:text-ember transition-colors underline underline-offset-2"
          >
            Clear all
          </button>
        </p>
      )}
    </div>
  )
}
