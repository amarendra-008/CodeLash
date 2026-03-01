/* ═══════════════════════════════════════════════════
   LIB / SUPABASE / USER-DATA
   Async Supabase equivalents of lib/user-data.ts.
   All functions no-op (return safely) if the user
   is not authenticated.

   Dual-write pattern:
     - localStorage is written first (sync, instant)
     - Supabase is written async (fire-and-forget)
     - On first login, localStorage is migrated to DB
   ═══════════════════════════════════════════════════ */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProfile, AggregatedStats } from '@/lib/user-data'

/* ── Types (mirror DB columns) ───────────────────── */

interface SolvedRow {
  user_id: string
  problem_id: number
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  solved_at: string
  solve_method: 'auto' | 'manual'
  language: 'javascript' | 'python'
  time_remaining_seconds: number
  coach_calls_used: number
  neetcode_category: string | null
}

/* ── Auth guard ──────────────────────────────────── */

async function getUserId(supabase: SupabaseClient): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

/* ── Solve tracking ─────────────────────────────── */

export async function markSolvedDB(
  supabase: SupabaseClient,
  params: {
    problemId: number
    title: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    language: 'javascript' | 'python'
    timeRemainingSeconds: number
    coachCallsUsed: number
    neetcodeCategory?: string
    method?: 'auto' | 'manual'
  },
): Promise<void> {
  const userId = await getUserId(supabase)
  if (!userId) return

  // Check existing solve method to honour auto > manual priority
  const { data: existing } = await supabase
    .from('solved_problems')
    .select('solve_method')
    .eq('user_id', userId)
    .eq('problem_id', params.problemId)
    .maybeSingle()

  if (existing?.solve_method === 'auto' && params.method !== 'auto') return

  await supabase.from('solved_problems').upsert(
    {
      user_id: userId,
      problem_id: params.problemId,
      title: params.title,
      difficulty: params.difficulty,
      solved_at: new Date().toISOString(),
      solve_method: params.method ?? 'manual',
      language: params.language,
      time_remaining_seconds: params.timeRemainingSeconds,
      coach_calls_used: params.coachCallsUsed,
      neetcode_category: params.neetcodeCategory ?? null,
    } satisfies SolvedRow,
    { onConflict: 'user_id,problem_id' },
  )
}

export async function isSolvedDB(
  supabase: SupabaseClient,
  problemId: number,
): Promise<boolean> {
  const userId = await getUserId(supabase)
  if (!userId) return false

  const { data } = await supabase
    .from('solved_problems')
    .select('id')
    .eq('user_id', userId)
    .eq('problem_id', problemId)
    .maybeSingle()

  return !!data
}

/* ── AI usage ───────────────────────────────────── */

export async function recordCoachCallDB(
  supabase: SupabaseClient,
  problemId: number,
): Promise<void> {
  const userId = await getUserId(supabase)
  if (!userId) return

  await supabase.from('ai_events').insert({
    user_id: userId,
    type: 'coach',
    problem_id: problemId,
  })
}

export async function recordInterviewMessageDB(
  supabase: SupabaseClient,
  problemId: number,
): Promise<void> {
  const userId = await getUserId(supabase)
  if (!userId) return

  await supabase.from('ai_events').insert({
    user_id: userId,
    type: 'interview',
    problem_id: problemId,
  })
}

/* ── Aggregations ───────────────────────────────── */

