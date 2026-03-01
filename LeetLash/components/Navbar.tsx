'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useScroll } from 'framer-motion'
import { Drum, LogOut, User } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

const NAV_LINKS = [
  { href: '#features', label: 'Practice' },
  { href: '#cta', label: 'Start' },
  { href: '/profile', label: 'Profile' },
]

export default function Navbar() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const { scrollY } = useScroll()

  // Track scroll position
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => setScrolled(y > 40))
    return unsubscribe
  }, [scrollY])

  // Fetch session + listen for auth state changes
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      role="banner"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-obsidian/95 backdrop-blur-sm border-b border-ash shadow-card'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-visible:outline-none"
          aria-label="CodeLash — home"
        >
          <Drum
            className="w-5 h-5 text-ember transition-transform duration-300 group-hover:rotate-12"
            aria-hidden="true"
          />
          <span className="font-display text-2xl leading-none tracking-wider text-parchment group-hover:text-bone transition-colors inline-flex items-baseline">
            CODE<span className="text-ember">LASH</span>
          </span>
          <span className="ml-1 flex items-center gap-1" title="Practice in session" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-rec-blink" />
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-condensed text-sm tracking-[0.15em] uppercase text-slate hover:text-parchment transition-colors duration-200 relative group"
              >
                {label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 w-0 h-px bg-ember group-hover:w-full transition-all duration-300"
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth area */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* User chip */}
              <div className="flex items-center gap-2 font-condensed text-xs tracking-wider text-[#8a8a8a]">
                <span className="w-6 h-6 flex items-center justify-center bg-ember/15 border border-ember/30 text-ember">
                  <User className="w-3 h-3" aria-hidden="true" />
                </span>
                <span className="hidden lg:block max-w-[140px] truncate">
                  {user.email}
                </span>
              </div>

              {/* Practice CTA */}
              <Link
                href="/create-room"
                className="font-condensed text-sm tracking-[0.15em] uppercase bg-ember text-parchment px-5 py-2 border border-ember hover:bg-ember-bright hover:shadow-ember transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4"
                aria-label="Enter the practice room"
              >
                Enter
              </Link>

              {/* Sign out */}
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Sign out"
                className="flex items-center gap-1.5 font-condensed text-xs tracking-wider text-[#555] hover:text-red-400 transition-colors duration-200"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden lg:block">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="font-condensed text-sm tracking-[0.15em] uppercase text-slate hover:text-parchment transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="font-condensed text-sm tracking-[0.15em] uppercase bg-ember text-parchment px-5 py-2 border border-ember hover:bg-ember-bright hover:shadow-ember transition-all duration-200 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ember focus-visible:outline-offset-4"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          aria-label="Open menu"
        >
          <span className="w-6 h-px bg-parchment group-hover:bg-ember transition-colors" />
          <span className="w-4 h-px bg-parchment group-hover:bg-ember transition-colors" />
          <span className="w-6 h-px bg-parchment group-hover:bg-ember transition-colors" />
        </button>
      </nav>
    </motion.header>
  )
}
