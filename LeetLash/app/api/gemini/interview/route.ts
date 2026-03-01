/* ═══════════════════════════════════════════════════
   API ROUTE — /api/gemini/interview
   Multi-turn AI conversation with two personas:

   • INTERVIEWER — technical interviewer who probes
     understanding without giving answers.
   • COACH — after failure/timeout, switches to
     teaching mode with progressive hints.

   Body: {
     problem:  { title: string, content: string },
     code:     string,
     history:  Array<{ role: 'user'|'model', text: string }>,
     mode:     'interviewer' | 'coach',
     event:    'start' | 'message' | 'submit_fail' | 'timeout',
     language: string,
   }
   Returns: { message: string } | { error: string }
   ═══════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/* ── System Prompts ─────────────────────────────────── */

const INTERVIEWER_PROMPT = (title: string) => `
You are Alex — a sharp, no-nonsense senior engineer at a top-tier tech company running a coding interview.
The candidate is working on: "${title}".

Your rules as the INTERVIEWER:
- Open by briefly acknowledging the problem and asking how they would approach it
- Probe their thinking BEFORE they code: approach, edge cases, complexity
- Ask about time and space complexity (Big O) — push them to be precise
- React to their code when they share it: what's right, what's wrong, what's missing
- Ask Socratic follow-up questions — guide without giving answers
- If they're stuck, narrow the question, don't hand them the solution
- Keep every response SHORT: 2–4 sentences. Real interviews are tight.
- Tone: professional, direct, slightly intense. Think senior engineer who has seen a thousand interviews.
- NEVER write the solution or pseudocode for them.
- NEVER break character.
`.trim()

const COACH_PROMPT = (title: string) => `
You are a technical coach. The candidate has struggled with "${title}" and the pressure is off — now you teach.

Your rules as the COACH:
- Start by identifying the core concept or insight they missed
- Give progressive hints: approach first, then more detail only if they ask
- Explain the algorithm or data structure clearly and concisely
- When reviewing code, be specific: "This fails because X. Fix it by doing Y."
- You CAN share pseudocode to illustrate a concept — but push them to write the real code
- Keep the directness: efficient, no fluff, no false praise
- Break down complex steps. One idea at a time.
- Tone: strict but invested mentor. "Here's what you missed. Here's how to think about it."
`.trim()

/* ── Event-specific injections ──────────────────────── */

function buildUserTurn(
  event: string,
  userMessage: string,
  code: string,
  language: string,
): string {
  switch (event) {
    case 'start':
      return `[INTERVIEW STARTING] The candidate has just opened the problem. Greet them and get the interview underway.`
    case 'submit_fail':
      return `[CODE SUBMITTED — INCORRECT or INCOMPLETE]\nCandidate's ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\nReview their submission. Point out what's wrong and what they need to fix.`
    case 'submit_pass':
      return `[CODE SUBMITTED — CORRECT]\nCandidate's ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\nAcknowledge the correct solution and probe for optimisation or edge cases.`
    case 'timeout':
      return `[TIME'S UP — Session ended.]\nCandidate's final ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\nWrap up the interview. Be honest about where they fell short. Switch to teaching what they missed.`
    case 'code_snapshot':
      return `[CURRENT CODE]\nHere is the candidate's current ${language} code:\n\`\`\`${language}\n${code}\n\`\`\`\n${userMessage}`
    default:
      return userMessage
  }
}

/* ── Demo responses ─────────────────────────────────── */

const DEMO_INTERVIEWER = [
  `Walk me through how you're thinking about this. What's your initial approach before you touch the keyboard?`,
  `Interesting. What's the time complexity of that approach? And can we do better?`,
  `You've started coding — good. Talk me through what you're building as you go. I want to hear your reasoning.`,
]

const DEMO_COACH = [
  `No API key set — but let me coach you anyway. The key insight you're probably missing: think about what data structure gives you O(1) lookup. A hash map is your friend here.`,
  `The brute force works but costs you O(n²). The optimised path uses a sliding window or two-pointer technique. Start there.`,
  `Here's what you missed: the problem has an overlapping-subproblem structure. That screams dynamic programming. Break it into base cases first.`,
]

/* ── Route handler ──────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      problem: { title: string; content: string }
      code: string
      history: Array<{ role: 'user' | 'model'; text: string }>
      mode: 'interviewer' | 'coach'
      event: string
      language: string
      userMessage?: string
    }

    const {
      problem,
      code = '',
      history = [],
      mode = 'interviewer',
      event = 'message',
      language = 'javascript',
      userMessage = '',
    } = body

    /* No API key — return demo response */
    if (!process.env.GEMINI_API_KEY) {
      const pool = mode === 'coach' ? DEMO_COACH : DEMO_INTERVIEWER
      const idx = history.length % pool.length
      return NextResponse.json({ message: pool[idx] })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    // Always give the AI a live view of the candidate's code
    const codeContext = code?.trim()
      ? `\n\nThe candidate's current ${language} code (live snapshot):\n\`\`\`${language}\n${code}\n\`\`\``
      : '\n\nThe candidate has not written any code yet.'

    const systemInstruction =
      (mode === 'coach' ? COACH_PROMPT(problem.title) : INTERVIEWER_PROMPT(problem.title))
      + codeContext

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction,
      generationConfig: {
        maxOutputTokens: 300,
        temperature: 0.85,
      },
    })

    /* Reconstruct history for multi-turn context.
       Gemini requires history to start with role 'user'.
       If the stored history opens with a model message (the AI's
       greeting), prepend the original start trigger so the pair
       is valid: user → model → user → model … */
    let geminiHistory = history.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }))

    if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
      geminiHistory = [
        {
          role: 'user' as const,
          parts: [{ text: buildUserTurn('start', '', '', language) }],
        },
        ...geminiHistory,
      ]
    }

    const chat = model.startChat({ history: geminiHistory })

    const turn = buildUserTurn(event, userMessage, code, language)

    const result = await chat.sendMessage(turn)
    const message = result.response.text().trim()

    return NextResponse.json({ message })
  } catch (err) {
    console.error('[Gemini Interview] Error:', err)
    return NextResponse.json(
      { message: `The interviewer stepped out. Check your API key and try again.\n\n(${err instanceof Error ? err.message : 'Unknown error'})` },
      { status: 200 },
    )
  }
}
