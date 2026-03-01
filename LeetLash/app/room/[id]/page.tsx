'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Drum, Users, Copy, Check, ArrowRight, Mail, X,
  Hash, Layers, Target, Clock, Plus, Send,
} from 'lucide-react'

import Navbar from '@/components/Navbar'
import type { RoomFormValues } from '@/components/create-room/RoomConfigForm'

interface StoredRoom extends RoomFormValues {
  roomId: string
  createdAt: number
  status: 'waiting' | 'active' | 'ended'
}

const DIFF_STYLE: Record<string, { color: string; border: string; bg: string }> = {
  Easy:   { color: '#4ade80', border: 'rgba(34,197,94,0.4)',  bg: 'rgba(34,197,94,0.08)'  },
  Medium: { color: '#fb923c', border: 'rgba(251,146,60,0.4)', bg: 'rgba(251,146,60,0.08)' },
  Hard:   { color: '#f87171', border: 'rgba(248,113,113,0.4)',bg: 'rgba(248,113,113,0.08)'},
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function RoomPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [room, setRoom] = useState<StoredRoom | null>(null)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Extra invitees added after room creation
  const [extraEmails, setExtraEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(`codelash:room:${id}`)
      if (raw) setRoom(JSON.parse(raw) as StoredRoom)
    } catch { /* ignore */ }
  }, [id])

  const inviteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/room/${id}`
      : `/room/${id}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch { /* clipboard unavailable */ }
  }

  const addEmail = () => {
    const trimmed = emailInput.trim()
    if (!trimmed) return
    if (!EMAIL_RE.test(trimmed)) {
      setEmailError('Not a valid email address.')
      return
    }
    const all = [...(room?.emails ?? []), ...extraEmails]
    if (all.includes(trimmed)) {
      setEmailError('Already in the list.')
      return
    }
    setExtraEmails((prev) => [...prev, trimmed])
    setEmailInput('')
    setEmailError('')
    setSent(false)
  }

  const removeExtra = (email: string) =>
    setExtraEmails((prev) => prev.filter((e) => e !== email))

  const handleSend = () => {
    if (extraEmails.length === 0) return
    // No real email backend yet — just mark as "sent"
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  if (!mounted) return null

  const allInvited = [...(room?.emails ?? []), ...extraEmails]
  const createdAt = room ? new Date(room.createdAt) : null

  return (
    <div className="relative min-h-screen bg-void overflow-x-hidden">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-[55vh] z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(200,16,46,0.13) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 pt-32 pb-28">

        {/* ── Header ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-6"
        >
          <Drum className="w-4 h-4 text-ember flex-shrink-0" aria-hidden="true" />
          <span className="font-condensed text-xs tracking-[0.3em] uppercase text-ember">
            Room
          </span>
          <span className="font-mono text-xs text-charcoal tracking-widest bg-cinder border border-ash px-3 py-1 truncate max-w-[200px] sm:max-w-none">
            {id}
          </span>
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-ember animate-rec-blink flex-shrink-0" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-parchment leading-none mb-3"
          style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)' }}
        >
          Practice Room <span className="text-ember">Ready.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="font-condensed text-sm text-slate tracking-wider mb-10 max-w-lg"
        >
          Your room is set. Invite rivals, review the config, then enter when ready.
          No mercy once the clock starts.
        </motion.p>

        <div className="divider-ember mb-10" aria-hidden="true" />

        {room ? (
          <div className="space-y-10">

            {/* ── Room Details ──────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              aria-label="Room details"
            >
              <h2 className="font-condensed text-xs tracking-[0.28em] uppercase text-charcoal mb-4 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                Room Details
              </h2>

              <div className="bg-cinder border border-ash divide-y divide-ash">

                {/* Problems + Status row */}
                <div className="grid grid-cols-2 divide-x divide-ash">
                  <div className="px-5 py-4">
                    <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-2 flex items-center gap-1.5">
                      <Hash className="w-3 h-3" aria-hidden="true" /> Problems
                    </p>
                    <p className="font-display text-4xl text-ember leading-none tabular-nums">
                      {room.numProblems}
                    </p>
                    <p className="font-condensed text-xs text-lead tracking-wider mt-1">
                      problem{room.numProblems !== 1 ? 's' : ''} queued
                    </p>
                  </div>

                  <div className="px-5 py-4">
                    <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" aria-hidden="true" /> Status
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        aria-hidden="true"
                        className="w-1.5 h-1.5 rounded-full bg-ember animate-rec-blink flex-shrink-0"
                      />
                      <span className="font-condensed text-sm text-parchment tracking-wider capitalize">
                        {room.status}
                      </span>
                    </div>
                    {createdAt && (
                      <p className="font-condensed text-[10px] text-lead tracking-wider mt-2">
                        Created {createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        {createdAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Difficulty row */}
                <div className="px-5 py-4">
                  <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3 flex items-center gap-1.5">
                    <Target className="w-3 h-3" aria-hidden="true" /> Difficulty
                  </p>
                  {room.difficulties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {room.difficulties.map((d) => (
                        <span
                          key={d}
                          className="font-condensed text-xs tracking-[0.15em] uppercase px-3 py-1 border"
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
                    <span className="font-condensed text-sm text-lead italic">Any difficulty</span>
                  )}
                </div>

                {/* Topics row */}
                <div className="px-5 py-4">
                  <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3">
                    Topics
                  </p>
                  {room.topics.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {room.topics.map((t) => (
                        <span
                          key={t}
                          className="font-condensed text-xs tracking-wider px-2.5 py-1 bg-void border border-ash text-bone"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="font-condensed text-sm text-lead italic">
                      All topics — full gauntlet
                    </span>
                  )}
                </div>

              </div>
            </motion.section>

            {/* ── Invite Section ────────────────────── */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              aria-label="Invite rivals"
            >
              <h2 className="font-condensed text-xs tracking-[0.28em] uppercase text-charcoal mb-4 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                Invite Rivals
              </h2>

              <div className="bg-cinder border border-ash divide-y divide-ash">

                {/* Invite link */}
                <div className="px-5 py-4">
                  <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3">
                    Share Link
                  </p>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-void border border-ash px-4 py-2.5 font-mono text-xs text-slate truncate min-w-0">
                      {inviteUrl}
                    </div>
                    <button
                      type="button"
                      onClick={copyLink}
                      aria-label="Copy invite link"
                      className="flex items-center gap-2 font-condensed text-xs tracking-[0.15em] uppercase
                        px-4 py-2.5 border flex-shrink-0 transition-all duration-200
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4"
                      style={{
                        borderColor: copied ? 'rgba(34,197,94,0.6)' : '#2a2a2a',
                        color: copied ? '#4ade80' : '#666',
                        backgroundColor: copied ? 'rgba(34,197,94,0.06)' : 'transparent',
                      }}
                    >
                      {copied
                        ? <><Check className="w-3.5 h-3.5" aria-hidden="true" /> Copied</>
                        : <><Copy className="w-3.5 h-3.5" aria-hidden="true" /> Copy</>
                      }
                    </button>
                  </div>
                </div>

                {/* Email invite input */}
                <div className="px-5 py-4">
                  <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3 flex items-center gap-1.5">
                    <Mail className="w-3 h-3" aria-hidden="true" /> Email Invite
                  </p>
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="email"
                      value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setEmailError('') }}
                      onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                      placeholder="rival@example.com"
                      aria-label="Rival's email address"
                      className="flex-1 bg-void border border-ash px-4 py-2.5 font-condensed text-sm text-parchment
                        placeholder:text-charcoal tracking-wider outline-none
                        focus:border-ember/50 transition-colors duration-150"
                    />
                    <button
                      type="button"
                      onClick={addEmail}
                      aria-label="Add email to invite list"
                      className="flex items-center gap-1.5 font-condensed text-xs tracking-[0.15em] uppercase
                        px-4 py-2.5 border border-ash text-charcoal
                        hover:border-ember/40 hover:text-slate flex-shrink-0
                        transition-all duration-200
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      Add
                    </button>
                  </div>
                  {emailError && (
                    <p className="mt-1.5 font-condensed text-xs text-red-400 tracking-wider">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Invited list */}
                {allInvited.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal mb-3">
                      {allInvited.length} rival{allInvited.length !== 1 ? 's' : ''} invited
                    </p>
                    <ul className="space-y-2" aria-label="Invited rivals">
                      <AnimatePresence initial={false}>
                        {allInvited.map((email) => {
                          const isExtra = extraEmails.includes(email)
                          return (
                            <motion.li
                              key={email}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 8 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center justify-between gap-3 group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                  aria-hidden="true"
                                  className="w-1 h-1 rounded-full bg-ember/40 flex-shrink-0"
                                />
                                <span className="font-condensed text-sm text-bone tracking-wider truncate">
                                  {email}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isExtra && (
                                  <span className="font-condensed text-[10px] tracking-wider text-ember/60 uppercase">
                                    new
                                  </span>
                                )}
                                {isExtra && (
                                  <button
                                    type="button"
                                    onClick={() => removeExtra(email)}
                                    aria-label={`Remove ${email}`}
                                    className="text-charcoal hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </motion.li>
                          )
                        })}
                      </AnimatePresence>
                    </ul>

                    {/* Send invites button */}
                    {extraEmails.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <button
                          type="button"
                          onClick={handleSend}
                          className="flex items-center gap-2 font-condensed text-xs tracking-[0.18em] uppercase
                            px-5 py-2.5 border transition-all duration-200
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4"
                          style={
                            sent
                              ? { borderColor: 'rgba(34,197,94,0.5)', color: '#4ade80', backgroundColor: 'rgba(34,197,94,0.06)' }
                              : { borderColor: 'rgba(200,16,46,0.4)', color: '#c8102e' }
                          }
                        >
                          {sent ? (
                            <><Check className="w-3.5 h-3.5" aria-hidden="true" /> Invites sent</>
                          ) : (
                            <><Send className="w-3.5 h-3.5" aria-hidden="true" /> Send {extraEmails.length} invite{extraEmails.length !== 1 ? 's' : ''}</>
                          )}
                        </button>
                        {!sent && (
                          <p className="mt-1.5 font-condensed text-[10px] text-charcoal tracking-wider">
                            Email delivery requires backend wiring — coming soon.
                          </p>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}

              </div>
            </motion.section>

          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-condensed text-sm text-charcoal tracking-wider mb-10 italic"
          >
            Room config not found in this session.{' '}
            <Link href="/create-room" className="text-ember hover:underline">
              Create a new room.
            </Link>
          </motion.p>
        )}

        {/* ── CTA ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            type="button"
            onClick={() => router.push(`/practice?room=${id}`)}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            className="group relative flex items-center justify-center gap-3
              bg-ember text-parchment font-condensed text-sm tracking-[0.18em] uppercase
              px-12 py-5 border border-ember
              hover:bg-ember-bright hover:shadow-ember-lg
              transition-all duration-200 animate-pulse-ember
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4
              overflow-hidden"
            aria-label="Enter solo practice room"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-ember via-ember-bright to-ember
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative z-10 flex items-center gap-3">
              Enter Practice
              <ArrowRight
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </span>
          </motion.button>

          <Link
            href="/create-room"
            className="flex items-center justify-center gap-2 font-condensed text-xs tracking-[0.18em] uppercase
              px-8 py-5 border border-ash text-charcoal hover:border-ember/40 hover:text-slate
              transition-all duration-200
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4"
          >
            New Room
          </Link>
        </motion.div>

        <p className="mt-4 font-condensed text-xs text-charcoal tracking-wider">
          Multiplayer is coming. For now, enter solo practice with your configured session.
        </p>

      </main>
    </div>
  )
}
