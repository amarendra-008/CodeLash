/* ═══════════════════════════════════════════════════
   API ROUTE — /api/problems
   Parses public/Leetcode.csv server-side and returns
   the full problem list as JSON.

   Query params:
     ?neetcode=1  → only the 150 NeetCode problems
   ═══════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { parseProblemsCSV } from '@/lib/parse-csv'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Parse once per server lifetime
let _cache: ReturnType<typeof parseProblemsCSV> | null = null
function getProblems() {
  if (!_cache) _cache = parseProblemsCSV()
  return _cache
}

export function GET(req: NextRequest) {
  try {
    const neetcodeOnly = req.nextUrl.searchParams.get('neetcode') === '1'
    let problems = getProblems()
    if (neetcodeOnly) problems = problems.filter((p) => p.isNeetCode150)
    return NextResponse.json({ problems })
  } catch (err) {
    console.error('[Problems API]', err)
    return NextResponse.json({ problems: [] }, { status: 500 })
  }
}
