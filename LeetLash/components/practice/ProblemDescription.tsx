'use client'

/* ═══════════════════════════════════════════════════
   PROBLEM DESCRIPTION
   Left panel — renders HTML problem content, examples,
   constraints, and metadata with Whiplash styling.
   ═══════════════════════════════════════════════════ */

import { motion } from 'framer-motion'
import { Tag, Zap } from 'lucide-react'
import { type Problem, DIFFICULTY_COLORS } from '@/lib/problems'
import { cn } from '@/lib/utils'

interface ProblemDescriptionProps {
  problem: Problem
  /** Fetched HTML content for CSV problems that have no hardcoded description */
  contentOverride?: string | null
  /** True while an async content fetch is in progress */
  isLoadingContent?: boolean
}

export default function ProblemDescription({
  problem,
  contentOverride,
  isLoadingContent,
}: ProblemDescriptionProps) {
  const hasLocalContent = problem.examples.length > 0 || problem.constraints.length > 0
  const effectiveContent = hasLocalContent ? problem.content : (contentOverride ?? null)
  return (
    <motion.div
      key={problem.id} // Re-animates on problem change
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full overflow-y-auto px-6 py-6 space-y-6"
    >
      {/* ── Title row ──────────────────────────────── */}
      <header className="space-y-3">
        <div className="flex items-start gap-3 flex-wrap">
          {/* Problem number */}
          <span className="font-mono text-xs text-charcoal mt-1 flex-shrink-0">
            #{problem.id}
          </span>
          {/* Title */}
          <h1 className="font-display text-2xl md:text-3xl text-parchment leading-tight flex-1">
            {problem.title}
          </h1>
        </div>

        {/* Meta row: difficulty + acceptance + tags */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Difficulty badge */}
          <span
            className={cn(
              'font-condensed text-xs font-semibold tracking-[0.12em] uppercase px-2.5 py-1 border',
              DIFFICULTY_COLORS[problem.difficulty],
            )}
          >
            {problem.difficulty}
          </span>

          {/* Acceptance rate */}
          <span className="flex items-center gap-1 font-condensed text-xs text-charcoal tracking-wide">
            <Zap className="w-3 h-3" aria-hidden="true" />
            {problem.acceptanceRate.toFixed(1)}% accepted
          </span>

          {/* Tags */}
          {problem.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 font-condensed text-xs text-lead tracking-wide"
            >
              <Tag className="w-2.5 h-2.5" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>

        {/* Thin ember divider */}
        <div className="divider-ember" aria-hidden="true" />
      </header>

      {/* ── Problem content HTML ────────────────────── */}
      {isLoadingContent ? (
        /* Skeleton while fetching from LeetCode */
        <section aria-label="Loading problem description" className="space-y-3 animate-pulse">
          {[90, 75, 85, 60, 80, 70].map((w, i) => (
            <div key={i} className="h-3 bg-ash/40 rounded-none" style={{ width: `${w}%` }} />
          ))}
        </section>
      ) : effectiveContent ? (
        <section
          className="problem-content"
          aria-label="Problem description"
          dangerouslySetInnerHTML={{ __html: effectiveContent }}
        />
      ) : (
        /* Fetch failed or premium problem — link to LeetCode */
        <section
          className="flex flex-col items-center justify-center py-14 gap-6 text-center"
          aria-label="Problem description unavailable"
        >
          <p className="font-condensed text-sm text-charcoal tracking-wider max-w-xs leading-relaxed">
            Problem statement unavailable offline.
            <br />
            Open it on LeetCode while you solve it here.
          </p>
          <a
            href={`https://leetcode.com/problems/${problem.titleSlug}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-condensed text-sm tracking-[0.18em] uppercase
              bg-ember text-parchment border border-ember px-6 py-3
              hover:bg-ember-bright hover:shadow-ember transition-all duration-200"
          >
            View on LeetCode ↗
          </a>
          <p className="font-condensed text-[10px] text-charcoal/50 tracking-wider italic">
            Starter code and test runner are ready — solve away.
          </p>
        </section>
      )}

      {/* ── Examples (only available for hardcoded problems) ── */}
      {problem.examples.length > 0 && (
        <section aria-label="Examples">
          <h2 className="font-display text-base text-dust tracking-widest uppercase mb-3">
            Examples
          </h2>
          <div className="space-y-4">
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className="border border-ash bg-obsidian/60 p-4 space-y-2"
              >
                <p className="font-condensed text-xs text-slate tracking-widest uppercase mb-2">
                  Example {i + 1}
                </p>

                <div className="space-y-1.5 font-mono text-xs">
                  <div>
                    <span className="text-charcoal">Input: </span>
                    <span className="text-parchment">{ex.input}</span>
                  </div>
                  <div>
                    <span className="text-charcoal">Output: </span>
                    <span className="text-parchment">{ex.output}</span>
                  </div>
                </div>

                {ex.explanation && (
                  <p className="font-condensed text-xs text-lead leading-relaxed border-t border-ash/50 pt-2 mt-2 whitespace-pre-line">
                    <span className="text-charcoal">Explanation: </span>
                    {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Constraints ─────────────────────────────── */}
      {problem.constraints.length > 0 && (
        <section aria-label="Constraints">
          <h2 className="font-display text-base text-dust tracking-widest uppercase mb-3">
            Constraints
          </h2>
          <ul className="space-y-1.5" role="list">
            {problem.constraints.map((c, i) => (
              <li
                key={i}
                className="flex items-start gap-2 font-mono text-xs text-lead"
              >
                <span
                  className="text-ember mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                >
                  ›
                </span>
                <span dangerouslySetInnerHTML={{ __html: c }} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Bottom spacer */}
      <div className="h-4" aria-hidden="true" />
    </motion.div>
  )
}
