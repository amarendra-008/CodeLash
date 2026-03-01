import Link from 'next/link'
import { Github, Twitter, Drum } from 'lucide-react'

/* ─────────────────────────────────────────────────────
   FOOTER
   Minimal. Like the last measure of a piece.
   ───────────────────────────────────────────────────── */

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
]

export default function Footer() {
  return (
    <footer
      className="relative bg-obsidian border-t border-ash py-12 px-6"
      role="contentinfo"
    >
      {/* Ember divider at top */}
      <div
        aria-hidden="true"
        className="divider-ember absolute top-0 inset-x-0"
      />

      <div className="max-w-7xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none"
            aria-label="CodeLash home"
          >
            <Drum
              className="w-4 h-4 text-ember group-hover:text-ember-bright transition-colors"
              aria-hidden="true"
            />
            <span className="font-display text-xl tracking-wider text-parchment">
              CODE<span className="text-ember">LASH</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex gap-6" role="list">
              {LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-condensed text-sm tracking-[0.15em] uppercase text-charcoal hover:text-slate transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-5" role="list" aria-label="Social links">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal hover:text-parchment transition-colors duration-200 p-1"
              aria-label="CodeLash on GitHub"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-charcoal hover:text-parchment transition-colors duration-200 p-1"
              aria-label="CodeLash on X / Twitter"
            >
              <Twitter className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" className="border-t border-ash/50 mb-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-fog tracking-[0.15em]">
            Powered by{' '}
            <span className="text-charcoal">Next.js</span>
            {' · '}
            <span className="text-charcoal">Tailwind</span>
            {' · '}
            <span className="text-charcoal">Gemini</span>
            {' · '}
            <span className="text-charcoal">LeetCode GraphQL</span>
          </p>

          <p
            className="font-literary italic text-sm text-fog"
            aria-label="Closing quote"
          >
            "Are you rushing or are you dragging?"
          </p>

          <p className="font-mono text-xs text-fog/60 tracking-[0.1em]">
            © {new Date().getFullYear()} CodeLash
          </p>
        </div>
      </div>
    </footer>
  )
}
