/* ═══════════════════════════════════════════════════
   LIB / TEST-CASES
   Structured test cases for all 10 problems.
   Used by /api/run to execute and compare results.
   ═══════════════════════════════════════════════════ */

export interface TestCase {
  args: unknown[]
  expected: unknown
  description?: string
}

/**
 * How to compare actual vs expected:
 * - default:        JSON.stringify equality
 * - sorted-array:   sort both flat arrays numerically, then compare
 * - sorted-2d-array: sort inner arrays + sort outer, then compare
 */
export type CompareMode = 'default' | 'sorted-array' | 'sorted-2d-array'

export interface ProblemTestConfig {
  problemId: number
  functionName: string
  cases: TestCase[]
  compare?: CompareMode
}

export const TEST_CONFIGS: ProblemTestConfig[] = [
  /* ── 1. Two Sum ──────────────────────────────────── */
  {
    problemId: 1,
    functionName: 'twoSum',
    compare: 'sorted-array', // any order is valid
    cases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], description: 'Basic' },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
      { args: [[1, 2, 3, 4, 5], 9], expected: [3, 4] },
    ],
  },

  /* ── 20. Valid Parentheses ───────────────────────── */
  {
    problemId: 20,
    functionName: 'isValid',
    cases: [
      { args: ['()'], expected: true },
      { args: ['()[]{}'], expected: true },
      { args: ['(]'], expected: false },
      { args: ['([)]'], expected: false },
      { args: ['{[]}'], expected: true },
      { args: [''], expected: true },
    ],
  },

  /* ── 70. Climbing Stairs ─────────────────────────── */
  {
    problemId: 70,
    functionName: 'climbStairs',
    cases: [
      { args: [1], expected: 1 },
      { args: [2], expected: 2 },
      { args: [3], expected: 3 },
      { args: [5], expected: 8 },
      { args: [10], expected: 89 },
    ],
  },

  /* ── 121. Best Time to Buy and Sell Stock ────────── */
  {
    problemId: 121,
    functionName: 'maxProfit',
    cases: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[1, 2]], expected: 1 },
      { args: [[2, 4, 1]], expected: 2 },
    ],
  },

  /* ── 53. Maximum Subarray ────────────────────────── */
  {
    problemId: 53,
    functionName: 'maxSubArray',
    cases: [
      { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
      { args: [[1]], expected: 1 },
      { args: [[5, 4, -1, 7, 8]], expected: 23 },
      { args: [[-1]], expected: -1 },
      { args: [[-2, -1]], expected: -1 },
    ],
  },

  /* ── 3. Longest Substring Without Repeating Chars ── */
  {
    problemId: 3,
    functionName: 'lengthOfLongestSubstring',
    cases: [
      { args: ['abcabcbb'], expected: 3 },
      { args: ['bbbbb'], expected: 1 },
      { args: ['pwwkew'], expected: 3 },
      { args: [''], expected: 0 },
      { args: [' '], expected: 1 },
      { args: ['au'], expected: 2 },
    ],
  },

  /* ── 15. 3Sum ────────────────────────────────────── */
  {
    problemId: 15,
    functionName: 'threeSum',
    compare: 'sorted-2d-array',
    cases: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
    ],
  },

  /* ── 198. House Robber ───────────────────────────── */
  {
    problemId: 198,
    functionName: 'rob',
    cases: [
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[2, 7, 9, 3, 1]], expected: 12 },
      { args: [[2, 1, 1, 2]], expected: 4 },
      { args: [[0]], expected: 0 },
    ],
  },

  /* ── 56. Merge Intervals ─────────────────────────── */
  {
    problemId: 56,
    functionName: 'merge',
    compare: 'sorted-2d-array',
    cases: [
      {
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]],
      },
      {
        args: [[[1, 4], [4, 5]]],
        expected: [[1, 5]],
      },
      {
        args: [[[1, 4], [0, 4]]],
        expected: [[0, 4]],
      },
    ],
  },

  /* ── 704. Binary Search ──────────────────────────── */
  {
    problemId: 704,
    functionName: 'search',
    cases: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[5], -5], expected: -1 },
    ],
  },
]

/** Look up the test config for a problem by its numeric ID. */
export function getTestConfig(problemId: number): ProblemTestConfig | undefined {
  return TEST_CONFIGS.find((c) => c.problemId === problemId)
}
