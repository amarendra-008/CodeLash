'use client'

/* ═══════════════════════════════════════════════════
   CREATE ROOM — /create-room

   Full-viewport setup screen for a multiplayer
   practice session. Content is immediately visible —
   no opacity:0 initial states that could hide the form.

   Structure:
     • Full-viewport hero (title + tagline)
     • Centered dark card (max-w-3xl) with ember border
     • RoomConfigForm (react-hook-form + zod)
     • Back link → /practice
   ═══════════════════════════════════════════════════ */

import Link from 'next/link'
import { ArrowLeft, Drum } from 'lucide-react'

import Navbar from '@/components/Navbar'
import RoomConfigForm from '@/components/create-room/RoomConfigForm'

export default function CreateRoomPage() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-hidden">

      {/* ── Film grain ── */}
      <div
        className="noise-overlay pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />

      {/* ── Stage lighting ── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        {/* Top crimson wash */}
        <div
          className="absolute inset-x-0 top-0 h-[55vh]"
          style={{
            background:
              'radial-gradient(ellipse 75% 50% at 50% -5%, rgba(220,38,38,0.16) 0%, transparent 70%)',
          }}
        />
        {/* Left ambient */}
        <div
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            background:
              'radial-gradient(ellipse 45% 75% at -5% 55%, rgba(200,16,46,0.07) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Main ── */}
      <main
        id="main-content"
        className="relative z-10 min-h-screen flex flex-col"
      >
        {/* ── HERO ── */}
        <section
          className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-16"
          aria-labelledby="hero-title"
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <Drum className="w-4 h-4" style={{ color: '#c8102e' }} aria-hidden="true" />
            <span
              className="font-condensed text-xs tracking-[0.35em] uppercase"
              style={{ color: '#c8102e' }}
            >
              Multiplayer Setup
            </span>
            <span
              aria-hidden="true"
              className="w-1.5 h-1.5 rounded-full animate-rec-blink"
              style={{ backgroundColor: '#c8102e' }}
            />
          </div>

          {/* Main title */}
          <h1
            id="hero-title"
            className="font-display leading-none mb-6 tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 7rem)', color: '#f0e6d3' }}
          >
            CREATE{' '}
            <span style={{ color: '#dc2626' }}>PRACTICE</span>
            {' '}ROOM
          </h1>

          {/* Subheadline */}
          <p
            className="font-condensed tracking-wider max-w-xl leading-relaxed mb-4"
            style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', color: '#8a8a8a' }}
          >
            Select your challenges. Invite your rivals.{' '}
            <br className="hidden md:block" />
            The clock doesn&apos;t forgive.
          </p>

          {/* Tagline strip */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mb-8">
            {[
              'Set the tempo.',
              'Assemble your ensemble — no weak links.',
              'Choose your punishment.',
            ].map((tag) => (
              <span
                key={tag}
                className="font-literary italic text-sm"
                style={{ color: '#b0a090' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Ember divider */}
          <div className="divider-ember w-full max-w-xs" aria-hidden="true" />
        </section>

        {/* ── FORM CARD ── */}
        <section
          className="w-full max-w-3xl mx-auto px-5 md:px-8 pb-28"
          aria-label="Room configuration"
        >
          <div
            className="border p-8 md:p-10"
            style={{
              backgroundColor: '#0d0d0d',
              borderColor: 'rgba(200,16,46,0.4)',
              boxShadow:
                '0 0 40px rgba(200,16,46,0.10), 0 4px 30px rgba(0,0,0,0.7)',
            }}
          >
            <RoomConfigForm />
          </div>

          {/* Back link */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 font-condensed text-xs tracking-[0.2em] uppercase
                text-[#3d3d3d] hover:text-[#8a8a8a] transition-colors duration-200 group"
            >
              <ArrowLeft
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
              Back to solo suffering
            </Link>

            <p className="font-condensed text-xs text-[#3d3d3d] tracking-wider">
              Powered by{' '}
              <span className="text-[#555]">Next.js</span>
              {' · '}
              <span className="text-[#555]">Tailwind</span>
              {' · '}
              <span className="text-[#555]">Gemini</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
