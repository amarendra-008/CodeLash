'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Drum, BarChart2, Zap, BookOpen, CheckCircle2,
  Clock, ChevronRight, Trash2, ExternalLink,
} from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { getStats, clearAllData, type AggregatedStats, type SolvedEntry } from '@/lib/user-data'
import { getStatsDB, clearAllDataDB } from '@/lib/supabase/user-data'
import { NEETCODE_CATEGORIES, NEETCODE_BY_CATEGORY, type NeetCodeCategory } from '@/lib/neetcode-ids'

/* ── Diff colours ───────────────────────────────── */

const DIFF_COLOR = {
  Easy:   { text: '#4ade80', border: 'rgba(74,222,128,0.35)',  bg: 'rgba(74,222,128,0.07)'  },
  Medium: { text: '#fb923c', border: 'rgba(251,146,60,0.35)', bg: 'rgba(251,146,60,0.07)'  },
  Hard:   { text: '#c8102e', border: 'rgba(200,16,46,0.35)',  bg: 'rgba(200,16,46,0.07)'   },
}

/* ── Helpers ────────────────────────────────────── */

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function fmtTime(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/* ── Animated counter ───────────────────────────── */

function Counter({ to, duration = 800 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (to === 0) return
    const step  = Math.ceil(to / (duration / 16))
    const timer = setInterval(() => {
      setVal((v) => {
        if (v + step >= to) { clearInterval(timer); return to }
        return v + step
      })
    }, 16)
    return () => clearInterval(timer)
  }, [to, duration])
  return <>{val}</>
}

/* ── Category progress bar ──────────────────────── */

