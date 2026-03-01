/* ═══════════════════════════════════════════════════
   API ROUTE — POST /api/invite
   Sends practice room invite emails via Resend.

   Body:
     roomId      string
     emails      string[]
     roomConfig  { numProblems, difficulties, topics }
   ═══════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const BASE_URL = 'https://codelash.vercel.app'

interface InviteBody {
  roomId: string
  emails: string[]
  roomConfig: {
    numProblems: number
    difficulties: string[]
    topics: string[]
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as InviteBody
  const { roomId, emails, roomConfig } = body

  if (!roomId || !emails?.length) {
    return NextResponse.json({ error: 'Missing roomId or emails' }, { status: 400 })
  }

  const roomUrl = `${BASE_URL}/room/${roomId}`
  const practiceUrl = `${BASE_URL}/practice?room=${roomId}`

  const difficulties = roomConfig.difficulties.join(', ') || 'Any'
  const topics = roomConfig.topics.length ? roomConfig.topics.join(', ') : 'All topics'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background-color: #050505; font-family: 'Arial', sans-serif; }
    .wrapper { max-width: 560px; margin: 0 auto; padding: 48px 24px; }
    .logo { font-size: 26px; font-weight: 900; letter-spacing: 0.12em; color: #f0e6d3; margin-bottom: 40px; }
    .logo span { color: #c8102e; }
    .eyebrow { font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase; color: #c8102e; margin-bottom: 16px; }
    h1 { font-size: 36px; font-weight: 900; letter-spacing: 0.04em; color: #f0e6d3; margin: 0 0 16px; line-height: 1.1; }
    .subtitle { font-size: 14px; color: #8a8a8a; letter-spacing: 0.06em; margin-bottom: 36px; line-height: 1.6; }
    .divider { height: 1px; background: linear-gradient(to right, #c8102e 0%, #c8102e40 40%, transparent 100%); margin: 32px 0; }
    .config { background: #0d0d0d; border: 1px solid rgba(200,16,46,0.25); padding: 24px; margin-bottom: 32px; }
    .config-row { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 0; border-bottom: 1px solid #1a1a1a; }
    .config-row:last-child { border-bottom: none; }
    .config-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #555; }
    .config-value { font-size: 13px; color: #f0e6d3; letter-spacing: 0.06em; text-align: right; max-width: 60%; }
    .cta { display: block; background: #c8102e; color: #f0e6d3; text-align: center; padding: 18px 32px; font-size: 13px; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 700; text-decoration: none; margin-bottom: 16px; }
    .link-secondary { display: block; text-align: center; font-size: 11px; letter-spacing: 0.12em; color: #555; margin-bottom: 40px; word-break: break-all; }
    .footer { font-size: 11px; color: #333; letter-spacing: 0.08em; line-height: 1.8; }
    .quote { font-style: italic; color: #555; border-left: 2px solid #c8102e; padding-left: 12px; margin: 24px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="logo">CODE<span>LASH</span></div>

    <div class="eyebrow">Practice Room Invite</div>
    <h1>You've been<br/>summoned.</h1>
    <p class="subtitle">
      Someone has thrown down the gauntlet. A CodeLash practice room
      is waiting for you — clock running, no excuses.
    </p>

    <div class="divider"></div>

    <div class="config">
      <div class="config-row">
        <span class="config-label">Problems</span>
        <span class="config-value">${roomConfig.numProblems} problem${roomConfig.numProblems !== 1 ? 's' : ''}</span>
      </div>
      <div class="config-row">
        <span class="config-label">Difficulty</span>
        <span class="config-value">${difficulties}</span>
      </div>
      <div class="config-row">
        <span class="config-label">Topics</span>
        <span class="config-value">${topics}</span>
      </div>
      <div class="config-row">
        <span class="config-label">Room ID</span>
        <span class="config-value" style="font-family:monospace;font-size:11px;color:#8a8a8a">${roomId.slice(0, 8)}…</span>
      </div>
    </div>

    <a href="${practiceUrl}" class="cta">Enter the Room →</a>
    <span class="link-secondary">${roomUrl}</span>

    <div class="quote">
      "There are no two words in the English language more harmful than
      <em>good job</em>." — Fletcher
    </div>

    <div class="divider"></div>

    <p class="footer">
      You received this because someone invited you to a CodeLash practice session.<br/>
      If you didn't expect this, you can safely ignore it.
    </p>
  </div>
</body>
</html>
`

  try {
    const results = await Promise.allSettled(
      emails.map((to) =>
        resend.emails.send({
          from: 'CodeLash <onboarding@resend.dev>',
          to,
          subject: `You've been summoned — CodeLash Practice Room`,
          html,
        }),
      ),
    )

    const failed = results
      .filter((r) => r.status === 'rejected')
      .map((_, i) => emails[i])

    return NextResponse.json({
      sent: emails.length - failed.length,
      failed,
    })
  } catch (err) {
    console.error('[Invite API]', err)
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
  }
}
