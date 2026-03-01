'use client'

/* ═══════════════════════════════════════════════════
   ROOM CONFIG FORM
   The core of /create-room. Uses react-hook-form +
   zod for typed, schema-driven validation.

   Schema enforces:
     • numProblems  → 1..20
     • difficulties → min 1 selected (disables CTA)
     • topics       → any subset (empty = all topics)
     • emails       → each entry must be valid email

   On valid submit:
     → generate crypto.randomUUID() room ID
     → log config + alert for now (no real backend)
     → store config in localStorage
     → navigate to /room/[roomId]

   Future wiring:
     • Auth:       Clerk / NextAuth session check
     • Backend:    POST /api/rooms → Supabase row
     • Invites:    POST /api/invite → Resend email
     • Realtime:   Pusher channel per roomId
   ═══════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'

import DifficultyToggles, { type Difficulty } from './DifficultyToggles'
import TopicSelect from './TopicSelect'
import EmailChips from './EmailChips'

// ── Zod schema ────────────────────────────────────────

const roomSchema = z.object({
  numProblems: z
    .number()
    .int()
    .min(1, 'At least 1 problem. Even one is more than you can handle.')
    .max(20, 'Maximum 20. Even Fletcher has limits.'),

  difficulties: z
    .array(z.enum(['Easy', 'Medium', 'Hard']))
    .min(1, 'Choose your pain. At least one difficulty required.'),

  // No .default() — zod v4's .default() makes the field input-optional
  // (undefined → []), which breaks the RHF resolver type. Use useForm defaultValues.
  topics: z.array(z.string()),

  emails: z.array(z.string().email('That is not a valid email address.')),
})

export type RoomFormValues = z.infer<typeof roomSchema>

// ── Section wrapper ────────────────────────────────────

function Section({
  step,
  label,
  sublabel,
  children,
  htmlFor,
}: {
  step: string
  label: string
  sublabel?: string
  children: React.ReactNode
  htmlFor?: string
}) {
  return (
    <div className="py-9 border-b border-[#1a1a1a]">
      <div className="flex items-start gap-4 mb-6">
        <span
          aria-hidden="true"
          className="font-display text-3xl text-[#c8102e]/55 leading-none select-none mt-0.5 flex-shrink-0 tabular-nums"
        >
          {step}
        </span>
        <div>
          {htmlFor ? (
            <label
              htmlFor={htmlFor}
              className="block font-condensed text-sm tracking-[0.2em] uppercase text-[#8a8a8a] mb-0.5"
            >
              {label}
            </label>
          ) : (
            <p className="font-condensed text-sm tracking-[0.2em] uppercase text-[#8a8a8a] mb-0.5">
              {label}
            </p>
          )}
          {sublabel && (
            <p className="font-condensed text-xs text-[#666] tracking-wider">{sublabel}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}

// ── Main form ──────────────────────────────────────────

export default function RoomConfigForm() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  // Prevent hydration mismatch: isValid is false during SSR but true on client
  // (defaultValues satisfy the schema). Gate the "valid" UI behind a mounted flag.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      numProblems: 5,
      difficulties: ['Medium', 'Hard'],
      topics: [],
      emails: [],
    },
    mode: 'onChange', // validate on every change for live button state
  })

  // Only reflect isValid after hydration to avoid server/client mismatch
  const formIsValid = mounted && isValid

  // Watch live for the summary preview — guard with fallbacks; watch() can
  // return undefined on the very first render before RHF has initialised.
  const numProblems   = watch('numProblems') ?? 5
  const difficulties  = watch('difficulties') ?? []
  const topics        = watch('topics') ?? []
  const emails        = watch('emails') ?? []

  // ── Submit ──────────────────────────────────────────

  const onSubmit = async (data: RoomFormValues) => {
    setIsCreating(true)

    const roomId = crypto.randomUUID()

    // Persist config so /room/[id] can read it
    try {
      localStorage.setItem(
        `codelash:room:${roomId}`,
        JSON.stringify({
          ...data,
          roomId,
          createdAt: Date.now(),
          status: 'waiting',
        }),
      )
    } catch {
      // localStorage unavailable — continue anyway
    }

    // Fire-and-forget invite emails for addresses added at creation time
    if (data.emails.length > 0) {
      fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          emails: data.emails,
          roomConfig: {
            numProblems: data.numProblems,
            difficulties: data.difficulties,
            topics: data.topics,
          },
        }),
      }).catch(() => {})
    }

    router.push(`/room/${roomId}`)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Configure your practice room"
      className="w-full"
    >
      {/* ── 01 Number of problems ── */}
      <Section
        step="01"
        label="How many problems will break you?"
        sublabel="1 is a warm-up. 20 is a eulogy."
        htmlFor="num-problems-slider"
      >
        <Controller
          name="numProblems"
          control={control}
          render={({ field }) => {
            const pct = ((field.value - 1) / 19) * 100
            return (
              <div className="space-y-5">
                {/* Big number display */}
                <div className="flex items-end gap-3">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={field.value}
                      initial={{ opacity: 0, y: -10, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="font-display text-8xl leading-none tabular-nums"
                      style={{ color: '#dc2626' }}
                      aria-live="polite"
                    >
                      {field.value}
                    </motion.span>
                  </AnimatePresence>
                  <span className="font-condensed text-sm text-[#8a8a8a] tracking-[0.2em] uppercase pb-3">
                    {field.value === 1 ? 'problem' : 'problems'}
                  </span>
                </div>

                {/* Slider */}
                <input
                  id="num-problems-slider"
                  type="range"
                  min={1}
                  max={20}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="room-slider w-full"
                  style={{
                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${pct}%, #1a1a1a ${pct}%, #1a1a1a 100%)`,
                  }}
                  aria-valuemin={1}
                  aria-valuemax={20}
                  aria-valuenow={field.value}
                  aria-valuetext={`${field.value} problem${field.value !== 1 ? 's' : ''}`}
                />

                {/* Labels */}
                <div className="flex justify-between">
                  {[1, 5, 10, 15, 20].map((n) => (
                    <span key={n} className="font-condensed text-xs text-[#555] tracking-wider">
                      {n}
                    </span>
                  ))}
                </div>

                {errors.numProblems && (
                  <p role="alert" className="font-condensed text-xs text-red-400 tracking-wider">
                    {errors.numProblems.message}
                  </p>
                )}
              </div>
            )
          }}
        />
      </Section>

      {/* ── 02 Difficulty ── */}
      <Section
        step="02"
        label="Choose the pain level"
        sublabel="Select multiple. Fletcher approves of suffering."
      >
        <Controller
          name="difficulties"
          control={control}
          render={({ field }) => (
            <DifficultyToggles
              value={field.value as Difficulty[]}
              onChange={field.onChange}
              error={errors.difficulties?.message}
            />
          )}
        />
      </Section>

      {/* ── 03 Topics ── */}
      <Section
        step="03"
        label='Filter to topics you "pretend" to know'
        sublabel="Leave empty for the full gauntlet — every topic, no hiding."
      >
        <Controller
          name="topics"
          control={control}
          render={({ field }) => (
            <TopicSelect value={field.value} onChange={field.onChange} />
          )}
        />
      </Section>

      {/* ── 04 Invite rivals ── */}
      <Section
        step="04"
        label="Bring competitors who won't disappoint"
        sublabel="Or generate an invite link after the room is created."
      >
        <Controller
          name="emails"
          control={control}
          render={({ field }) => (
            <EmailChips
              value={field.value}
              onChange={field.onChange}
              error={errors.emails?.message ?? errors.emails?.root?.message}
            />
          )}
        />
      </Section>

      {/* ── Room summary ── */}
      <div className="py-8 border-b border-[#1a1a1a]">
        <p className="font-condensed text-xs tracking-[0.2em] uppercase text-[#555] mb-3">
          Room summary
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
          <span className="font-condensed text-sm text-[#d4c9b8]">
            <span style={{ color: '#dc2626' }}>{numProblems}</span>{' '}
            problem{numProblems !== 1 ? 's' : ''}
          </span>
          <span className="font-condensed text-sm text-[#d4c9b8]">
            {difficulties.length > 0
              ? difficulties.join(' · ')
              : <span className="text-[#555] italic">no difficulty</span>
            }
          </span>
          <span className="font-condensed text-sm text-[#d4c9b8]">
            {topics.length > 0
              ? `${topics.length} topic${topics.length !== 1 ? 's' : ''}`
              : <span className="text-[#555] italic">any topic</span>
            }
          </span>
          <span className="font-condensed text-sm text-[#d4c9b8]">
            {emails.length > 0
              ? `${emails.length} rival${emails.length !== 1 ? 's' : ''} invited`
              : <span className="text-[#555] italic">solo run</span>
            }
          </span>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="pt-10">
        <motion.button
          type="submit"
          disabled={!formIsValid || isCreating}
          whileHover={!formIsValid || isCreating ? {} : { scale: 1.015 }}
          whileTap={!formIsValid || isCreating ? {} : { scale: 0.985 }}
          className="group relative w-full sm:w-auto flex items-center justify-center gap-3
            font-condensed text-sm tracking-[0.18em] uppercase
            px-14 py-5 border overflow-hidden
            transition-all duration-200
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8102e] focus-visible:outline-offset-4
            disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          style={
            formIsValid && !isCreating
              ? {
                  backgroundColor: '#c8102e',
                  borderColor: '#c8102e',
                  color: '#f0e6d3',
                  boxShadow: '0 0 20px rgba(200,16,46,0.3), 0 0 60px rgba(200,16,46,0.1)',
                  animation: 'pulse-ember 2.8s ease-in-out infinite',
                }
              : {
                  backgroundColor: 'transparent',
                  borderColor: '#2a2a2a',
                  color: '#555',
                }
          }
          aria-label="Create and enter practice room"
          aria-disabled={!formIsValid || isCreating}
        >
          {/* Hover shimmer — only rendered after hydration to avoid SSR mismatch */}
          {formIsValid && !isCreating && (
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#c8102e] via-[#ef233c] to-[#c8102e]
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          )}

          <span className="relative z-10 flex items-center gap-3">
            {isCreating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Assembling the room...
              </>
            ) : (
              <>
                Create &amp; Enter Room
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </>
            )}
          </span>
        </motion.button>

        {!formIsValid && !isCreating && (
          <p className="mt-3 font-condensed text-xs text-[#666] tracking-wider">
            Select at least one difficulty to unlock the room.
          </p>
        )}

        {formIsValid && !isCreating && (
          <p className="mt-3 font-condensed text-xs text-[#666] tracking-wider">
            No excuses once the room is live.
          </p>
        )}
      </div>
    </form>
  )
}
