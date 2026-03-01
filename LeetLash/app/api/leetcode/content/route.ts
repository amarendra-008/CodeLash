/* ═══════════════════════════════════════════════════
   API ROUTE — /api/leetcode/content?slug=<titleSlug>
   Fetches full HTML problem content.

   Sources tried in order:
   1. LeetCode GraphQL (works in some environments)
   2. alfa-leetcode-api (public proxy, works from Vercel)
   ═══════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const LEETCODE_GQL = 'https://leetcode.com/graphql/'
const ALFA_BASE    = 'https://alfa-leetcode-api.onrender.com'

const QUERY = `
  query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      content
    }
  }
`

async function fromLeetCode(slug: string): Promise<string | null> {
  try {
    const res = await fetch(LEETCODE_GQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://leetcode.com',
        'Referer': 'https://leetcode.com/',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({ query: QUERY, variables: { titleSlug: slug } }),
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const json = await res.json() as { data?: { question?: { content?: string | null } } }
    return json?.data?.question?.content ?? null
  } catch {
    return null
  }
}

async function fromAlfa(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${ALFA_BASE}/select?titleSlug=${encodeURIComponent(slug)}`, {
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const json = await res.json() as { question?: string | null }
    return json?.question ?? null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ content: null }, { status: 400 })

  // Try LeetCode first, fall back to public proxy
  const content = (await fromLeetCode(slug)) ?? (await fromAlfa(slug))

  return NextResponse.json({ content }, {
    headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' },
  })
}
