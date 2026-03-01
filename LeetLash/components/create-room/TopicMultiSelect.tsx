'use client'

/* ═══════════════════════════════════════════════════
   TOPIC MULTI-SELECT
   Searchable dropdown + chip display.
   No external lib — pure React + framer-motion.
   ═══════════════════════════════════════════════════ */

import { useState, useRef, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LEETCODE_TOPICS, type Topic } from '@/lib/topics'

interface TopicMultiSelectProps {
  selected: Topic[]
  onChange: (topics: Topic[]) => void
}

export default function TopicMultiSelect({ selected, onChange }: TopicMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listboxId = useId()

  const available = LEETCODE_TOPICS.filter(
    (t: string) => !selected.includes(t) && t.toLowerCase().includes(query.toLowerCase()),
  )

  const add = (topic: Topic) => {
    onChange([...selected, topic])
    setQuery('')
    searchRef.current?.focus()
  }

  const remove = (topic: Topic) => {
    onChange(selected.filter((t) => t !== topic))
  }

  const removeAll = () => onChange([])

  // Close when clicking outside
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

  // Focus search input on open
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
  }, [open])

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger Button ── */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        className={cn(
          'w-full min-h-[52px] bg-obsidian border text-left px-4 py-3',
          'flex flex-wrap gap-2 items-center transition-colors duration-200',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-2',
          open ? 'border-ember/50' : 'border-ash hover:border-ember/30',
        )}
      >
        {selected.length === 0 ? (
          <span className="font-condensed text-sm text-charcoal tracking-wider">
            Any topic — full gauntlet
          </span>
        ) : (
          <>
            {selected.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1.5 bg-ember-muted border border-ember/25 text-ember-bright font-condensed text-xs tracking-wider px-2.5 py-1"
              >
                {t}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); remove(t) }}
                  onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), remove(t))}
                  aria-label={`Remove topic ${t}`}
                  className="text-ember/50 hover:text-ember-bright transition-colors cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" aria-hidden="true" />
                </span>
              </span>
            ))}
          </>
        )}

        {/* Right controls */}
        <span className="ml-auto flex items-center gap-2 flex-shrink-0">
          {selected.length > 0 && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); removeAll() }}
              onKeyDown={(e) => e.key === 'Enter' && (e.stopPropagation(), removeAll())}
              aria-label="Clear all topics"
              className="font-condensed text-[10px] tracking-wider text-charcoal hover:text-ember transition-colors cursor-pointer"
            >
              clear
            </span>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-slate transition-transform duration-200',
              open && 'rotate-180',
            )}
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
            initial={{ opacity: 0, y: -6, scaleY: 0.97 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'top' }}
            className="absolute top-full left-0 right-0 z-50 bg-obsidian border border-ember/30 border-t-0 shadow-card max-h-72 flex flex-col"
          >
            {/* Search bar */}
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-ash flex-shrink-0">
              <Search className="w-3.5 h-3.5 text-charcoal flex-shrink-0" aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics..."
                aria-label="Filter topics"
                className="flex-1 bg-transparent font-condensed text-sm text-parchment placeholder:text-charcoal tracking-wider outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="text-charcoal hover:text-slate transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Topic list */}
            <ul className="overflow-y-auto flex-1 py-1" role="presentation">
              {available.length === 0 ? (
                <li className="px-4 py-4 font-condensed text-sm text-charcoal tracking-wider italic">
                  {query ? `No topics match "${query}"` : 'All topics selected.'}
                </li>
              ) : (
                available.map((topic: string) => (
                  <li key={topic} role="option" aria-selected={false}>
                    <button
                      type="button"
                      onClick={() => add(topic)}
                      className="w-full px-4 py-2.5 text-left font-condensed text-sm tracking-wider text-bone hover:bg-cinder hover:text-parchment hover:pl-6 transition-all duration-150 group"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="w-1 h-1 rounded-full bg-ember opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                        />
                        {topic}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>

            {/* Footer count */}
            {available.length > 0 && (
              <div className="px-4 py-2 border-t border-ash flex-shrink-0">
                <span className="font-condensed text-[10px] text-charcoal tracking-wider">
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
