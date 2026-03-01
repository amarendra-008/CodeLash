import { Code2, Database, Brain, Flame } from 'lucide-react'
import FeatureCard from './FeatureCard'

/* ─────────────────────────────────────────────────────
   FEATURES SECTION — Server Component
   Icons are pre-rendered as JSX so they cross the
   server→client boundary safely (ReactNode, not fn).
   ───────────────────────────────────────────────────── */

const ICON_CLASS = 'w-full h-full'
const STROKE = 1.5

const FEATURES = [
  {
    icon: <Code2 className={ICON_CLASS} strokeWidth={STROKE} aria-hidden />,
    title: 'LeetCode Domination',
    description:
      "Real problems pulled directly from LeetCode's GraphQL API. 3,000+ questions across Easy, Medium, and Hard. Track streaks, visualize progress, confront weaknesses.",
    tag: 'Live GraphQL',
    accent: 'ember' as const,
  },
  {
    icon: <Database className={ICON_CLASS} strokeWidth={STROKE} aria-hidden />,
    title: 'Database Mastery',
    description:
      'Schema design, advanced SQL, query optimization, indexing strategies. From ER diagrams to production-grade PostgreSQL — no half measures.',
    tag: 'SQL + NoSQL',
    accent: 'flame' as const,
  },
  {
    icon: <Brain className={ICON_CLASS} strokeWidth={STROKE} aria-hidden />,
    title: 'CS Fundamentals',
    description:
      'Data structures, algorithms, system design, OS concepts, networking, computer architecture. Complete the gaps. No excuses.',
    tag: 'DS&A · SysDesign · OS',
    accent: 'ember' as const,
  },
  {
    icon: <Flame className={ICON_CLASS} strokeWidth={STROKE} aria-hidden />,
    title: 'AI Coach Mode',
    description:
      'Gemini AI as your merciless Fletcher. Hints are earned. Pressure is constant. Explanations are precise, debugging is relentless, and motivation is Whiplash-grade.',
    tag: 'Powered by Gemini',
    accent: 'flame' as const,
  },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-gradient-hero py-16 md:py-24 px-6"
      aria-labelledby="features-heading"
    >
      {/* Top border glow */}
      <div aria-hidden="true" className="divider-ember absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="font-mono text-ember text-xs tracking-[0.45em] uppercase mb-4">
            The Disciplines
          </p>
          <h2
            id="features-heading"
            className="font-display text-parchment leading-none tracking-tight mb-5"
            style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}
          >
            WHAT YOU&apos;LL{' '}
            <span className="text-gradient-ember">MASTER</span>
          </h2>
          <p className="font-condensed text-slate text-lg max-w-xl mx-auto">
            Four disciplines. One platform. The same unrelenting standard
            Fletcher held for Neiman. Held for you.
          </p>
        </div>

        {/* Feature grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
          role="list"
          aria-label="Platform features"
        >
          {FEATURES.map((feature, i) => (
            <div key={feature.title} role="listitem">
              <FeatureCard {...feature} index={i} />
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="text-center font-mono text-charcoal text-xs tracking-[0.3em] uppercase mt-12"
          aria-hidden="true"
        >
          Are you rushing or are you dragging?
        </p>
      </div>

      {/* Bottom border glow */}
      <div aria-hidden="true" className="divider-ember absolute bottom-0 inset-x-0" />
    </section>
  )
}
