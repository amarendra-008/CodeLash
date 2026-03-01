'use client'

/* ═══════════════════════════════════════════════════
   TOPIC SELECT
   Searchable multi-select. Controlled externally via
   react-hook-form Controller (value + onChange).

   Topics are sourced from lib/topics.ts.
   Selected topics show as removable chips.
   Dropdown filters by query string.

   Future: replace with cmdk Command component or
   @radix-ui/react-popover for richer UX.
   ═══════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TOPICS } from '@/lib/topics'

interface TopicSelectProps {
  value: string[]
  onChange: (topics: string[]) => void
}

export default function TopicSelect({ value: valueProp, onChange }: TopicSelectProps) {
  const value = valueProp ?? []
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const available = TOPICS.filter(
    (t) =>
      !value.includes(t) &&
      t.toLowerCase().includes(query.toLowerCase()),
  )

  const add = (topic: string) => {
    onChange([...value, topic])
    setQuery('')
    searchRef.current?.focus()
  }

  const remove = (topic: string) => {
    onChange(value.filter((t) => t !== topic))
  }

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 40)
  }, [open])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={cn(
          'w-full min-h-[52px] bg-[#0a0a0a] border text-left',
          'px-4 py-3 flex flex-wrap gap-2 items-center',
          'transition-colors duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8102e] focus-visible:outline-offset-2',
          open ? 'border-[#c8102e]/50' : 'border-[#1a1a1a] hover:border-[#c8102e]/25',
        )}
      >
        {value.length === 0 ? (
          <span className="font-condensed text-sm text-[#3d3d3d] tracking-wider">
            Any topic — the full gauntlet
          </span>
        ) : (
          value.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 bg-[#c8102e]/10 border border-[#c8102e]/20
                text-[#ef233c] font-condensed text-xs tracking-wider px-2.5 py-1"
            >
              {t}
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); remove(t) }}
                onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), remove(t))}
                aria-label={`Remove ${t}`}
                className="text-[#c8102e]/50 hover:text-[#ef233c] transition-colors cursor-pointer"
              >
                <X className="w-2.5 h-2.5" aria-hidden="true" />
              </span>
            </span>
          ))
        )}

        <span className="ml-auto flex items-center gap-2 flex-shrink-0">
          {value.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onChange([]) }}
              onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), onChange([]))}
              aria-label="Clear all topics"
              className="font-condensed text-[10px] text-[#3d3d3d] hover:text-[#c8102e] transition-colors cursor-pointer tracking-wider"
            >
              clear
            </span>
          )}
          <ChevronDown
            className={cn('w-4 h-4 text-[#555] transition-transform duration-200', open && 'rotate-180')}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            id={listboxId}
            role="listbox"
            aria-label="Available topics"
            aria-multiselectable="true"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="absolute top-full left-0 right-0 z-50 bg-[#0a0a0a] border border-[#c8102e]/30
              border-t-0 max-h-64 flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.7)]"
          >
            {/* Search */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#1a1a1a] flex-shrink-0">
              <Search className="w-3.5 h-3.5 text-[#3d3d3d] flex-shrink-0" aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="filter topics..."
                aria-label="Filter available topics"
                className="flex-1 bg-transparent font-condensed text-sm text-[#f0e6d3]
                  placeholder:text-[#3d3d3d] tracking-wider outline-none"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} aria-label="Clear search"
                  className="text-[#3d3d3d] hover:text-[#8a8a8a] transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* List */}
            <ul className="overflow-y-auto flex-1 py-1" role="presentation">
              {available.length === 0 ? (
                <li className="px-4 py-4 font-condensed text-sm text-[#3d3d3d] tracking-wider italic">
                  {query ? `No topics match "${query}"` : 'All topics selected.'}
                </li>
              ) : (
                available.map((topic) => (
                  <li key={topic} role="option" aria-selected={false}>
                    <button
                      type="button"
                      onClick={() => add(topic)}
                      className="w-full px-4 py-2.5 text-left font-condensed text-sm tracking-wider
                        text-[#d4c9b8] hover:bg-[#111] hover:text-[#f0e6d3] hover:pl-6
                        transition-all duration-150 group"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span aria-hidden="true"
                          className="w-1 h-1 rounded-full bg-[#c8102e] opacity-0 group-hover:opacity-100 transition-opacity" />
                        {topic}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {available.length > 0 && (
              <div className="px-4 py-2 border-t border-[#1a1a1a] flex-shrink-0">
                <span className="font-condensed text-[10px] text-[#3d3d3d] tracking-wider">
                  {available.length} topic{available.length !== 1 ? 's' : ''} available
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
