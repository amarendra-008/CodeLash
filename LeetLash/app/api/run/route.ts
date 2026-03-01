/* ═══════════════════════════════════════════════════
   API ROUTE — /api/run
   Executes user JavaScript code against structured
   test cases using Node.js vm module (sandboxed).

   Body:  { code: string, language: string, problemId: number }
   Returns one of:
     { type: 'test_results', results, passCount, totalCount }
     { type: 'unsupported',  message }
     { type: 'error',        message }
   ═══════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import vm from 'vm'
import { getTestConfig, type CompareMode } from '@/lib/test-cases'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const EXEC_TIMEOUT_MS = 3000

/* ── Comparison helpers ─────────────────────────────── */

function compareResults(
  actual: unknown,
  expected: unknown,
  mode: CompareMode = 'default',
): boolean {
  switch (mode) {
    case 'sorted-array': {
      if (!Array.isArray(actual) || !Array.isArray(expected)) return false
      if (actual.length !== expected.length) return false
      const a = [...(actual as number[])].sort((x, y) => x - y)
      const e = [...(expected as number[])].sort((x, y) => x - y)
      return JSON.stringify(a) === JSON.stringify(e)
    }
    case 'sorted-2d-array': {
      if (!Array.isArray(actual) || !Array.isArray(expected)) return false
      if (actual.length !== expected.length) return false
      const sortInner = (arr: number[][]) =>
        arr
          .map((row) => [...row].sort((a, b) => a - b))
          .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
      return (
        JSON.stringify(sortInner(actual as number[][])) ===
        JSON.stringify(sortInner(expected as number[][]))
      )
    }
    default:
      return JSON.stringify(actual) === JSON.stringify(expected)
  }
}

function serialize(val: unknown): string {
  if (val === undefined) return 'undefined'
  if (val === null) return 'null'
  return JSON.stringify(val)
}

/* ── Route handler ──────────────────────────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      code: string
      language: string
      problemId: number
    }
    const { code = '', language = 'javascript', problemId } = body

    /* Python — not executable server-side here */
    if (language === 'python') {
      return NextResponse.json({
        type: 'unsupported',
        message: 'Python execution requires a backend sandbox.\nSubmit for AI analysis instead.',
      })
    }

    const config = getTestConfig(problemId)
    if (!config) {
      return NextResponse.json({
        type: 'error',
        message: `No test cases found for problem ${problemId}.`,
      })
    }

    const results = config.cases.map((tc, i) => {
      try {
        /* Build a sandbox — isolated Object prototype to block prototype attacks */
        const sandbox = Object.create(null) as Record<string, unknown>
        sandbox.__result__ = undefined

        /* Serialize args as JSON so primitives, arrays, objects all work */
        const argsLiteral = tc.args.map((a) => JSON.stringify(a)).join(', ')
        const script = new vm.Script(
          `${code}\n__result__ = ${config.functionName}(${argsLiteral});`,
        )
        const context = vm.createContext(sandbox)
        script.runInContext(context, { timeout: EXEC_TIMEOUT_MS })

        const actual = sandbox.__result__
        const passed = compareResults(actual, tc.expected, config.compare)

        return {
          passed,
          caseIndex: i,
          input: tc.args.map((a) => serialize(a)).join(', '),
          expected: serialize(tc.expected),
          actual: serialize(actual),
          description: tc.description,
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        return {
          passed: false,
          caseIndex: i,
          input: tc.args.map((a) => serialize(a)).join(', '),
          expected: serialize(tc.expected),
          actual: null,
          error: message,
          description: tc.description,
        }
      }
    })

    const passCount = results.filter((r) => r.passed).length

    return NextResponse.json({
      type: 'test_results',
      results,
      passCount,
      totalCount: results.length,
    })
  } catch (err) {
    console.error('[Run] Error:', err)
    return NextResponse.json(
      {
        type: 'error',
        message: err instanceof Error ? err.message : 'Unknown server error.',
      },
      { status: 500 },
    )
  }
}