export async function getStatsDB(
  supabase: SupabaseClient,
): Promise<AggregatedStats | null> {
  const userId = await getUserId(supabase)
  if (!userId) return null

  const [{ data: solves }, { data: events }] = await Promise.all([
    supabase
      .from('solved_problems')
      .select('*')
      .eq('user_id', userId),
    supabase
      .from('ai_events')
      .select('type, problem_id, created_at')
      .eq('user_id', userId),
  ])

  const solveList = (solves ?? []) as SolvedRow[]
  const eventList = (events ?? []) as { type: string; problem_id: number; created_at: string }[]

  const solvedByDifficulty = { Easy: 0, Medium: 0, Hard: 0 }
  const solvedByCategory: Record<string, number> = {}

  for (const s of solveList) {
    solvedByDifficulty[s.difficulty] = (solvedByDifficulty[s.difficulty] ?? 0) + 1
    if (s.neetcode_category) {
      solvedByCategory[s.neetcode_category] =
        (solvedByCategory[s.neetcode_category] ?? 0) + 1
    }
  }

  const coachCalls    = eventList.filter((e) => e.type === 'coach').length
  const interviewMsgs = eventList.filter((e) => e.type === 'interview').length
  const totalSolved   = solveList.length

  // Map DB rows → SolvedEntry shape used by the profile page
  const recentSolves = solveList
    .sort((a, b) => new Date(b.solved_at).getTime() - new Date(a.solved_at).getTime())
    .slice(0, 20)
    .map((s) => ({
      problemId: s.problem_id,
      title: s.title,
      difficulty: s.difficulty,
      solvedAt: s.solved_at,
      solveMethod: s.solve_method,
      language: s.language,
      timeRemainingSeconds: s.time_remaining_seconds,
      coachCallsUsed: s.coach_calls_used,
      neetcodeCategory: s.neetcode_category ?? undefined,
    }))

  return {
    totalSolved,
    solvedByDifficulty,
    totalCoachCalls: coachCalls,
    totalInterviewMessages: interviewMsgs,
    totalAIInteractions: coachCalls + interviewMsgs,
    solvedByCategory,
    recentSolves,
    avgCoachCallsPerSolve:
      totalSolved > 0 ? Math.round((coachCalls / totalSolved) * 10) / 10 : 0,
  }
}

/* ── Clear all data ─────────────────────────────── */

export async function clearAllDataDB(supabase: SupabaseClient): Promise<void> {
  const userId = await getUserId(supabase)
  if (!userId) return

  await Promise.all([
    supabase.from('solved_problems').delete().eq('user_id', userId),
    supabase.from('ai_events').delete().eq('user_id', userId),
  ])
}

/* ── Migration: localStorage → Supabase ─────────── */

const MIGRATED_KEY = (userId: string) => `codelash:migrated:${userId}`

export async function migrateLocalStorageToSupabase(
  supabase: SupabaseClient,
  localProfile: UserProfile,
): Promise<void> {
  const userId = await getUserId(supabase)
  if (!userId) return
  if (typeof window === 'undefined') return

  // Guard: only migrate once per user per browser
  if (localStorage.getItem(MIGRATED_KEY(userId))) return
  localStorage.setItem(MIGRATED_KEY(userId), '1')

  const solves = Object.values(localProfile.solved)
  if (solves.length === 0 && localProfile.aiEvents.length === 0) return

  // Batch-upsert solved problems
  if (solves.length > 0) {
    await supabase.from('solved_problems').upsert(
      solves.map((s) => ({
        user_id: userId,
        problem_id: s.problemId,
        title: s.title,
        difficulty: s.difficulty,
        solved_at: s.solvedAt,
        solve_method: s.solveMethod,
        language: s.language,
        time_remaining_seconds: s.timeRemainingSeconds,
        coach_calls_used: s.coachCallsUsed,
        neetcode_category: s.neetcodeCategory ?? null,
      } satisfies SolvedRow)),
      { onConflict: 'user_id,problem_id' },
    )
  }

  // Batch-insert AI events (no unique constraint, skip if too many)
  if (localProfile.aiEvents.length > 0 && localProfile.aiEvents.length <= 500) {
    await supabase.from('ai_events').insert(
      localProfile.aiEvents.map((e) => ({
        user_id: userId,
        type: e.type,
        problem_id: e.problemId,
        created_at: e.at,
      })),
    )
  }
}
