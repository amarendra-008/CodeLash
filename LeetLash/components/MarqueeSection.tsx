/* ─────────────────────────────────────────────────────
   MARQUEE SECTION
   Fletcher's tape — quotes that don't stop.
   Pure CSS animation for zero JS overhead.
   ───────────────────────────────────────────────────── */

const QUOTES = [
  'AGAIN.',
  'NOT QUITE MY TEMPO.',
  'PUSH HARDER.',
  'ONE MORE REP.',
  'FACE THE TEMPO.',
  'GREATNESS DEMANDS DISCIPLINE.',
  'ARE YOU RUSHING OR DRAGGING?',
  'DOUBLE TIME.',
  "YOU THINK YOU'RE SPECIAL?",
  'PROVE IT.',
  'THERE ARE NO SHORTCUTS.',
  'BLEED CODE.',
]

// Duplicate for seamless loop
const ALL_QUOTES = [...QUOTES, ...QUOTES]

export default function MarqueeSection() {
  return (
    <section
      className="relative bg-cinder py-6 border-y border-ash overflow-hidden"
      aria-label="Motivational quotes from LeetLash"
    >
      {/* Left & right edge fade */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-cinder to-transparent pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-cinder to-transparent pointer-events-none"
      />

      {/* Marquee track */}
      <div
        className="marquee-track overflow-hidden"
        role="marquee"
        aria-label="Scrolling pressure quotes"
      >
        <ul
          className="marquee-inner flex gap-0 animate-marquee whitespace-nowrap"
          role="list"
          style={{ width: 'max-content' }}
        >
          {ALL_QUOTES.map((quote, i) => (
            <li
              key={`${quote}-${i}`}
              className="flex items-center"
              aria-hidden={i >= QUOTES.length}
            >
              <span className="font-display text-2xl md:text-3xl text-ember/70 px-2 tracking-widest">
                {quote}
              </span>
              {/* Separator dot */}
              <span
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-ember/30 mx-4 flex-shrink-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
