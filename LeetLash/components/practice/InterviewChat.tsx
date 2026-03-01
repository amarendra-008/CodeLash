'use client'

/* ═══════════════════════════════════════════════════
   INTERVIEW CHAT
   Slide-out panel housing a multi-turn AI conversation.

   Two modes:
   • INTERVIEWER — probes understanding, no answers.
   • COACH       — teaching mode after failure/timeout.

   The practice page drives mode transitions; the user
   can also switch manually via the header toggle.
   ═══════════════════════════════════════════════════ */

import {
  useState, useEffect, useRef, useCallback,
  forwardRef, useImperativeHandle,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Mic, GraduationCap, RefreshCw, ChevronDown } from 'lucide-react'
import type { Problem } from '@/lib/problems'

/* ── Types ─────────────────────────────────────────── */

export type ChatMode = 'interviewer' | 'coach'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  timestamp: Date
}

export interface InterviewChatHandle {
  triggerEvent: (event: 'submit_fail' | 'submit_pass' | 'timeout') => void
}

interface InterviewChatProps {
  problem: Problem
  code: string
  language: string
  isOpen: boolean
  onClose: () => void
  onMessageSent?: () => void
}

/* ── Helpers ───────────────────────────────────────── */

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const MODE_LABEL: Record<ChatMode, string> = {
  interviewer: 'Interviewer',
  coach: 'Coach',
}

const MODE_COLOR: Record<ChatMode, string> = {
  interviewer: '#c8102e',
  coach: '#fb923c',
}

/* ── Component ─────────────────────────────────────── */

