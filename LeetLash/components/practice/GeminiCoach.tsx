'use client'

/* ═══════════════════════════════════════════════════
   GEMINI COACH — FLETCHER PANEL
   Collapsible bottom panel in the right column.
   Shows brutal AI feedback with dramatic entrance.
   Fletcher's words appear one message at a time,
   styled like a stage director's note — cold, precise.
   ═══════════════════════════════════════════════════ */

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CoachMessage {
  id: string
  feedback: string
  timestamp: Date
}

interface GeminiCoachProps {
  messages: CoachMessage[]
  isOpen: boolean
  isLoading: boolean
  onToggle: () => void
  className?: string
}

/* Fletcher loading phrases — cycling while Gemini thinks */
const LOADING_PHRASES = [
  'Analyzing your mistakes…',
  'Processing your mediocrity…',
  'Finding every flaw…',
  'Preparing judgment…',
]

export default function GeminiCoach({
  messages,
  isOpen,
  isLoading,
  onToggle,
  className,
}: GeminiCoachProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const loadingPhrase =
    LOADING_PHRASES[Math.floor(Date.now() / 1500) % LOADING_PHRASES.length]

  /* Auto-scroll to latest message */
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const latestMessage = messages[messages.length - 1]
  const unreadCount = messages.length

  return (
    <div
      className={cn(
        'flex-shrink-0 flex flex-col border-t border-ash',
        // Loading state — panel border throbs red
        isLoading && 'border-ember/50',
        'transition-colors duration-300',
        className,
      )}
    >
      {/* ── Header bar — always visible ───────────── */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          'flex items-center gap-3 w-full px-4 py-2.5',
          'font-condensed text-xs tracking-[0.15em] uppercase',
          'hover:bg-ash/50 transition-colors duration-150',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-[-2px]',
          isLoading ? 'bg-ember/8' : 'bg-cinder/60',
        )}
        aria-expanded={isOpen}
        aria-controls="fletcher-panel"
        aria-label={`${isOpen ? 'Collapse' : 'Expand'} Fletcher AI Coach panel`}
      >
        {/* Icon */}
        <Sparkles
          className={cn(
            'w-3.5 h-3.5 flex-shrink-0',
            isLoading ? 'text-ember animate-breathe' : 'text-ember',
          )}
          aria-hidden="true"
        />

        {/* Label */}
        <span
          className={cn(
            isLoading ? 'text-ember' : 'text-charcoal',
            'transition-colors',
          )}
        >
          {isLoading ? loadingPhrase : 'Fletcher'}
        </span>

        {/* Message count badge */}
        {unreadCount > 0 && !isLoading && (
          <span
            className="flex items-center justify-center w-4 h-4 bg-ember/20 border border-ember/30 text-ember font-mono"
            style={{ fontSize: '9px' }}
            aria-label={`${unreadCount} feedback message${unreadCount !== 1 ? 's' : ''}`}
          >
            {unreadCount}
          </span>
        )}

        {/* Preview of latest message when collapsed */}
        {!isOpen && latestMessage && !isLoading && (
          <span className="flex-1 text-left text-lead truncate ml-1">
            {latestMessage.feedback.split('\n')[0].slice(0, 55)}
            {latestMessage.feedback.length > 55 ? '…' : ''}
          </span>
        )}

        {/* Spacer */}
        <span className="flex-1" />

        {/* Chevron */}
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-charcoal" aria-hidden="true" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-charcoal" aria-hidden="true" />
        )}
      </button>

      {/* ── Expandable message area ────────────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id="fletcher-panel"
            role="region"
            aria-label="Fletcher AI Coach feedback"
            key="coach-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              ref={scrollRef}
              className="max-h-[260px] overflow-y-auto p-4 space-y-4 bg-obsidian/40"
            >
              {/* Empty state */}
              {messages.length === 0 && !isLoading && (
                <div className="flex items-start gap-3 py-2">
                  <AlertTriangle
                    className="w-4 h-4 text-ember/40 mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <p className="font-condensed text-xs text-lead tracking-wide italic">
                    Submit your code. Fletcher is watching. Always watching.
                  </p>
                </div>
              )}

              {/* Loading skeleton */}
              {isLoading && (
                <div className="space-y-2 animate-pulse" aria-live="polite" aria-label="Loading feedback">
                  <div className="h-2 bg-ember/15 rounded-none w-3/4" />
                  <div className="h-2 bg-ember/10 rounded-none w-full" />
                  <div className="h-2 bg-ember/10 rounded-none w-2/3" />
                  <div className="h-2 bg-ember/8 rounded-none w-4/5" />
                </div>
              )}

              {/* Message list */}
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                    delay: i === messages.length - 1 ? 0 : 0,
                  }}
                  className={cn(
                    'space-y-2 pb-4',
                    i < messages.length - 1 && 'border-b border-ash/50',
                  )}
                >
                  {/* Fletcher header */}
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xs tracking-[0.2em] text-ember uppercase">
                      Fletcher
                    </span>
                    <span className="text-charcoal font-mono text-xs">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {/* Latest marker */}
                    {i === messages.length - 1 && (
                      <span className="ml-auto font-condensed text-xs text-ember/50 tracking-widest uppercase">
                        latest
                      </span>
                    )}
                  </div>

                  {/* Feedback text */}
                  <div
                    className={cn(
                      'coach-message',
                      // Latest message is brightest
                      i === messages.length - 1 ? 'text-bone' : 'text-lead',
                      // Slightly dimmed past messages
                      i < messages.length - 1 && 'opacity-60',
                    )}
                    aria-live={i === messages.length - 1 ? 'polite' : undefined}
                  >
                    {msg.feedback}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
