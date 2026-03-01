'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Mail, Plus, Send, Hash, Target, Layers, Users } from 'lucide-react'
import type { RoomFormValues } from '@/components/create-room/RoomConfigForm'

interface StoredRoom extends RoomFormValues {
  roomId: string
  createdAt: number
  status: 'waiting' | 'active' | 'ended'
}

interface RoomPanelProps {
  room: StoredRoom | null
  roomId: string | null
  isOpen: boolean
  onClose: () => void
}

const DIFF_STYLE: Record<string, { color: string; border: string; bg: string }> = {
  Easy:   { color: '#4ade80', border: 'rgba(34,197,94,0.4)',   bg: 'rgba(34,197,94,0.08)'  },
  Medium: { color: '#fb923c', border: 'rgba(251,146,60,0.4)',  bg: 'rgba(251,146,60,0.08)' },
  Hard:   { color: '#f87171', border: 'rgba(248,113,113,0.4)', bg: 'rgba(248,113,113,0.08)'},
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RoomPanel({ room, roomId, isOpen, onClose }: RoomPanelProps) {
  const [copied, setCopied] = useState(false)
  const [extraEmails, setExtraEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const inviteUrl =
    typeof window !== 'undefined' && roomId
      ? `${window.location.origin}/room/${roomId}`
      : ''

  const copyLink = async () => {
    if (!inviteUrl) return
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* clipboard unavailable */ }
  }

  const addEmail = () => {
    const trimmed = emailInput.trim()
    if (!trimmed) return
    if (!EMAIL_RE.test(trimmed)) { setEmailError('Not a valid email.'); return }
    const all = [...(room?.emails ?? []), ...extraEmails]
    if (all.includes(trimmed)) { setEmailError('Already invited.'); return }
    setExtraEmails((p) => [...p, trimmed])
    setEmailInput('')
    setEmailError('')
    setSent(false)
  }

  const removeExtra = (email: string) =>
    setExtraEmails((p) => p.filter((e) => e !== email))

  const handleSend = () => {
    if (extraEmails.length === 0) return
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const allInvited = [...(room?.emails ?? []), ...extraEmails]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[380px] bg-obsidian border-l border-ash flex flex-col overflow-hidden"
            role="complementary"
            aria-label="Room details and invite"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-ash flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ember animate-rec-blink" aria-hidden="true" />
                <span className="font-condensed text-xs tracking-[0.25em] uppercase text-ember">
                  Room
                </span>
                {roomId && (
                  <span className="font-mono text-[10px] text-charcoal tracking-widest bg-cinder border border-ash px-2 py-0.5 truncate max-w-[140px]">
                    {roomId}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close room panel"
                className="text-charcoal hover:text-slate transition-colors p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto">
              {room ? (
                <div className="divide-y divide-ash">

                  {/* ── Details ───────────────────────── */}
                  <div className="px-5 py-5">
                    <p className="font-condensed text-[10px] tracking-[0.25em] uppercase text-charcoal mb-4 flex items-center gap-1.5">
                      <Layers className="w-3 h-3" aria-hidden="true" /> Details
                    </p>

                    {/* Problems + status */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-cinder border border-ash px-4 py-3">
                        <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-1 flex items-center gap-1">
                          <Hash className="w-2.5 h-2.5" aria-hidden="true" /> Problems
                        </p>
                        <p className="font-display text-3xl text-ember leading-none tabular-nums">
                          {room.numProblems}
                        </p>
                      </div>
                      <div className="bg-cinder border border-ash px-4 py-3">
                        <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-1">
                          Status
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-ember animate-rec-blink flex-shrink-0" aria-hidden="true" />
                          <span className="font-condensed text-sm text-parchment capitalize tracking-wide">
                            {room.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="mb-4">
                      <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-2 flex items-center gap-1">
                        <Target className="w-2.5 h-2.5" aria-hidden="true" /> Difficulty
                      </p>
                      {room.difficulties.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {room.difficulties.map((d) => (
                            <span
                              key={d}
                              className="font-condensed text-xs tracking-[0.12em] uppercase px-2.5 py-1 border"
                              style={{
                                color: DIFF_STYLE[d]?.color ?? '#888',
                                borderColor: DIFF_STYLE[d]?.border ?? '#333',
                                backgroundColor: DIFF_STYLE[d]?.bg ?? 'transparent',
                              }}
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="font-condensed text-xs text-lead italic">Any</span>
                      )}
                    </div>

                    {/* Topics */}
                    <div>
                      <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-2">
                        Topics
                      </p>
                      {room.topics.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {room.topics.map((t) => (
                            <span
                              key={t}
                              className="font-condensed text-[11px] tracking-wider px-2 py-0.5 bg-void border border-ash text-bone"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="font-condensed text-xs text-lead italic">All topics</span>
                      )}
                    </div>
                  </div>

                  {/* ── Invite ────────────────────────── */}
                  <div className="px-5 py-5">
                    <p className="font-condensed text-[10px] tracking-[0.25em] uppercase text-charcoal mb-4 flex items-center gap-1.5">
                      <Users className="w-3 h-3" aria-hidden="true" /> Invite Rivals
                    </p>

                    {/* Copy link */}
                    <div className="mb-4">
                      <p className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal/70 mb-2">
                        Share link
                      </p>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-void border border-ash px-3 py-2 font-mono text-[11px] text-slate truncate min-w-0">
                          {inviteUrl || `—`}
                        </div>
                        <button
                          type="button"
                          onClick={copyLink}
                          aria-label="Copy invite link"
                          className="flex items-center gap-1.5 font-condensed text-[11px] tracking-wider uppercase
                            px-3 py-2 border flex-shrink-0 transition-all duration-200
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
                          style={{
                            borderColor: copied ? 'rgba(34,197,94,0.5)' : '#2a2a2a',
                            color: copied ? '#4ade80' : '#666',
                            backgroundColor: copied ? 'rgba(34,197,94,0.06)' : 'transparent',
                          }}
                        >
                          {copied
                            ? <><Check className="w-3 h-3" aria-hidden="true" /> Done</>
                            : <><Copy className="w-3 h-3" aria-hidden="true" /> Copy</>
                          }
                        </button>
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="mb-4">
                      <p className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal/70 mb-2 flex items-center gap-1">
                        <Mail className="w-2.5 h-2.5" aria-hidden="true" /> Email
                      </p>
                      <div className="flex gap-2">
                        <input
                          ref={inputRef}
                          type="email"
                          value={emailInput}
                          onChange={(e) => { setEmailInput(e.target.value); setEmailError('') }}
                          onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                          placeholder="rival@example.com"
                          aria-label="Rival's email"
                          className="flex-1 bg-void border border-ash px-3 py-2 font-condensed text-sm text-parchment
                            placeholder:text-charcoal tracking-wider outline-none min-w-0
                            focus:border-ember/50 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={addEmail}
                          aria-label="Add email"
                          className="flex items-center gap-1 font-condensed text-[11px] tracking-wider uppercase
                            px-3 py-2 border border-ash text-charcoal hover:border-ember/40 hover:text-slate
                            flex-shrink-0 transition-all duration-200
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
                        >
                          <Plus className="w-3 h-3" aria-hidden="true" /> Add
                        </button>
                      </div>
                      {emailError && (
                        <p className="mt-1 font-condensed text-[11px] text-red-400 tracking-wider">
                          {emailError}
                        </p>
                      )}
                    </div>

                    {/* Invitee list */}
                    {allInvited.length > 0 && (
                      <div>
                        <p className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal/70 mb-2">
                          {allInvited.length} invited
                        </p>
                        <ul className="space-y-1.5">
                          <AnimatePresence initial={false}>
                            {allInvited.map((email) => {
                              const isNew = extraEmails.includes(email)
                              return (
                                <motion.li
                                  key={email}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 6 }}
                                  transition={{ duration: 0.18 }}
                                  className="flex items-center justify-between gap-2 group"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="w-1 h-1 rounded-full bg-ember/40 flex-shrink-0" aria-hidden="true" />
                                    <span className="font-condensed text-xs text-bone tracking-wider truncate">
                                      {email}
                                    </span>
                                  </div>
                                  {isNew && (
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <span className="font-condensed text-[10px] text-ember/60 uppercase tracking-wider">new</span>
                                      <button
                                        type="button"
                                        onClick={() => removeExtra(email)}
                                        aria-label={`Remove ${email}`}
                                        className="text-charcoal hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </motion.li>
                              )
                            })}
                          </AnimatePresence>
                        </ul>

                        {extraEmails.length > 0 && (
                          <motion.button
                            type="button"
                            onClick={handleSend}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 flex items-center gap-2 font-condensed text-xs tracking-[0.15em] uppercase
                              px-4 py-2 border transition-all duration-200
                              focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember"
                            style={
                              sent
                                ? { borderColor: 'rgba(34,197,94,0.5)', color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.06)' }
                                : { borderColor: 'rgba(200,16,46,0.4)', color: '#c8102e' }
                            }
                          >
                            {sent
                              ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> Sent</>
                              : <><Send className="w-3.5 h-3.5" aria-hidden="true" /> Send {extraEmails.length} invite{extraEmails.length !== 1 ? 's' : ''}</>
                            }
                          </motion.button>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="px-5 py-8 text-center">
                  <p className="font-condensed text-sm text-charcoal tracking-wider italic">
                    No room config found for this session.
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
