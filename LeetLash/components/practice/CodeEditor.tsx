'use client'

/* ═══════════════════════════════════════════════════
   CODE EDITOR
   CodeMirror 6 wrapper with okaidia theme + ember
   cursor/line overrides. Must be 'use client' and
   is dynamically imported (ssr:false) by the page
   to avoid hydration mismatches.
   ═══════════════════════════════════════════════════ */

import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { okaidia } from '@uiw/codemirror-theme-okaidia'
import { type Language } from '@/lib/problems'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  code: string
  onChange: (value: string) => void
  language: Language
  isLoading?: boolean
  className?: string
}

const EXTENSIONS: Record<Language, ReturnType<typeof javascript | typeof python>[]> = {
  javascript: [javascript({ jsx: true, typescript: false })],
  python: [python()],
}

export default function CodeEditor({
  code,
  onChange,
  language,
  isLoading = false,
  className,
}: CodeEditorProps) {
  return (
    <div
      className={cn(
        'relative h-full flex flex-col overflow-hidden',
        // When submitting — the editor border pulses crimson
        isLoading && 'animate-code-pulse',
        className,
      )}
      aria-label="Code editor"
    >
      {/* Language indicator strip */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-cinder border-b border-ash"
        aria-hidden="true"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-ember animate-rec-blink" />
        <span className="font-mono text-xs text-charcoal tracking-wider uppercase">
          {language === 'javascript' ? 'JavaScript' : 'Python 3'}
        </span>
        <span className="ml-auto font-condensed text-xs text-lead tracking-widest">
          solution.{language === 'javascript' ? 'js' : 'py'}
        </span>
      </div>

      {/* Loading overlay — subtle red pulse while Gemini thinks */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-ember/5 z-10 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* CodeMirror editor — fills remaining height */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <CodeMirror
          value={code}
          onChange={onChange}
          extensions={EXTENSIONS[language]}
          theme={okaidia}
          height="100%"
          style={{ height: '100%' }}
          autoFocus
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            highlightActiveLineGutter: true,
            autocompletion: true,
            syntaxHighlighting: true,
            bracketMatching: true,
            closeBrackets: true,
            indentOnInput: true,
            foldGutter: true,
            drawSelection: true,
            dropCursor: true,
            crosshairCursor: false,
            tabSize: 4,
          }}
          aria-label={`${language} code editor`}
        />
      </div>
    </div>
  )
}
