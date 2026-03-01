/* ═══════════════════════════════════════════════════
   LIB / PARSE-CSV  (server-side only)
   Reads public/Leetcode.csv with Node fs, parses it,
   and returns an EnrichedProblem array.
   Problem content is fetched on demand from LeetCode's
   API via /api/leetcode/content.

   Used only by app/api/problems/route.ts — never
   imported directly by client components.
   ═══════════════════════════════════════════════════ */

import fs from 'fs'
import path from 'path'
import { type Problem, type Difficulty } from '@/lib/problems'
import { NEETCODE_150_SET, ID_TO_CATEGORY, type NeetCodeCategory } from '@/lib/neetcode-ids'
import { getStarterCode } from '@/lib/neetcode-starters'

export interface EnrichedProblem extends Problem {
  neetcodeCategory?: NeetCodeCategory
  leetcodeUrl: string
  isNeetCode150: boolean
}

/* ── CSV parser (handles quoted fields) ─────────── */

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current.trim())
  return result
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function parseDifficulty(raw: string): Difficulty {
  const d = raw.trim()
  if (d === 'Easy') return 'Easy'
  if (d === 'Hard') return 'Hard'
  return 'Medium'
}

/* ── Main export ────────────────────────────────── */

export function parseProblemsCSV(): EnrichedProblem[] {
  const csvPath = path.join(process.cwd(), 'public', 'Leetcode.csv')

  if (!fs.existsSync(csvPath)) return []

  const text  = fs.readFileSync(csvPath, 'utf-8')
  const lines = text.split('\n')

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim())
  const col = (name: string) => headers.findIndex((h) => h.includes(name))

  const idxId         = col('id')
  const idxTitle      = col('title')
  const idxDiff       = col('difficulty')
  const idxLink       = col('link')
  const idxTopics     = col('topics')
  const idxAcceptance = col('acceptance')
  const idxPremium    = col('premium')
  const idxCategory   = col('category')

  const problems: EnrichedProblem[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    const cols = parseCSVLine(line)
    const id   = parseInt(cols[idxId] ?? '', 10)
    if (!id || isNaN(id)) continue

    const isPremium = (cols[idxPremium] ?? '').toLowerCase() === 'true'
    if (isPremium) continue
    const category = (cols[idxCategory] ?? '').trim()
    if (category && category !== 'Algorithms') continue

    const title      = (cols[idxTitle] ?? '').trim()
    const diff       = parseDifficulty(cols[idxDiff] ?? '')
    const link       = (cols[idxLink] ?? '').trim()
    const topics     = (cols[idxTopics] ?? '').split(',').map((t) => t.trim()).filter(Boolean)
    const acceptance = parseFloat(cols[idxAcceptance] ?? '0') || 0
    const slug       = toSlug(title)

    problems.push({
      id,
      title,
      titleSlug: slug,
      difficulty: diff,
      acceptanceRate: acceptance,
      tags: topics,
      content: '',
      examples: [],
      constraints: [],
      starterCode: {
        javascript: getStarterCode(id, 'javascript'),
        python: getStarterCode(id, 'python'),
      },
      neetcodeCategory: ID_TO_CATEGORY.get(id),
      leetcodeUrl: link || `https://leetcode.com/problems/${slug}/`,
      isNeetCode150: NEETCODE_150_SET.has(id),
    })
  }

  // NeetCode 150 first, then by ID
  problems.sort((a, b) => {
    if (a.isNeetCode150 !== b.isNeetCode150) return a.isNeetCode150 ? -1 : 1
    return a.id - b.id
  })

  return problems
}
