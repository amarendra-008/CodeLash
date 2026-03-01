/* ═══════════════════════════════════════════════════
   API ROUTE — /api/leetcode/content?slug=<titleSlug>
   Server-side proxy to LeetCode's public GraphQL API.
   Returns the HTML problem content for any free problem.
   ═══════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const LEETCODE_GQL = 'https://leetcode.com/graphql/'

const QUERY = `
  query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      content
    }
  }
`

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) {
    return NextResponse.json({ content: null }, { status: 400 })
  }

  try {
    const res = await fetch(LEETCODE_GQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com/',
        'User-Agent': 'Mozilla/5.0 (compatible; CodeLash/1.0)',
      },
      body: JSON.stringify({ query: QUERY, variables: { titleSlug: slug } }),
      signal: AbortSignal.timeout(8000),
    })

    if (!res.ok) {
      return NextResponse.json({ content: null }, { status: 502 })
    }

    const json = await res.json() as {
      data?: { question?: { content?: string | null } }
    }
    const content = json?.data?.question?.content ?? null

    return NextResponse.json({ content }, {
      headers: { 'Cache-Control': 'public, max-age=86400' },
    })
  } catch {
    return NextResponse.json({ content: null }, { status: 502 })
  }
}