function CategoryRow({
  category,
  solved,
  total,
  active,
  onClick,
}: {
  category: NeetCodeCategory
  solved: number
  total: number
  active: boolean
  onClick: () => void
}) {
  const pct = total > 0 ? (solved / total) * 100 : 0
  const complete = solved === total && total > 0

  return (
    <button
      onClick={onClick}
      className={`w-full text-left group transition-all duration-150 px-4 py-2.5 border-b border-ash/30 last:border-0 ${
        active ? 'bg-ember/5 border-l-2 border-l-ember' : 'hover:bg-cinder/40'
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className={`font-condensed text-[11px] tracking-[0.15em] uppercase ${active ? 'text-parchment' : 'text-slate'}`}>
          {category}
        </span>
        <span className={`font-mono text-[10px] tabular-nums ${complete ? 'text-emerald-400' : 'text-charcoal'}`}>
          {solved}/{total}
        </span>
      </div>
      <div className="h-0.5 bg-ash/40 w-full">
        <motion.div
          className={`h-full ${complete ? 'bg-emerald-400' : 'bg-ember'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </button>
  )
}

/* ── Solve history card ─────────────────────────── */

function SolveCard({ entry }: { entry: SolvedEntry }) {
  const diff = DIFF_COLOR[entry.difficulty]
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start justify-between gap-3 px-4 py-3 border-b border-ash/30 last:border-0 group hover:bg-cinder/30 transition-colors"
    >
      <div className="flex items-start gap-3 min-w-0">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-condensed text-xs text-parchment tracking-wide truncate">
              {entry.title}
            </span>
            <span
              className="font-condensed text-[9px] tracking-[0.15em] uppercase px-1.5 py-0.5 border flex-shrink-0"
              style={{ color: diff.text, borderColor: diff.border, backgroundColor: diff.bg }}
            >
              {entry.difficulty}
            </span>
            <span
              className={`font-condensed text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5 border flex-shrink-0 ${
                entry.solveMethod === 'auto'
                  ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/6'
                  : 'text-amber-400 border-amber-400/30 bg-amber-400/6'
              }`}
            >
              {entry.solveMethod === 'auto' ? 'auto' : 'manual'}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="font-condensed text-[10px] text-charcoal tracking-wider">
              {entry.language === 'javascript' ? 'JS' : 'PY'} · {fmtTime(entry.timeRemainingSeconds)} left · {entry.coachCallsUsed} coach call{entry.coachCallsUsed !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
      <span className="font-condensed text-[10px] text-charcoal/60 whitespace-nowrap flex-shrink-0 mt-0.5">
        {relativeTime(entry.solvedAt)}
      </span>
    </motion.div>
  )
}

/* ── AI energy meter ────────────────────────────── */

function EnergyBar({
  label,
  value,
  max,
  color,
  sublabel,
}: {
  label: string
  value: number
  max: number
  color: string
  sublabel: string
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-condensed text-[10px] tracking-[0.2em] uppercase text-charcoal">
          {label}
        </span>
        <span className="font-display text-2xl leading-none" style={{ color }}>
          <Counter to={value} />
        </span>
      </div>
      <div className="h-1 bg-ash/40 w-full mb-1.5">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="font-condensed text-[10px] text-charcoal/60 tracking-wider italic">
        {sublabel}
      </p>
    </div>
  )
}

/* ── Page ───────────────────────────────────────── */

export default function ProfilePage() {
  const [stats, setStats]   = useState<AggregatedStats | null>(null)
  const [filter, setFilter] = useState<NeetCodeCategory | 'All'>('All')
  const [cleared, setCleared] = useState(false)
  const [user, setUser]     = useState<SupabaseUser | null | undefined>(undefined) // undefined = loading

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null)
      if (data.user) {
        const dbStats = await getStatsDB(sb)
        setStats(dbStats ?? getStats())
      } else {
        setStats(getStats())
      }
    })
  }, [])

  const handleClear = async () => {
    if (!confirm('Clear all progress data? This cannot be undone.')) return
    const sb = createClient()
    await clearAllDataDB(sb).catch(() => {})
    clearAllData()
    setStats(getStats())
    setCleared(true)
    setTimeout(() => setCleared(false), 3000)
  }

  // Category totals from NeetCode 150
  const categoryTotals: Record<string, number> = {}
  for (const cat of NEETCODE_CATEGORIES) {
    categoryTotals[cat] = NEETCODE_BY_CATEGORY[cat].length
  }

  const totalSolved = stats?.totalSolved ?? 0

  const filteredSolves = stats
    ? (filter === 'All'
        ? stats.recentSolves
        : stats.recentSolves.filter((s) => s.neetcodeCategory === filter))
    : []

  const coachMax     = Math.max(stats?.totalCoachCalls ?? 0, 20)
  const interviewMax = Math.max(stats?.totalInterviewMessages ?? 0, 40)

  const coachSubLabel = !stats || stats.totalCoachCalls === 0
    ? 'No Fletcher calls yet. Either confident or terrified.'
    : stats.totalCoachCalls < 5
    ? 'Barely used me. Bold.'
    : stats.totalCoachCalls < 20
    ? 'Reasonable use. Could be worse.'
    : 'You lean on me. Trust your code more.'

  const interviewSubLabel = !stats || stats.totalInterviewMessages === 0
    ? 'Never opened the chat. That\'s either zen or avoidance.'
    : stats.totalInterviewMessages < 10
    ? 'Light usage. Good instincts.'
    : 'Active practice. The interview grind is real.'

  return (
    <div className="min-h-screen bg-void text-parchment relative">
      {/* Noise */}
      <div className="noise-overlay fixed inset-0 pointer-events-none z-0" aria-hidden="true" />

      {/* Spotlight */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 30% 20%, rgba(200,16,46,0.06) 0%, transparent 70%)' }}
      />

      {/* Nav strip */}
      <header className="relative z-10 border-b border-ash">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Drum className="w-4 h-4 text-ember transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl tracking-wider text-parchment">
              CODE<span className="text-ember">LASH</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/practice"
              className="font-condensed text-xs tracking-[0.2em] uppercase text-charcoal hover:text-ember transition-colors flex items-center gap-1.5"
            >
              <ChevronRight className="w-3 h-3" /> Practice
            </Link>
            <button
              onClick={handleClear}
              className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal/40 hover:text-red-400 transition-colors flex items-center gap-1"
              title="Clear all progress"
            >
              <Trash2 className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Cleared toast */}
      <AnimatePresence>
        {cleared && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 font-condensed text-xs tracking-wider uppercase text-emerald-400 border border-emerald-400/30 bg-cinder px-4 py-2"
          >
            Progress cleared.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sync banner — shown to anonymous users only (not while auth is loading) */}
      {user === null && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 border-b border-ash/50 bg-cinder/60"
        >
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
            <p className="font-condensed text-xs tracking-wider text-charcoal">
              Data stored locally — lost on incognito / new device.
            </p>
            <a
              href="/auth/login"
              className="font-condensed text-xs tracking-[0.18em] uppercase text-ember hover:text-flame transition-colors whitespace-nowrap"
            >
              Sign in to sync →
            </a>
          </div>
        </motion.div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* ── Hero ────────────────────────────────── */}
        <div className="mb-12">
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-condensed text-xs tracking-[0.35em] uppercase text-ember mb-3"
          >
            Your Record
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-end gap-6 flex-wrap"
          >
            <h1 className="font-display leading-none text-parchment" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
              {stats ? <Counter to={totalSolved} /> : '—'}
            </h1>
            <div className="mb-2">
              <p className="font-condensed text-sm text-charcoal tracking-wider">problems solved</p>
              <div className="flex items-center gap-3 mt-1.5">
                {(['Easy', 'Medium', 'Hard'] as const).map((d) => (
                  <span key={d} className="flex items-center gap-1.5">
                    <span className="font-display text-xl leading-none" style={{ color: DIFF_COLOR[d].text }}>
                      {stats ? <Counter to={stats.solvedByDifficulty[d]} /> : '0'}
                    </span>
                    <span className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal">{d}</span>
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <p className="font-condensed text-[10px] text-charcoal/50 tracking-widest mt-6 italic">
            "Not quite my tempo." — Fletcher
          </p>
        </div>

        {/* ── Two-column layout ────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

          {/* LEFT — Category breakdown + solve history */}
          <div className="space-y-8">

            {/* Category progress */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="w-3.5 h-3.5 text-ember" aria-hidden="true" />
                <h2 className="font-condensed text-xs tracking-[0.25em] uppercase text-charcoal">
                  Category Breakdown
                </h2>
                {filter !== 'All' && (
                  <button
                    onClick={() => setFilter('All')}
                    className="ml-auto font-condensed text-[10px] tracking-wider uppercase text-charcoal/50 hover:text-ember transition-colors"
                  >
                    Clear filter
                  </button>
                )}
              </div>
              <div className="border border-ash bg-obsidian/40">
                {/* All pill */}
                <button
                  onClick={() => setFilter('All')}
                  className={`w-full text-left px-4 py-2.5 border-b border-ash/30 flex items-center justify-between transition-colors ${filter === 'All' ? 'bg-ember/5 border-l-2 border-l-ember' : 'hover:bg-cinder/40'}`}
                >
                  <span className="font-condensed text-[11px] tracking-[0.15em] uppercase text-parchment">All Categories</span>
                  <span className="font-mono text-[10px] text-charcoal">{totalSolved} solved</span>
                </button>
                {NEETCODE_CATEGORIES.map((cat) => (
                  <CategoryRow
                    key={cat}
                    category={cat}
                    solved={stats?.solvedByCategory[cat] ?? 0}
                    total={categoryTotals[cat]}
                    active={filter === cat}
                    onClick={() => setFilter(filter === cat ? 'All' : cat)}
                  />
                ))}
              </div>
            </section>

            {/* Solve history */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-3.5 h-3.5 text-ember" aria-hidden="true" />
                <h2 className="font-condensed text-xs tracking-[0.25em] uppercase text-charcoal">
                  Solve History
                  {filter !== 'All' && (
                    <span className="ml-2 text-ember">— {filter}</span>
                  )}
                </h2>
              </div>
              <div className="border border-ash bg-obsidian/40">
                {filteredSolves.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="font-condensed text-sm text-charcoal tracking-wider italic">
                      Nothing. You&apos;ve solved nothing.
                    </p>
                    <Link
                      href="/practice"
                      className="mt-4 inline-flex items-center gap-1.5 font-condensed text-xs tracking-[0.2em] uppercase text-ember hover:text-flame transition-colors"
                    >
                      Get to work <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <div>
                    <AnimatePresence initial={false}>
                      {filteredSolves.map((entry) => (
                        <SolveCard key={entry.problemId} entry={entry} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT — AI energy + stats */}
          <div className="space-y-6">

            {/* AI Energy */}
            <section className="border border-ash bg-obsidian/40 p-5">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-3.5 h-3.5 text-ember" />
                <h2 className="font-condensed text-xs tracking-[0.25em] uppercase text-charcoal">
                  AI Energy Consumed
                </h2>
              </div>

              <div className="space-y-6">
                <EnergyBar
                  label="Fletcher (Coach)"
                  value={stats?.totalCoachCalls ?? 0}
                  max={coachMax}
                  color="#c8102e"
                  sublabel={coachSubLabel}
                />
                <EnergyBar
                  label="Interviewer / Chat"
                  value={stats?.totalInterviewMessages ?? 0}
                  max={interviewMax}
                  color="#fb923c"
                  sublabel={interviewSubLabel}
                />
              </div>

              {/* Totals grid */}
              <div className="mt-6 grid grid-cols-2 gap-2 pt-5 border-t border-ash/40">
                <div className="bg-cinder border border-ash px-3 py-2.5 text-center">
                  <p className="font-display text-2xl text-ember leading-none">
                    {stats ? <Counter to={stats.totalAIInteractions} /> : '0'}
                  </p>
                  <p className="font-condensed text-[9px] tracking-[0.15em] uppercase text-charcoal mt-1">Total AI calls</p>
                </div>
                <div className="bg-cinder border border-ash px-3 py-2.5 text-center">
                  <p className="font-display text-2xl text-parchment leading-none">
                    {stats?.avgCoachCallsPerSolve ?? '—'}
                  </p>
                  <p className="font-condensed text-[9px] tracking-[0.15em] uppercase text-charcoal mt-1">Avg / solve</p>
                </div>
              </div>
            </section>

            {/* Quick stats */}
            <section className="border border-ash bg-obsidian/40 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-3.5 h-3.5 text-ember" />
                <h2 className="font-condensed text-xs tracking-[0.25em] uppercase text-charcoal">Stats</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Problems Solved', value: `${stats?.totalSolved ?? 0}` },
                  {
                    label: 'Best Remaining Time',
                    value: stats?.recentSolves.length
                      ? fmtTime(Math.max(...stats.recentSolves.map((s) => s.timeRemainingSeconds)))
                      : '—',
                  },
                  {
                    label: 'Favourite Language',
                    value: stats?.recentSolves.length
                      ? (stats.recentSolves.filter((s) => s.language === 'javascript').length >=
                         stats.recentSolves.filter((s) => s.language === 'python').length
                          ? 'JavaScript' : 'Python')
                      : '—',
                  },
                  {
                    label: 'Hardest Solved',
                    value: stats?.recentSolves.find((s) => s.difficulty === 'Hard')?.title
                      ?? stats?.recentSolves.find((s) => s.difficulty === 'Medium')?.title
                      ?? stats?.recentSolves[0]?.title
                      ?? '—',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-3">
                    <span className="font-condensed text-[10px] tracking-[0.15em] uppercase text-charcoal flex-shrink-0">
                      {label}
                    </span>
                    <span className="font-condensed text-xs text-parchment text-right truncate max-w-[180px]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Start practising CTA */}
            <Link
              href="/practice"
              className="flex items-center justify-center gap-2 w-full font-condensed text-sm tracking-[0.2em] uppercase bg-ember text-parchment border border-ember px-5 py-3.5 hover:bg-ember-bright hover:shadow-ember transition-all duration-200"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Enter Practice Room
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
