'use client'

/* ═══════════════════════════════════════════════════
   ROOM FORM
   The four-step practice room configurator.
   State lives here, children are dumb renderers.

   Step 01 — Number of problems (slider)
   Step 02 — Difficulty (toggle buttons)
   Step 03 — Topics (multi-select)
   Step 04 — Invite rivals (email chips)

   On submit: generates room ID → localStorage → /room/[id]
   ═══════════════════════════════════════════════════ */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react'

import NumberSlider from './NumberSlider'
import DifficultySelector from './DifficultySelector'
import TopicMultiSelect from './TopicMultiSelect'
import EmailInvites from './EmailInvites'

import type { Difficulty } from '@/lib/problems'
import type { Topic } from '@/lib/topics'

// ── Types ───────────────────────────────────────────

export interface RoomConfig {
  numProblems: number
  difficulties: Difficulty[]
  topics: Topic[]
  inviteEmails: string[]
}

interface FormErrors {
  difficulties?: string
}

// ── Section wrapper ──────────────────────────────────

function FormSection({
  step,
  title,
  subtitle,
  children,
}: {
  step: string
  title: string
  subtitle: string
  delay?: number   // kept for API compat, unused now
  children: React.ReactNode
}) {
  return (
    <section
      className="py-10 border-b border-ash"
      aria-labelledby={`section-${step}-title`}
    >
      <div className="flex items-start gap-4 mb-7">
        {/* Step number — decorative */}
        <span
          aria-hidden="true"
          className="font-display text-4xl text-ember/30 leading-none select-none mt-0.5 flex-shrink-0 tabular-nums"
        >
          {step}
        </span>

        <div>
          <h2
            id={`section-${step}-title`}
            className="font-condensed text-sm tracking-[0.22em] uppercase text-slate mb-1"
          >
            {title}
          </h2>
          <p className="font-condensed text-xs text-charcoal tracking-wider">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  )
}

// ── Main form ────────────────────────────────────────

export default function RoomForm() {
  const router = useRouter()

  const [config, setConfig] = useState<RoomConfig>({
    numProblems: 5,
    difficulties: ['Medium', 'Hard'],
    topics: [],
    inviteEmails: [],
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  // ── Validation ─────────────────────────────────────

  const validate = (): boolean => {
    const next: FormErrors = {}

    if (config.difficulties.length === 0) {
      next.difficulties = 'Choose at least one difficulty. No mercy for the indecisive.'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  // ── Submit ─────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    // Brief pause to show loading state (replace with real backend call)
    await new Promise<void>((resolve) => setTimeout(resolve, 300))

    // Generate short room ID  — 8 hex chars, uppercase
    const roomId = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase()

    // Persist config for the room page to hydrate
    try {
      localStorage.setItem(
        `codelash:room:${roomId}`,
        JSON.stringify({
          ...config,
          roomId,
          createdAt: Date.now(),
          status: 'waiting', // 'waiting' | 'active' | 'ended'
        }),
      )
    } catch {
      // localStorage unavailable (private browsing, etc.) — still navigate
    }

    router.push(`/room/${roomId}`)
  }

  // ── Helpers ────────────────────────────────────────

  const clearDiffError = () => setErrors((prev) => ({ ...prev, difficulties: undefined }))

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Configure your practice room"
    >
      {/* ── 01: How many problems ── */}
      <FormSection
        step="01"
        title="How many battles?"
        subtitle="Each problem is a test. How many can you survive?"
        delay={0.05}
      >
        <NumberSlider
          value={config.numProblems}
          onChange={(n) => setConfig((c) => ({ ...c, numProblems: n }))}
        />
      </FormSection>

      {/* ── 02: Difficulty ── */}
      <FormSection
        step="02"
        title="Set the tempo"
        subtitle="Choose your pain level. Combine for a mixed gauntlet."
        delay={0.1}
      >
        <DifficultySelector
          selected={config.difficulties}
          onChange={(d) => {
            setConfig((c) => ({ ...c, difficulties: d }))
            clearDiffError()
          }}
        />

        <AnimatePresence>
          {errors.difficulties && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex items-center gap-2 font-condensed text-xs text-ember tracking-wider"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {errors.difficulties}
            </motion.p>
          )}
        </AnimatePresence>
      </FormSection>

      {/* ── 03: Topics ── */}
      <FormSection
        step="03"
        title="Choose your weapons"
        subtitle="Leave empty for the full gauntlet — no topic spared."
        delay={0.15}
      >
        <TopicMultiSelect
          selected={config.topics}
          onChange={(t) => setConfig((c) => ({ ...c, topics: t }))}
        />
      </FormSection>

      {/* ── 04: Invite rivals ── */}
      <FormSection
        step="04"
        title="Assemble your band"
        subtitle="Invite rivals by email. They'll get a link when multiplayer launches."
        delay={0.2}
      >
        <EmailInvites
          emails={config.inviteEmails}
          onChange={(emails) => setConfig((c) => ({ ...c, inviteEmails: emails }))}
        />
      </FormSection>

      {/* ── Submit ── */}
      <div className="pt-10">
        {/* Room summary preview */}
        <div className="mb-6 p-4 bg-cinder border border-ash">
          <p className="font-condensed text-xs tracking-[0.2em] uppercase text-charcoal mb-2">
            Room summary
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span className="font-condensed text-sm text-bone">
              <span className="text-ember">{config.numProblems}</span>{' '}
              problem{config.numProblems !== 1 ? 's' : ''}
            </span>
            <span className="font-condensed text-sm text-bone">
              {config.difficulties.length > 0
                ? config.difficulties.join(' · ')
                : <span className="text-charcoal italic">no difficulty set</span>
              }
            </span>
            <span className="font-condensed text-sm text-bone">
              {config.topics.length > 0
                ? `${config.topics.length} topic${config.topics.length !== 1 ? 's' : ''}`
                : <span className="text-charcoal italic">any topic</span>
              }
            </span>
            <span className="font-condensed text-sm text-bone">
              {config.inviteEmails.length > 0
                ? `${config.inviteEmails.length} rival${config.inviteEmails.length !== 1 ? 's' : ''}`
                : <span className="text-charcoal italic">solo run</span>
              }
            </span>
          </div>
        </div>

        {/* CTA button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={loading ? {} : { scale: 1.015 }}
          whileTap={loading ? {} : { scale: 0.985 }}
          className="group relative w-full sm:w-auto flex items-center justify-center gap-3
            bg-ember text-parchment font-condensed text-sm tracking-[0.18em] uppercase
            px-14 py-5 border border-ember
            hover:bg-ember-bright hover:shadow-ember-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            animate-pulse-ember
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4
            overflow-hidden"
          aria-label="Create practice room"
          aria-busy={loading}
        >
          {/* Shimmer overlay on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-ember via-ember-bright to-ember
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />

          <span className="relative z-10 flex items-center gap-3">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Assembling the room...
              </>
            ) : (
              <>
                Create Room
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </>
            )}
          </span>
        </motion.button>

        <p className="mt-4 font-condensed text-xs text-charcoal tracking-wider">
          No excuses once the room is live.
        </p>
      </div>
    </form>
  )
}
