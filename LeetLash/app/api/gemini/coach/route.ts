/* ═══════════════════════════════════════════════════
   API ROUTE — /api/gemini/coach
   POST  →  Sends problem + code to Gemini, returns
            Fletcher-style brutal feedback.

   Body: { problemTitle, problemContent, language, code }
   Returns: { feedback: string } | { error: string }
   ═══════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { getGeminiModel, buildCoachPrompt } from '@/lib/gemini'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { problemTitle, problemContent, language, code } = body as {
      problemTitle: string
      problemContent: string
      language: string
      code: string
    }

    /* ── Validation ──────────────────────────────── */
    if (!code?.trim()) {
      return NextResponse.json(
        {
          feedback:
            'You submitted nothing.\n\nNothing.\n\nGet out of my practice room.',
        },
        { status: 200 },
      )
    }

    /* ── Check for API key presence ──────────────── */
    if (!process.env.GEMINI_API_KEY) {
      // Return a demo Fletcher response so the UI still works
      return NextResponse.json({
        feedback: demoFletcher(code),
      })
    }

    /* ── Call Gemini ─────────────────────────────── */
    const model = getGeminiModel()
    const prompt = buildCoachPrompt({
      problemTitle: problemTitle ?? 'Unknown Problem',
      problemContent: problemContent ?? '',
      language: language ?? 'javascript',
      code,
    })

    const result = await model.generateContent(prompt)
    const feedback = result.response.text()

    return NextResponse.json({ feedback })
  } catch (err) {
    console.error('[Gemini Coach] Error:', err)

    const message =
      err instanceof Error ? err.message : 'Unknown server error'

    // Graceful degradation — still show something Fletcher-esque
    return NextResponse.json(
      {
        feedback: `Fletcher's line is down. Even I have off days.\n\nFix your code in the meantime. You know what's wrong.\n\n(Server error: ${message})`,
      },
      { status: 200 },
    )
  }
}

/* ─────────────────────────────────────────────────────
   DEMO FLETCHER — deterministic response when no key
   Cycles through brutal quotes based on code length.
   ───────────────────────────────────────────────────── */

const DEMO_RESPONSES = [
  `You haven't set a GEMINI_API_KEY yet.\n\nThat's your first mistake. Add it to .env.local.\n\nIn the meantime — look at that code. Really look at it.\n\nNot quite my tempo.`,
  `No API key. No Fletcher. Just you and your broken code.\n\nAdd GEMINI_API_KEY to .env.local and come back when you're serious.\n\nAgain.`,
  `Demo mode. Even in demo mode you submitted that?\n\nSet GEMINI_API_KEY in .env.local.\n\nI can't help you if you won't help yourself.`,
]

function demoFletcher(code: string): string {
  const idx = Math.floor(code.length % DEMO_RESPONSES.length)
  return DEMO_RESPONSES[idx]
}
