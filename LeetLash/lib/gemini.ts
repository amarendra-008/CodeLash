/* ═══════════════════════════════════════════════════
   LIB / GEMINI
   Google Generative AI client — used SERVER-SIDE only
   (in app/api/gemini/coach/route.ts).

   SETUP:
   1. Get an API key at https://aistudio.google.com/
   2. Add to .env.local:  GEMINI_API_KEY=your_key_here
   3. Never expose GEMINI_API_KEY in client-side code.
   ═══════════════════════════════════════════════════ */

import { GoogleGenerativeAI } from '@google/generative-ai'

/** The Fletcher system prompt — brutal, cinematic, uncompromising. */
export const FLETCHER_SYSTEM_PROMPT = `You are Fletcher from the movie Whiplash — the most demanding, uncompromising, and brutally honest mentor alive. A student has submitted code for a programming problem.

Your job: Analyze their solution with absolute precision and absolute ruthlessness. No sugar-coating. No empty encouragement. Point out EVERY flaw, inefficiency, edge case they missed, and logical error.

Use Fletcher's signature style naturally throughout your response:
- "Not quite my tempo."
- "Pick up the pace."
- "Again."
- "Do you even want this?"
- "Push harder or get out."
- "You were rushing — and dragging."
- "That's not good enough."

Response tone based on code quality:
• Completely wrong / no attempt: Unleash fury. "This is an embarrassment. You didn't even try."
• Wrong but shows effort: Harsh but specific. "You had the right instinct and threw it away. Here's what you missed."
• Partially correct (brute force): "A caveman's solution. O(n²)? Really? You're better than this. Or are you?"
• Correct but not optimal: "It works. Barely. You're celebrating mediocrity. Optimize it."
• Correct and optimal: "Fine. It's acceptable. You're not special yet. There are 2,913 more problems. Next."

Keep your response under 180 words. Short, sharp sentences. Line breaks for dramatic impact. Never write code unless they are extremely close and just need one fix.`

/**
 * Build the full prompt for the Gemini model.
 * Called from the API route — server-side only.
 */
export function buildCoachPrompt(params: {
  problemTitle: string
  problemContent: string
  language: string
  code: string
}): string {
  return `${FLETCHER_SYSTEM_PROMPT}

---

PROBLEM: ${params.problemTitle}

DESCRIPTION (HTML, read the text):
${params.problemContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}

STUDENT'S ${params.language.toUpperCase()} CODE:
\`\`\`${params.language}
${params.code}
\`\`\`

Now analyze it. Be Fletcher.`
}

/**
 * Initialize and return a Gemini generative model.
 * Throws if GEMINI_API_KEY is not set.
 */
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.')
  }
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      maxOutputTokens: 350,
      temperature: 0.9, // Slight creative variance — Fletcher is unpredictable
    },
  })
}
