/* ═══════════════════════════════════════════════════
   LIB / USER-DATA
   All user progress stored in localStorage.
   SSR-safe: every function guards typeof window.

   Keys:
     codelash:profile  — main data blob
   ═══════════════════════════════════════════════════ */

const KEY = 'codelash:profile'

/* ── Types ──────────────────────────────────────── */

export interface SolvedEntry {
  problemId: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  solvedAt: string         // ISO 8601
  solveMethod: 'auto' | 'manual'
  language: 'javascript' | 'python'
  timeRemainingSeconds: number
  coachCallsUsed: number
  neetcodeCategory?: string
}

export interface AIEvent {
  type: 'coach' | 'interview'
  problemId: number
  at: string // ISO 8601
}

export interface UserProfile {
  /** keyed by problemId string for fast lookup */
  solved: Record<string, SolvedEntry>
  aiEvents: AIEvent[]
  createdAt: string
  lastActiveAt: string
}

/* ── Internal helpers ───────────────────────────── */

function isClient() {
  return typeof window !== 'undefined'
}

function defaultProfile(): UserProfile {
  return {
    solved: {},
    aiEvents: [],
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
  }
}

/* ── Load / Save ────────────────────────────────── */

export function loadProfile(): UserProfile {
  if (!isClient()) return defaultProfile()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultProfile()
    return JSON.parse(raw) as UserProfile
  } catch {
    return defaultProfile()
  }
}

function saveProfile(profile: UserProfile): void {
  if (!isClient()) return
  try {
    profile.lastActiveAt = new Date().toISOString()
    localStorage.setItem(KEY, JSON.stringify(profile))
  } catch { /* storage full */ }
}

/* ── Solve tracking ─────────────────────────────── */

export function markSolved(params: {
  problemId: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  language: 'javascript' | 'python'
  timeRemainingSeconds: number
  coachCallsUsed: number
  neetcodeCategory?: string
  method?: 'auto' | 'manual'
}): void {
  if (!isClient()) return
  const profile = loadProfile()
  const key = String(params.problemId)
  // Don't overwrite a previous auto-solve with a manual one
  const existing = profile.solved[key]
  if (existing?.solveMethod === 'auto' && params.method !== 'auto') return

  profile.solved[key] = {
    problemId: params.problemId,
    title: params.title,
    difficulty: params.difficulty,
    solvedAt: new Date().toISOString(),
    solveMethod: params.method ?? 'manual',
    language: params.language,
    timeRemainingSeconds: params.timeRemainingSeconds,
    coachCallsUsed: params.coachCallsUsed,
    neetcodeCategory: params.neetcodeCategory,
  }
  saveProfile(profile)
}

export function isSolved(problemId: number): boolean {
  if (!isClient()) return false
  const profile = loadProfile()
  return !!profile.solved[String(problemId)]
}

export function getSolvedEntry(problemId: number): SolvedEntry | undefined {
  if (!isClient()) return undefined
  return loadProfile().solved[String(problemId)]
}

export function getAllSolvedIds(): number[] {
  if (!isClient()) return []
  return Object.keys(loadProfile().solved).map(Number)
}

export function getSolvedList(): SolvedEntry[] {
  if (!isClient()) return []
  const profile = loadProfile()
  return Object.values(profile.solved).sort(
    (a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime(),
  )
}

/* ── AI usage ───────────────────────────────────── */

export function recordCoachCall(problemId: number): void {
  if (!isClient()) return
  const profile = loadProfile()
  profile.aiEvents.push({ type: 'coach', problemId, at: new Date().toISOString() })
  saveProfile(profile)
}

export function recordInterviewMessage(problemId: number): void {
  if (!isClient()) return
  const profile = loadProfile()
  profile.aiEvents.push({ type: 'interview', problemId, at: new Date().toISOString() })
  saveProfile(profile)
}

/* ── Aggregations ───────────────────────────────── */

export interface AggregatedStats {
  totalSolved: number
  solvedByDifficulty: { Easy: number; Medium: number; Hard: number }
  totalCoachCalls: number
  totalInterviewMessages: number
  totalAIInteractions: number
  solvedByCategory: Record<string, number>
  recentSolves: SolvedEntry[]
  avgCoachCallsPerSolve: number
}

export function getStats(): AggregatedStats {
  if (!isClient()) return emptyStats()

  const profile = loadProfile()
  const solveList = Object.values(profile.solved)

  const solvedByDifficulty = { Easy: 0, Medium: 0, Hard: 0 }
  const solvedByCategory: Record<string, number> = {}

  for (const s of solveList) {
    solvedByDifficulty[s.difficulty] = (solvedByDifficulty[s.difficulty] ?? 0) + 1
    if (s.neetcodeCategory) {
      solvedByCategory[s.neetcodeCategory] = (solvedByCategory[s.neetcodeCategory] ?? 0) + 1
    }
  }

  const coachCalls     = profile.aiEvents.filter((e) => e.type === 'coach').length
  const interviewMsgs  = profile.aiEvents.filter((e) => e.type === 'interview').length
  const totalSolved    = solveList.length

  return {
    totalSolved,
    solvedByDifficulty,
    totalCoachCalls: coachCalls,
    totalInterviewMessages: interviewMsgs,
    totalAIInteractions: coachCalls + interviewMsgs,
    solvedByCategory,
    recentSolves: solveList
      .sort((a, b) => new Date(b.solvedAt).getTime() - new Date(a.solvedAt).getTime())
      .slice(0, 20),
    avgCoachCallsPerSolve: totalSolved > 0
      ? Math.round((coachCalls / totalSolved) * 10) / 10
      : 0,
  }
}

function emptyStats(): AggregatedStats {
  return {
    totalSolved: 0,
    solvedByDifficulty: { Easy: 0, Medium: 0, Hard: 0 },
    totalCoachCalls: 0,
    totalInterviewMessages: 0,
    totalAIInteractions: 0,
    solvedByCategory: {},
    recentSolves: [],
    avgCoachCallsPerSolve: 0,
  }
}

export function clearAllData(): void {
  if (!isClient()) return
  localStorage.removeItem(KEY)
}
