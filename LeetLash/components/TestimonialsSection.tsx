import QuoteCard from './QuoteCard'

/* ─────────────────────────────────────────────────────
   TESTIMONIALS SECTION
   Asymmetric grid. Brutal-motivational blurbs.
   The "Andrew Neiman" and "Fletcher" energy.
   ───────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    quote:
      "I've tried 15 different platforms. LeetLash is the only one that made me feel like I wasn't good enough yet — and kept me coming back for more. That discomfort? That's the point.",
    author: 'Alex K.',
    role: 'SWE · Google L4',
    result: 'FAANG offer',
    variant: 'elevated' as const,
  },
  {
    quote:
      "Not quite my tempo? Fine. I'll make it my tempo. Three months, 300 problems, two FAANG offers. The Gemini coach doesn't sugarcoat — and that's exactly what I needed.",
    author: 'Priya M.',
    role: 'CS · Stanford',
    result: '2× FAANG offer',
    variant: 'default' as const,
  },
  {
    quote:
      "You think you're special? Prove it. LeetLash put that on screen every single day. I hated it. I loved it. I got the job. In that order.",
    author: 'Marcus T.',
    role: 'Backend Eng · formerly stuck',
    result: 'Offer in 90 days',
    variant: 'recessed' as const,
  },
  {
    quote:
      "The system design modules alone are worth it. I walked into a Meta loop completely cold on distributed systems. Walked out with an offer. LeetLash made the difference.",
    author: 'Soo-Yeon L.',
    role: 'Senior Eng · Meta',
    result: 'Senior offer',
    variant: 'elevated' as const,
  },
  {
    quote:
      "Every session starts the same way — 'AGAIN.' Staring at a problem I haven't solved. But that's how you get better. Brick by brick. Deadline by deadline.",
    author: 'Dmitri V.',
    role: 'Competitive programmer',
    result: 'LC top 500',
    variant: 'default' as const,
  },
]

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative bg-obsidian py-24 md:py-36 px-6"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="font-mono text-ember text-xs tracking-[0.45em] uppercase mb-4">
            Proof of Work
          </p>
          <h2
            id="testimonials-heading"
            className="font-display text-parchment tracking-tight leading-none mb-5"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
          >
            THEY{' '}
            <span className="text-gradient-ember">SURVIVED</span>
          </h2>
          <p className="font-condensed text-slate text-lg max-w-xl mx-auto">
            Unsolicited. Unfiltered. The kind of testimonials Fletcher would
            grudgingly acknowledge.
          </p>
        </div>

        {/* Top row — 3 cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6 items-start"
          role="list"
          aria-label="Testimonials"
        >
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={t.author} role="listitem">
              <QuoteCard {...t} index={i} />
            </div>
          ))}
        </div>

        {/* Bottom row — 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:max-w-3xl mx-auto items-start">
          {TESTIMONIALS.slice(3).map((t, i) => (
            <div key={t.author} role="listitem">
              <QuoteCard {...t} index={i + 3} />
            </div>
          ))}
        </div>

        {/* Closing line */}
        <p
          className="text-center font-mono text-charcoal text-xs tracking-[0.3em] uppercase mt-16"
          aria-hidden="true"
        >
          * Fictional testimonials for illustration. Real results may vary. Hard
          work is non-optional.
        </p>
      </div>
    </section>
  )
}
