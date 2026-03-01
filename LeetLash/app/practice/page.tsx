'use client'

/* ═══════════════════════════════════════════════════
   PRACTICE ROOM — /practice
   The core grinding interface. Fletcher's domain.

   Layout (desktop):
   ┌── PracticeNav (fixed h-14) ──────────────────────┐
   │                                                   │
   ├── Left 58% ─────────┬── Right 42% ───────────────┤
   │ ProblemDescription  │ CodeEditor (flex-1)         │
   │ (scrollable)        │ ─────────────────────────── │
   │                     │ ControlsBar (shrink-0)      │
   │                     │ ─────────────────────────── │
   │                     │ GeminiCoach (collapsible)   │
   └─────────────────────┴─────────────────────────────┘

   Mobile: stacks vertically.
   ═══════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

import PracticeNav from '@/components/practice/PracticeNav'
import RoomPanel from '@/components/practice/RoomPanel'
import InterviewChat, { type InterviewChatHandle } from '@/components/practice/InterviewChat'
import type { RoomFormValues } from '@/components/create-room/RoomConfigForm'
import ProblemDescription from '@/components/practice/ProblemDescription'
import ControlsBar from '@/components/practice/ControlsBar'
import GeminiCoach, { type CoachMessage } from '@/components/practice/GeminiCoach'

import {
  PLACEHOLDER_PROBLEM,
  type Problem,
  type Language,
} from '@/lib/problems'
import { type EnrichedProblem } from '@/lib/parse-csv'
import { getSolution } from '@/lib/solutions'
import { markSolved, isSolved, recordCoachCall, recordInterviewMessage, loadProfile } from '@/lib/user-data'
import {
  markSolvedDB,
  isSolvedDB,
  recordCoachCallDB,
  recordInterviewMessageDB,
  migrateLocalStorageToSupabase,
} from '@/lib/supabase/user-data'
import { ID_TO_CATEGORY } from '@/lib/neetcode-ids'

/* ── Run output types ──────────────────────────────── */

interface TestCaseResult {
  passed: boolean
  caseIndex: number
  input: string
  expected: string
  actual: string | null
  error?: string
  description?: string
}

type RunOutput =
  | { type: 'text'; text: string }
  | { type: 'results'; results: TestCaseResult[]; passCount: number; totalCount: number }

/* ── CodeEditor: no SSR (CodeMirror needs browser APIs) */
const CodeEditor = dynamic(
  () => import('@/components/practice/CodeEditor'),
  { ssr: false, loading: () => <EditorSkeleton /> },
)

/* ─────────────────────────────────────────────────────
   CONSTANTS
   ───────────────────────────────────────────────────── */

const SESSION_DURATION = 45 * 60 // 45 minutes in seconds

/* Fletcher quips — shown as ambient UI flavour text */
const FLETCHER_QUIPS = [
  'Not quite my tempo.',
  'Pick up the pace.',
  'Again.',
  'You were rushing — and dragging.',
  'Do you even want this?',
  'Push harder or get out.',
  "That's not good enough.",
  'I will rip every last piece of you apart.',
  'Are you one of those people who need to feel inspired?',
]

/* ─────────────────────────────────────────────────────
   PAGE COMPONENT
   ───────────────────────────────────────────────────── */

interface StoredRoom extends RoomFormValues {
  roomId: string
  createdAt: number
  status: 'waiting' | 'active' | 'ended'
}

export default function PracticeRoomPage() {
  return (
    <Suspense>
      <PracticeRoom />
    </Suspense>
  )
}

