'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Drum, Loader2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/practice')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-5">
      {/* Film grain */}
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0" aria-hidden="true" />

      {/* Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(200,16,46,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-12 group w-fit mx-auto">
          <Drum className="w-5 h-5 text-ember" aria-hidden="true" />
          <span className="font-display text-2xl tracking-wider text-parchment">
            CODE<span className="text-ember">LASH</span>
          </span>
        </Link>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="border p-8"
          style={{
            backgroundColor: '#0d0d0d',
            borderColor: 'rgba(200,16,46,0.4)',
            boxShadow: '0 0 40px rgba(200,16,46,0.08), 0 4px 30px rgba(0,0,0,0.7)',
          }}
        >
          <h1 className="font-display text-4xl text-parchment mb-1 tracking-wide">
            SIGN UP
          </h1>
          <p className="font-condensed text-sm text-[#555] tracking-wider mb-8">
            Enter the arena. No weak links allowed.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="font-condensed text-xs tracking-[0.2em] uppercase text-[#8a8a8a]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#080808] border border-[#1a1a1a] px-4 py-3
                  font-condensed text-sm text-parchment placeholder:text-[#3d3d3d]
                  tracking-wider outline-none
                  hover:border-[#c8102e]/25 focus:border-[#c8102e]/50
                  transition-colors duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="font-condensed text-xs tracking-[0.2em] uppercase text-[#8a8a8a]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="min 6 characters"
                  className="w-full bg-[#080808] border border-[#1a1a1a] px-4 py-3 pr-12
                    font-condensed text-sm text-parchment placeholder:text-[#3d3d3d]
                    tracking-wider outline-none
                    hover:border-[#c8102e]/25 focus:border-[#c8102e]/50
                    transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#3d3d3d] hover:text-[#8a8a8a] transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label
                htmlFor="confirm"
                className="font-condensed text-xs tracking-[0.2em] uppercase text-[#8a8a8a]"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#080808] border border-[#1a1a1a] px-4 py-3
                  font-condensed text-sm text-parchment placeholder:text-[#3d3d3d]
                  tracking-wider outline-none
                  hover:border-[#c8102e]/25 focus:border-[#c8102e]/50
                  transition-colors duration-200"
              />
            </div>

            {/* Error */}
            {error && (
              <p role="alert" className="font-condensed text-xs text-red-400 tracking-wider">
                {error}
              </p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.015 }}
              whileTap={loading ? {} : { scale: 0.985 }}
              className="w-full flex items-center justify-center gap-2.5
                font-condensed text-sm tracking-[0.18em] uppercase
                py-4 border transition-all duration-200
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c8102e] focus-visible:outline-offset-4
                disabled:opacity-50 disabled:cursor-not-allowed"
              style={
                loading
                  ? { backgroundColor: 'transparent', borderColor: '#2a2a2a', color: '#555' }
                  : {
                      backgroundColor: '#c8102e',
                      borderColor: '#c8102e',
                      color: '#f0e6d3',
                      boxShadow: '0 0 20px rgba(200,16,46,0.3)',
                    }
              }
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Creating account...</>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer link */}
        <p className="mt-6 text-center font-condensed text-sm text-[#555] tracking-wider">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="text-ember hover:text-ember-bright transition-colors underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