const InterviewChat = forwardRef<InterviewChatHandle, InterviewChatProps>(
  function InterviewChat({ problem, code, language, isOpen, onClose, onMessageSent }, ref) {
    const [mode, setMode] = useState<ChatMode>('interviewer')
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [initialized, setInitialized] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    /* Scroll to bottom on new messages */
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    /* Auto-focus input when open */
    useEffect(() => {
      if (isOpen) setTimeout(() => textareaRef.current?.focus(), 100)
    }, [isOpen])

    /* Core send function */
    const sendToAPI = useCallback(async (
      event: string,
      userText: string,
      currentMode: ChatMode,
      currentMessages: ChatMessage[],
    ) => {
      setLoading(true)
      try {
        const history = currentMessages.map((m) => ({
          role: m.role === 'ai' ? ('model' as const) : ('user' as const),
          text: m.text,
        }))

        const res = await fetch('/api/gemini/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            problem: {
              title: problem.title,
              content: problem.content,
            },
            code,
            language,
            history,
            mode: currentMode,
            event,
            userMessage: userText,
          }),
        })

        const data = await res.json() as { message?: string; error?: string }
        const text = data.message ?? data.error ?? 'No response received.'

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          text,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMsg])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-err-${Date.now()}`,
            role: 'ai',
            text: "Connection dropped. Check your network and try again.",
            timestamp: new Date(),
          },
        ])
      } finally {
        setLoading(false)
      }
    }, [problem, code, language])

    /* Initialize interview on first open */
    useEffect(() => {
      if (isOpen && !initialized) {
        setInitialized(true)
        sendToAPI('start', '', 'interviewer', [])
      }
    }, [isOpen, initialized, sendToAPI])

    /* Expose trigger for external events (submit, timeout) */
    useImperativeHandle(ref, () => ({
      triggerEvent: (event: 'submit_fail' | 'submit_pass' | 'timeout') => {
        const nextMode: ChatMode = event === 'submit_pass' ? 'interviewer' : 'coach'
        setMode(nextMode)

        const systemNote: ChatMessage = {
          id: `sys-${Date.now()}`,
          role: 'user',
          text: event === 'submit_fail'
            ? '[ Code submitted — incorrect ]'
            : event === 'submit_pass'
            ? '[ Code submitted — correct ]'
            : '[ Time\'s up ]',
          timestamp: new Date(),
        }
        setMessages((prev) => {
          // Pass prev as history (not updated) — the event turn is built
          // by buildUserTurn in the API route, not from the system note
          sendToAPI(event, '', nextMode, prev)
          return [...prev, systemNote]
        })
      },
    }))

    /* Switch mode manually */
    const switchMode = () => {
      const next: ChatMode = mode === 'interviewer' ? 'coach' : 'interviewer'
      setMode(next)
      const note: ChatMessage = {
        id: `sys-switch-${Date.now()}`,
        role: 'user',
        text: next === 'coach'
          ? '[ Switching to Coach mode — I need help ]'
          : '[ Switching back to Interviewer mode ]',
        timestamp: new Date(),
      }
      setMessages((prev) => {
        sendToAPI('message', note.text, next, prev)
        return [...prev, note]
      })
    }

    /* Send a user message */
    const sendMessage = () => {
      const text = input.trim()
      if (!text || loading) return

      onMessageSent?.()

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text,
        timestamp: new Date(),
      }
      setInput('')
      setMessages((prev) => {
        sendToAPI('message', text, mode, prev)
        return [...prev, userMsg]
      })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    }

    /* Reset conversation */
    const resetChat = () => {
      setMessages([])
      setInitialized(false)
      setMode('interviewer')
      setInput('')
    }

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop — no blur so the editor stays readable */}
            <motion.div
              key="chat-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.aside
              key="chat-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[420px] flex flex-col bg-[#080808] border-l border-ash"
              role="complementary"
              aria-label="AI Interview Chat"
            >
              {/* ── Header ──────────────────────────── */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-ash flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mode badge */}
                  <div
                    className="flex items-center gap-2 px-2.5 py-1 border"
                    style={{
                      borderColor: `${MODE_COLOR[mode]}40`,
                      backgroundColor: `${MODE_COLOR[mode]}0d`,
                    }}
                  >
                    {mode === 'coach'
                      ? <GraduationCap className="w-3 h-3 flex-shrink-0" style={{ color: MODE_COLOR[mode] }} aria-hidden="true" />
                      : <Mic className="w-3 h-3 flex-shrink-0" style={{ color: MODE_COLOR[mode] }} aria-hidden="true" />
                    }
                    <span
                      className="font-condensed text-[11px] tracking-[0.2em] uppercase"
                      style={{ color: MODE_COLOR[mode] }}
                    >
                      {MODE_LABEL[mode]}
                    </span>
                  </div>

                  {/* Problem title */}
                  <span className="font-condensed text-xs text-charcoal tracking-wide truncate max-w-[140px]">
                    {problem.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Switch mode */}
                  <button
                    type="button"
                    onClick={switchMode}
                    title={mode === 'interviewer' ? 'Switch to Coach' : 'Switch to Interviewer'}
                    className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal
                      hover:text-slate transition-colors px-2 py-1 border border-transparent hover:border-ash"
                  >
                    {mode === 'interviewer' ? 'Need help?' : 'Back to interview'}
                  </button>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={resetChat}
                    aria-label="Reset conversation"
                    className="text-charcoal hover:text-slate transition-colors p-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close chat"
                    className="text-charcoal hover:text-slate transition-colors p-1
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Messages ────────────────────────── */}
              <div
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
                aria-live="polite"
                aria-label="Conversation"
              >
                {messages.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <Mic className="w-8 h-8 text-charcoal/50" aria-hidden="true" />
                    <p className="font-condensed text-xs text-charcoal tracking-wider">
                      Connecting to your interviewer…
                    </p>
                  </div>
                )}

                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const isSystem = msg.text.startsWith('[')
                    const isUser = msg.role === 'user'

                    if (isSystem) {
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-center"
                        >
                          <span className="font-condensed text-[10px] tracking-[0.15em] text-charcoal/60 uppercase px-3 py-1 border border-ash/40 bg-cinder/30">
                            {msg.text.replace(/^\[|\]$/g, '')}
                          </span>
                        </motion.div>
                      )
                    }

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        {/* Sender label */}
                        <span className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal/60 px-1">
                          {isUser ? 'You' : MODE_LABEL[mode]}
                          {' · '}
                          {formatTime(msg.timestamp)}
                        </span>

                        {/* Bubble */}
                        <div
                          className={`max-w-[88%] px-4 py-3 font-condensed text-sm tracking-wide leading-relaxed ${
                            isUser
                              ? 'text-parchment border border-ember/20 bg-ember/8'
                              : 'text-bone border border-ash bg-cinder/60'
                          }`}
                          style={isUser ? { backgroundColor: 'rgba(200,16,46,0.07)' } : undefined}
                        >
                          {msg.text.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < msg.text.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {/* Typing indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-start gap-1"
                  >
                    <span className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal/60 px-1">
                      {MODE_LABEL[mode]}
                    </span>
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-cinder/60 border border-ash">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-charcoal"
                          style={{ animation: `breathe 1.2s ease-in-out ${i * 0.2}s infinite` }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* ── Scroll to bottom button ─────────── */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="absolute bottom-2 right-4 text-charcoal hover:text-slate transition-colors
                    bg-cinder border border-ash p-1.5 opacity-0 pointer-events-none"
                  aria-label="Scroll to latest message"
                  tabIndex={-1}
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* ── Input ───────────────────────────── */}
              <div className="flex-shrink-0 border-t border-ash">
                {/* Mode transition hint */}
                <AnimatePresence>
                  {mode === 'coach' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 py-2 border-b border-ash overflow-hidden"
                      style={{ backgroundColor: 'rgba(251,146,60,0.06)' }}
                    >
                      <p className="font-condensed text-[10px] tracking-[0.15em] uppercase text-amber-500/70">
                        Coach mode — ask for hints, explanations, or approach guidance
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-0">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      mode === 'interviewer'
                        ? 'Talk through your approach…'
                        : 'Ask for a hint or explanation…'
                    }
                    rows={2}
                    disabled={loading}
                    className="flex-1 bg-transparent px-4 py-3 font-condensed text-sm text-parchment
                      placeholder:text-charcoal tracking-wider outline-none resize-none
                      disabled:opacity-50 leading-relaxed"
                    aria-label="Your message"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    aria-label="Send message"
                    className="flex-shrink-0 flex items-center justify-center w-12 border-l border-ash
                      text-charcoal hover:text-ember transition-colors duration-150
                      disabled:opacity-30 disabled:cursor-not-allowed
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="px-4 pb-2 font-condensed text-[10px] text-charcoal/50 tracking-wider">
                  Enter to send · Shift+Enter for new line
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    )
  },
)

export default InterviewChat
