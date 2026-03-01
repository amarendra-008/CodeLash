import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Barlow_Condensed, Crimson_Pro } from 'next/font/google'
import './globals.css'

/* ─────────────────────────────────────────────────────
   FONTS
   Bebas Neue  → cinematic headlines, aggressive punch
   Barlow Condensed → precision body, condensed clarity
   Crimson Pro → literary gravitas for testimonial quotes
   ───────────────────────────────────────────────────── */

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
})

const crimsonPro = Crimson_Pro({
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
})

/* ─────────────────────────────────────────────────────
   METADATA
   ───────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'CodeLash — Master CS the Right Way',
  description:
    'AI companion for LeetCode domination, database mastery, and core CS skills. Inspired by Whiplash — because greatness demands discipline.',
  keywords: [
    'LeetCode',
    'competitive programming',
    'data structures',
    'algorithms',
    'system design',
    'Gemini AI',
    'CS fundamentals',
    'coding interview prep',
  ],
  openGraph: {
    title: 'CodeLash — Not Quite My Tempo',
    description:
      'Become unbreakable. Code under pressure. AI-powered CS mastery platform.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeLash — Master CS the Right Way',
    description: 'Not quite your tempo? Push harder.',
  },
}

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
}

/* ─────────────────────────────────────────────────────
   ROOT LAYOUT
   ───────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${barlowCondensed.variable} ${crimsonPro.variable}`}
    >
      <body className="bg-void text-parchment antialiased selection:bg-ember selection:text-parchment">
        {children}
      </body>
    </html>
  )
}