function PracticeRoom() {
  /* ── Supabase auth ──────────────────────────────── */
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const sb = createClient()
    supabaseRef.current = sb
    sb.auth.getUser().then(({ data }) => setUser(data.user ?? null))

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        migrateLocalStorageToSupabase(sb, loadProfile()).catch(() => {})
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  /* ── Room state (loaded from ?room param) ──────── */
  const searchParams = useSearchParams()
  const roomId = searchParams.get('room')
  const [room, setRoom] = useState<StoredRoom | null>(null)
  const [showRoomPanel, setShowRoomPanel] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const chatRef = useRef<InterviewChatHandle>(null)

  useEffect(() => {
    if (!roomId) return
    try {
      const raw = localStorage.getItem(`codelash:room:${roomId}`)
      if (raw) setRoom(JSON.parse(raw) as StoredRoom)
    } catch { /* ignore */ }
  }, [roomId])

  /* ── All problems (loaded from CSV API) ────────── */
  const [allProblems, setAllProblems] = useState<EnrichedProblem[]>([])

  useEffect(() => {
    fetch('/api/problems')
      .then((r) => r.json())
      .then((d: { problems: EnrichedProblem[] }) => {
        if (d.problems?.length) setAllProblems(d.problems)
      })
      .catch(() => {/* use built-in fallback */})
  }, [])

  /* ── Problem state ─────────────────────────────── */
  // Initialize with placeholder so SSR and client agree (no Math.random on init).
  // useEffect below picks a real problem after CSV loads.
  const [problem, setProblem] = useState<Problem>(() => PLACEHOLDER_PROBLEM)

  /* ── Coach call counter (per problem) ──────────── */
  const [coachCallCount, setCoachCallCount] = useState(0)
  const [problemIsSolved, setProblemIsSolved] = useState(false)

  /* ── Editor state ──────────────────────────────── */
  const [language, setLanguage] = useState<Language>('javascript')
  const [code, setCode] = useState<string>(() => PLACEHOLDER_PROBLEM.starterCode.javascript)

  /* ── Lobby state — shown until user clicks BEGIN ── */
  const [showLobby, setShowLobby] = useState<boolean>(true)

  /* ── Timer state ───────────────────────────────── */
  const [timerSeconds, setTimerSeconds] = useState<number>(SESSION_DURATION)
  // Timer is paused in lobby; starts when user dismisses it
  const [timerActive, setTimerActive] = useState<boolean>(false)

  /* ── Coach state ───────────────────────────────── */
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([])
  const [isCoachLoading, setIsCoachLoading] = useState<boolean>(false)
  const [isCoachOpen, setIsCoachOpen] = useState<boolean>(false)

  /* ── Run output ────────────────────────────────── */
  const [isRunLoading, setIsRunLoading] = useState<boolean>(false)
  const [runOutput, setRunOutput] = useState<RunOutput | null>(null)

  /* ── Fetched content (for CSV problems without hardcoded description) */
  const [fetchedContent, setFetchedContent] = useState<string | null>(null)
  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false)

  /* ── Pressure flash overlay ────────────────────── */
  const [showPressureFlash, setShowPressureFlash] = useState<boolean>(false)
  const [quip, setQuip] = useState<string>('')
  const lastFlashSecond = useRef<number | null>(null)

  /* ── Pick a random problem once CSV loads ── */
  useEffect(() => {
    if (allProblems.length === 0) return
    const pick = allProblems[Math.floor(Math.random() * allProblems.length)]
    setProblem(pick)
  }, [allProblems]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sync solved state when problem changes ─────── */
  useEffect(() => {
    setProblemIsSolved(isSolved(problem.id))
    setCoachCallCount(0)
    setRunOutput(null)
    // Also check DB (async — may upgrade to true)
    if (user && supabaseRef.current) {
      isSolvedDB(supabaseRef.current, problem.id)
        .then((v) => { if (v) setProblemIsSolved(true) })
        .catch(() => {})
    }
  }, [problem.id, user])

  /* ── Fetch content from LeetCode when not cached locally ── */
  useEffect(() => {
    setFetchedContent(null)
    if (problem.examples.length > 0 || problem.constraints.length > 0) return
    // Problem has no local content — fetch from LeetCode API
    setIsFetchingContent(true)
    fetch(`/api/leetcode/content?slug=${encodeURIComponent(problem.titleSlug)}`)
      .then((r) => r.json())
      .then((d: { content: string | null }) => {
        setFetchedContent(d.content ?? null)
      })
      .catch(() => { setFetchedContent(null) })
      .finally(() => setIsFetchingContent(false))
  }, [problem.id]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Sync code when problem changes ────────────── */
  useEffect(() => {
    setCode(problem.starterCode[language])
  }, [problem.id]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Countdown timer ───────────────────────────── */
  useEffect(() => {
    if (!timerActive || timerSeconds <= 0) {
      if (timerSeconds <= 0) setTimerActive(false)
      return
    }
    const id = setTimeout(() => {
      setTimerSeconds((prev) => prev - 1)
    }, 1000)
    return () => clearTimeout(id)
  }, [timerSeconds, timerActive])

  /* ── Pressure flash triggers ──────────────────── */
  useEffect(() => {
    const FLASH_AT = [600, 300, 60] // 10min, 5min, 1min
    if (
      FLASH_AT.includes(timerSeconds) &&
      lastFlashSecond.current !== timerSeconds
    ) {
      lastFlashSecond.current = timerSeconds
      const randomQuip = FLETCHER_QUIPS[Math.floor(Math.random() * FLETCHER_QUIPS.length)]
      setQuip(randomQuip)
      setShowPressureFlash(true)
      setTimeout(() => setShowPressureFlash(false), 5000)
    }
  }, [timerSeconds])

  /* ── Load next problem ─────────────────────────── */
  const handleNextProblem = useCallback(() => {
    const pool = allProblems
    const available = pool.filter((p) => p.id !== problem.id)
    const next = available[Math.floor(Math.random() * available.length)] ?? pool[0]
    setProblem(next)
    setCode(next.starterCode[language])
    setRunOutput(null)
    setCoachMessages([])
    setCoachCallCount(0)
  }, [allProblems, problem.id, language])

  /* ── Language change ───────────────────────────── */
  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang)
      setCode(problem.starterCode[lang])
      setRunOutput(null)
    },
    [problem],
  )

  /* ── Dismiss lobby & start timer ───────────────── */
  const handleBegin = useCallback(() => {
    setShowLobby(false)
    setTimerActive(true)
  }, [])

  /* ── Reset code ────────────────────────────────── */
  const handleReset = useCallback(() => {
    setCode(problem.starterCode[language])
    setRunOutput(null)
  }, [problem, language])

  /* ── Show solution ─────────────────────────────── */
  const handleShowSolution = useCallback(() => {
    const solution = getSolution(problem.id, language)
    if (solution) {
      setCode(solution)
      setRunOutput(null)
    }
  }, [problem.id, language])

  /* ── Mark solved manually ──────────────────────────── */
  const handleMarkSolved = useCallback(() => {
    const params = {
      problemId: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      language,
      timeRemainingSeconds: timerSeconds,
      coachCallsUsed: coachCallCount,
      neetcodeCategory: ID_TO_CATEGORY.get(problem.id),
      method: 'manual' as const,
    }
    markSolved(params)
    if (user && supabaseRef.current) {
      markSolvedDB(supabaseRef.current, params).catch(() => {})
    }
    setProblemIsSolved(true)
  }, [problem, language, timerSeconds, coachCallCount, user])

  /* ── Run code against test cases ──────────────────── */
  const handleRun = useCallback(async () => {
    setIsRunLoading(true)
    setRunOutput(null)

    const stripped = code.replace(/\s/g, '')
    if (stripped === problem.starterCode[language].replace(/\s/g, '')) {
      setRunOutput({ type: 'text', text: '❌  No code written. Start typing.\n\nAgain.' })
      setIsRunLoading(false)
      return
    }

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, problemId: problem.id }),
      })

      const data = await res.json() as
        | { type: 'test_results'; results: TestCaseResult[]; passCount: number; totalCount: number }
        | { type: 'unsupported' | 'error'; message: string }

      if (data.type === 'test_results') {
        setRunOutput({
          type: 'results',
          results: data.results,
          passCount: data.passCount,
          totalCount: data.totalCount,
        })
        // Auto-mark solved when all test cases pass
        if (data.passCount === data.totalCount && data.totalCount > 0) {
          const autoParams = {
            problemId: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            language,
            timeRemainingSeconds: timerSeconds,
            coachCallsUsed: coachCallCount,
            neetcodeCategory: ID_TO_CATEGORY.get(problem.id),
            method: 'auto' as const,
          }
          markSolved(autoParams)
          if (user && supabaseRef.current) {
            markSolvedDB(supabaseRef.current, autoParams).catch(() => {})
          }
          setProblemIsSolved(true)
        }
      } else {
        setRunOutput({ type: 'text', text: data.message })
      }
    } catch (err) {
      setRunOutput({
        type: 'text',
        text: `❌  Run failed: ${err instanceof Error ? err.message : 'Network error'}`,
      })
    } finally {
      setIsRunLoading(false)
    }
  }, [code, language, problem])

  /* ── Submit to Gemini ──────────────────────────── */
  const handleSubmit = useCallback(async () => {
    if (isCoachLoading || timerSeconds <= 0) return

    setIsCoachLoading(true)
    setIsCoachOpen(true)

    try {
      const res = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemContent: problem.content,
          language,
          code,
        }),
      })

      const data = (await res.json()) as { feedback?: string; error?: string }
      const feedback =
        data.feedback ??
        data.error ??
        'Server error. Even I have off days. Fix your code.'

      setCoachMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          feedback,
          timestamp: new Date(),
        },
      ])

      // Track coach call usage
      recordCoachCall(problem.id)
      if (user && supabaseRef.current) {
        recordCoachCallDB(supabaseRef.current, problem.id).catch(() => {})
      }
      setCoachCallCount((prev) => prev + 1)

      // Notify interview chat — submission happened
      chatRef.current?.triggerEvent('submit_fail')
      setShowChat(true)
    } catch {
      setCoachMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          feedback:
            "Couldn't reach Fletcher.\n\nCheck your network. Then check your code.\n\nAgain.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsCoachLoading(false)
    }
  }, [code, language, problem, isCoachLoading, timerSeconds])

  /* ─────────────────────────────────────────────────
     RENDER
     ───────────────────────────────────────────────── */

  return (
    <>
      {/* ── Ambient spotlight — behind the editor ──── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 75% 50%, rgba(200,16,46,0.055) 0%, transparent 65%)',
        }}
      />

      {/* ── Noise texture overlay ─────────────────── */}
      <div
        aria-hidden="true"
        className="noise-overlay fixed inset-0 pointer-events-none z-0"
      />

      {/* ── Pressure flash overlay ────────────────── */}
      <AnimatePresence>
        {showPressureFlash && (
          <motion.div
            key="pressure-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            aria-live="assertive"
            aria-label={quip}
            className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
            style={{ background: 'rgba(200,16,46,0.07)' }}
          >
            <motion.p
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.18 }}
              exit={{ scale: 1.04, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-ember select-none"
              style={{ fontSize: 'clamp(4rem, 14vw, 10rem)', lineHeight: 0.9 }}
              aria-hidden="true"
            >
              {quip.toUpperCase().replace(/\.$/, '').split(' ')[0]}.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed navigation bar ─────────────────── */}
      <PracticeNav
        problemTitle={problem.title}
        timerSeconds={timerSeconds}
        onNextProblem={handleNextProblem}
        hasRoom={!!room}
        onRoomToggle={() => setShowRoomPanel((v) => !v)}
        onInterviewToggle={() => setShowChat((v) => !v)}
      />

      <RoomPanel
        room={room}
        roomId={roomId}
        isOpen={showRoomPanel}
        onClose={() => setShowRoomPanel(false)}
      />

      <InterviewChat
        ref={chatRef}
        problem={problem}
        code={code}
        language={language}
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        onMessageSent={() => {
          recordInterviewMessage(problem.id)
          if (user && supabaseRef.current) {
            recordInterviewMessageDB(supabaseRef.current, problem.id).catch(() => {})
          }
        }}
      />

      {/* ── Main split layout ─────────────────────── */}
      <main
        className="relative z-10 pt-14 flex flex-col lg:flex-row"
        style={{ height: '100dvh' }}
        aria-label="Practice Room"
      >
        {/* ── LEFT PANEL — Problem Description ─────── */}
        <section
          className="
            w-full lg:w-[58%]
            h-[45vh] lg:h-full
            border-b lg:border-b-0 lg:border-r border-ash
            overflow-y-auto
            flex-shrink-0
          "
          aria-label="Problem description"
        >
          <ProblemDescription
            problem={problem}
            contentOverride={fetchedContent}
            isLoadingContent={isFetchingContent}
          />
        </section>

        {/* Vertical divider (desktop) */}
        <div
          className="practice-divider hidden lg:block"
          aria-hidden="true"
        />

        {/* ── RIGHT PANEL — Editor + Controls + Coach */}
        <section
          className="flex-1 flex flex-col min-h-0 min-w-0"
          aria-label="Code editor and controls"
        >
          {/* Code editor — takes all remaining vertical space */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <CodeEditor
              code={code}
              onChange={setCode}
              language={language}
              isLoading={isCoachLoading}
              className="h-full"
            />
          </div>

          {/* Run output (if any) */}
          <AnimatePresence>
            {runOutput && (
              <motion.div
                key="run-output"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex-shrink-0 border-t border-ash bg-obsidian/50 overflow-hidden"
              >
                {/* Output header */}
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-ash/50">
                  {runOutput.type === 'results' ? (
                    <div className="flex items-center gap-2">
                      <span className="font-condensed text-xs text-charcoal tracking-widest uppercase">
                        Test Cases
                      </span>
                      <span
                        className={`font-condensed text-xs tracking-wider px-1.5 py-0.5 border ${
                          runOutput.passCount === runOutput.totalCount
                            ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/8'
                            : 'text-ember border-ember/30 bg-ember/8'
                        }`}
                      >
                        {runOutput.passCount}/{runOutput.totalCount} passed
                      </span>
                    </div>
                  ) : (
                    <span className="font-condensed text-xs text-charcoal tracking-widest uppercase">
                      Output
                    </span>
                  )}
                  <button
                    onClick={() => setRunOutput(null)}
                    className="font-condensed text-xs text-charcoal hover:text-dust transition-colors"
                    aria-label="Close run output"
                  >
                    ✕
                  </button>
                </div>

                {/* Output body */}
                {runOutput.type === 'text' ? (
                  <pre className="font-mono text-xs text-bone px-4 py-3 whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {runOutput.text}
                  </pre>
                ) : (
                  <div className="max-h-44 overflow-y-auto px-4 py-2 space-y-1.5">
                    {runOutput.results.map((r) => (
                      <div key={r.caseIndex} className="flex items-start gap-2">
                        {/* Pass/fail indicator */}
                        <span
                          className={`font-mono text-xs mt-0.5 flex-shrink-0 ${r.passed ? 'text-emerald-400' : 'text-ember'}`}
                          aria-hidden="true"
                        >
                          {r.passed ? '✓' : '✗'}
                        </span>

                        <div className="min-w-0">
                          {/* Input line */}
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="font-condensed text-[10px] tracking-wider text-charcoal uppercase">
                              Case {r.caseIndex + 1}
                            </span>
                            <span className="font-mono text-[11px] text-bone truncate">
                              {r.input}
                            </span>
                          </div>

                          {/* Failure details */}
                          {!r.passed && (
                            <div className="mt-0.5 space-y-0.5">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-condensed text-[10px] text-charcoal uppercase tracking-wider w-16 flex-shrink-0">
                                  Expected
                                </span>
                                <span className="font-mono text-[11px] text-emerald-400">
                                  {r.expected}
                                </span>
                              </div>
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-condensed text-[10px] text-charcoal uppercase tracking-wider w-16 flex-shrink-0">
                                  Got
                                </span>
                                <span className="font-mono text-[11px] text-red-400">
                                  {r.error ?? r.actual ?? 'undefined'}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls bar */}
          <ControlsBar
            language={language}
            onLanguageChange={handleLanguageChange}
            onRun={handleRun}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onShowSolution={handleShowSolution}
            onMarkSolved={handleMarkSolved}
            isSolved={problemIsSolved}
            isSubmitLoading={isCoachLoading}
            isRunLoading={isRunLoading}
            timerSeconds={timerSeconds}
          />

          {/* Gemini Coach panel */}
          <GeminiCoach
            messages={coachMessages}
            isOpen={isCoachOpen}
            isLoading={isCoachLoading}
            onToggle={() => setIsCoachOpen((v) => !v)}
          />
        </section>
      </main>

      {/* ── Time's up overlay ─────────────────────── */}
      <AnimatePresence>
        {timerSeconds <= 0 && (
          <TimesUpOverlay onDismiss={() => {
            setTimerSeconds(SESSION_DURATION)
            setTimerActive(true)
          }} onReview={() => {
            chatRef.current?.triggerEvent('timeout')
            setShowChat(true)
          }} />
        )}
      </AnimatePresence>

      {/* ── Lobby overlay — shown on first entry ──── */}
      <AnimatePresence>
        {showLobby && (
          <PracticeLobby problem={problem} onBegin={handleBegin} />
        )}
      </AnimatePresence>
    </>
  )
}

/* ─────────────────────────────────────────────────────
   PRACTICE LOBBY
   Shown on page load before the timer starts.
   The user must click BEGIN. to enter the room.
   ───────────────────────────────────────────────────── */

function PracticeLobby({
  problem,
  onBegin,
}: {
  problem: Problem
  onBegin: () => void
}) {
  return (
    <motion.div
      key="lobby"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void"
      role="dialog"
      aria-modal="true"
      aria-label="Practice room lobby"
    >
      {/* Film grain */}
      <div className="noise-overlay absolute inset-0" aria-hidden="true" />

      {/* Spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 65% at 50% 45%, rgba(200,16,46,0.14) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-2xl mx-auto space-y-8">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-condensed text-xs tracking-[0.35em] uppercase text-ember"
        >
          Practice Room
        </motion.p>

        {/* Difficulty badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="flex items-center justify-center gap-3"
        >
          <span
            className="font-condensed text-xs tracking-[0.2em] uppercase px-3 py-1 border"
            style={{
              borderColor:
                problem.difficulty === 'Easy'
                  ? 'rgba(34,197,94,0.5)'
                  : problem.difficulty === 'Hard'
                  ? 'rgba(200,16,46,0.5)'
                  : 'rgba(232,93,4,0.5)',
              color:
                problem.difficulty === 'Easy'
                  ? '#4ade80'
                  : problem.difficulty === 'Hard'
                  ? '#ef233c'
                  : '#f97316',
            }}
          >
            {problem.difficulty}
          </span>
          <span className="font-condensed text-xs text-charcoal tracking-wider">
            45:00 on the clock
          </span>
        </motion.div>

        {/* Problem title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-parchment leading-none"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
        >
          {problem.title}
        </motion.h1>

        {/* Fletcher line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-literary italic text-dust text-lg"
        >
          "The clock starts when you do. Not before."
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'center' }}
          className="divider-ember max-w-xs mx-auto"
          aria-hidden="true"
        />

        {/* BEGIN button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.button
            onClick={onBegin}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            autoFocus
            className="
              relative font-display text-parchment tracking-widest
              bg-ember border border-ember px-16 py-5
              hover:bg-ember-bright hover:shadow-ember-lg
              transition-all duration-200 animate-pulse-ember
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-parchment focus-visible:outline-offset-4
              overflow-hidden group
            "
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            aria-label="Begin practice session"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-ember via-ember-bright to-ember
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <span className="relative z-10">BEGIN.</span>
          </motion.button>

          <p className="mt-4 font-condensed text-xs text-charcoal tracking-wider">
            Press Enter or click to start — the timer is watching.
          </p>
        </motion.div>

        {/* Multiplayer hook */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <span className="h-px flex-1 bg-ash" aria-hidden="true" />
          <Link
            href="/create-room"
            className="font-condensed text-xs tracking-[0.25em] uppercase text-charcoal
              hover:text-ember transition-colors duration-200 whitespace-nowrap"
          >
            Create Multiplayer Room
          </Link>
          <span className="h-px flex-1 bg-ash" aria-hidden="true" />
        </motion.div>

      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   TIME'S UP OVERLAY
   Full-screen Fletcher moment when the clock hits zero.
   ───────────────────────────────────────────────────── */

function TimesUpOverlay({ onDismiss, onReview }: { onDismiss: () => void; onReview?: () => void }) {
  return (
    <motion.div
      key="times-up"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-void/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Session ended"
    >
      {/* Film-grain overlay */}
      <div className="noise-overlay absolute inset-0" aria-hidden="true" />

      {/* Spotlight */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,16,46,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-8 space-y-8">
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="font-condensed text-sm tracking-[0.3em] uppercase text-ember"
        >
          Session Ended
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display text-ember leading-none"
          style={{ fontSize: 'clamp(4rem, 12vw, 8rem)' }}
        >
          TIME'S UP.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="font-literary italic text-dust text-xl max-w-md mx-auto"
        >
          "There are no two words in the English language more harmful than{' '}
          <em>good job</em>."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onDismiss}
            className="
              font-condensed text-sm tracking-[0.15em] uppercase
              bg-ember text-parchment border border-ember px-10 py-4
              hover:bg-ember-bright hover:shadow-ember transition-all duration-200
              animate-pulse-ember focus-visible:outline focus-visible:outline-2 focus-visible:outline-parchment focus-visible:outline-offset-4
            "
            aria-label="Reset timer and continue practicing"
          >
            Again.
          </button>
          {onReview && (
            <button
              onClick={onReview}
              className="
                font-condensed text-sm tracking-[0.15em] uppercase
                border border-ash text-charcoal px-10 py-4
                hover:border-ember/40 hover:text-slate transition-all duration-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4
              "
              aria-label="Review with AI coach"
            >
              Review with Coach
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────
   EDITOR SKELETON
   Shown while CodeMirror loads dynamically.
   ───────────────────────────────────────────────────── */

function EditorSkeleton() {
  return (
    <div
      className="h-full bg-void flex flex-col"
      aria-label="Loading editor"
      role="status"
    >
      {/* Fake tab bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-cinder border-b border-ash">
        <span className="w-1.5 h-1.5 rounded-full bg-ember/30 animate-breathe" />
        <span className="font-mono text-xs text-charcoal/50 tracking-wider uppercase">
          Loading Editor…
        </span>
      </div>
      {/* Fake lines */}
      <div className="flex-1 p-4 space-y-2 animate-pulse">
        {[75, 55, 90, 40, 65, 80, 50].map((w, i) => (
          <div
            key={i}
            className="h-3 bg-ash/40 rounded-none"
            style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
