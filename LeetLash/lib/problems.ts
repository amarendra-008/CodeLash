/* ═══════════════════════════════════════════════════
   LIB / PROBLEMS
   Type definitions for the problem model.
   Problem data comes from public/Leetcode.csv via
   /api/problems, with content fetched on demand from
   LeetCode's API via /api/leetcode/content.
   ═══════════════════════════════════════════════════ */

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Language = 'javascript' | 'python'

export interface Problem {
  id: number
  title: string
  titleSlug: string
  difficulty: Difficulty
  acceptanceRate: number
  tags: string[]
  /** Raw HTML string from LeetCode — render with dangerouslySetInnerHTML */
  content: string
  examples: Array<{
    input: string
    output: string
    explanation?: string
  }>
  constraints: string[]
  starterCode: Record<Language, string>
}

/** Placeholder used as initial state before CSV loads (avoids SSR mismatch). */
export const PLACEHOLDER_PROBLEM: Problem = {
  id: 0,
  title: 'Loading…',
  titleSlug: '',
  difficulty: 'Easy',
  acceptanceRate: 0,
  tags: [],
  content: '',
  examples: [],
  constraints: [],
  starterCode: {
    javascript: '// Loading problem...',
    python: '# Loading problem...',
  },
}

/** Difficulty badge colours (Tailwind classes). */
export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Easy: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/8',
  Medium: 'text-amber-400 border-amber-400/40 bg-amber-400/8',
  Hard: 'text-ember border-ember/40 bg-ember/8',
}
