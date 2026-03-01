import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import FeaturesSection from '@/components/FeaturesSection'
import MarqueeSection from '@/components/MarqueeSection'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

/* ─────────────────────────────────────────────────────
   LANDING PAGE — CodeLash
   Server component. Assembles all sections.
   ───────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main className="relative" id="main-content">
      {/* Skip to main content for accessibility */}
      <a
        href="#features"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ember focus:text-parchment focus:px-4 focus:py-2 focus:font-condensed focus:text-sm focus:tracking-wide"
      >
        Skip to main content
      </a>

      <Navbar />
      <Hero />
      <FeaturesSection />
      <MarqueeSection />
      <CTASection />
      <Footer />
    </main>
  )
}
