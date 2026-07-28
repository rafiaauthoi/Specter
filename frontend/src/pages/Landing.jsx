import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const BOOT_LINES = [
  '> initializing specter...',
  '> loading 20+ broker signatures...',
  '> encrypting channel...',
  '> secure connection established.',
  '> ready.',
]

const DEMO_BROKERS = [
  { name: 'Spokeo', found: 1 },
  { name: 'WhitePages', found: 1 },
  { name: 'BeenVerified', found: 1 },
  { name: 'Radaris', found: 1 },
  { name: 'MyLife', found: 1 },
]

const PERMISSIONS = [
  {
    title: 'Scans inbox for broker emails',
    body: 'Specter searches your Gmail for messages from known data-broker domains, including confirmations, listing notices, and opt-out replies, to identify who has your data.',
  },
  {
    title: "Reads only what's relevant",
    body: 'Only messages matching broker patterns are processed. Personal, work, and unrelated emails are never analyzed or stored.',
  },
  {
    title: 'Never sends email on your behalf',
    body: "Specter doesn't send, delete, or modify anything in your inbox without your explicit action.",
  },
  {
    title: 'Encrypted, never sold',
    body: "Everything Specter stores is encrypted with AES-256. Your data is never shared with or sold to third parties. That's the entire point.",
  },
]

const STEPS = [
  { num: '01 / CONNECT', title: 'Sign in with Gmail', body: 'Secure OAuth sign-in. Specter never sees your password, only what you explicitly grant.' },
  { num: '02 / SCAN', title: 'We find who has your data', body: 'Specter cross-references your inbox against 20+ known data brokers and surfaces every match.' },
  { num: '03 / REMOVE', title: 'Opt out, guided or automatic', body: 'Step-by-step removal flows for each broker, with status tracked until confirmed gone.' },
]

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function GhostMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ filter: 'drop-shadow(0 0 4px var(--pink-glow-strong))' }}>
      <path d="M12 2C7.58 2 4 5.58 4 10v10.2c0 .6.65.98 1.17.68l1.68-.97a1 1 0 0 1 1.15.12l1.36 1.2a1 1 0 0 0 1.32 0l1.32-1.17a1 1 0 0 1 1.32 0l1.32 1.17a1 1 0 0 0 1.32 0l1.36-1.2a1 1 0 0 1 1.15-.12l1.68.97c.52.3 1.17-.08 1.17-.68V10c0-4.42-3.58-8-8-8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="9" cy="10.5" r="1.15" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1.15" fill="currentColor" />
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  // Boot sequence, once per session, same pattern as Dashboard
  const [booting, setBooting] = useState(() => !sessionStorage.getItem('specter_landing_booted'))
  const [bootLines, setBootLines] = useState([])
  const [bootFading, setBootFading] = useState(false)

  useEffect(() => {
    if (!booting) return
    let i = 0
    const interval = setInterval(() => {
      setBootLines(prev => [...prev, BOOT_LINES[i]])
      i++
      if (i >= BOOT_LINES.length) {
        clearInterval(interval)
        setTimeout(() => {
          setBootFading(true)
          setTimeout(() => {
            setBooting(false)
            sessionStorage.setItem('specter_landing_booted', '1')
          }, 700)
        }, 500)
      }
    }, 260)
    return () => clearInterval(interval)
  }, [])

  function skipBoot() {
    setBootFading(true)
    setTimeout(() => {
      setBooting(false)
      sessionStorage.setItem('specter_landing_booted', '1')
    }, 400)
  }

  // Interactive demo scan, reuses Dashboard's score/threat logic on fake data
  const [demoState, setDemoState] = useState('idle') // idle | scanning | done
  const [demoScore, setDemoScore] = useState(0)
  const [revealedBrokers, setRevealedBrokers] = useState([])

  function runDemoScan() {
    if (demoState === 'scanning') return
    setDemoState('scanning')
    setDemoScore(0)
    setRevealedBrokers([])

    const finalScore = 30 + DEMO_BROKERS.length * 8
    let elapsed = 0
    const scoreTimer = setInterval(() => {
      elapsed += 40
      setDemoScore(s => Math.min(finalScore, s + 2))
      if (elapsed >= 900) clearInterval(scoreTimer)
    }, 40)

    DEMO_BROKERS.forEach((b, i) => {
      setTimeout(() => {
        setRevealedBrokers(prev => [...prev, b])
      }, 500 + i * 380)
    })

    setTimeout(() => setDemoState('done'), 500 + DEMO_BROKERS.length * 380 + 300)
  }

  const scoreColor = demoState === 'idle' ? 'var(--text-dim)' : demoScore > 60 ? 'var(--red)' : demoScore > 30 ? 'var(--orange)' : 'var(--green)'
  const scoreLabel = demoState === 'idle' ? 'run a demo scan' : demoScore > 60 ? 'High Exposure' : demoScore > 30 ? 'Medium Exposure' : 'Scanning...'

  // Cursor-reactive redaction block
  const redactRef = useRef(null)
  const [mouse, setMouse] = useState({ x: -999, y: -999 })

  function handleRedactMove(e) {
    const rect = redactRef.current.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const SAMPLE_FIELDS = [
    { label: 'Full name', value: 'Alex Morgan Chen' },
    { label: 'Home address', value: '4821 Birchwood Ln, Austin, TX' },
    { label: 'Phone', value: '(512) 555-0148' },
    { label: 'Email', value: 'alex.chen@gmail.com' },
    { label: 'Employer', value: 'Meridian Analytics Group' },
  ]

  return (
    <div>
      {booting && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--bg)', zIndex: 200,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          opacity: bootFading ? 0 : 1, transition: 'opacity 0.7s ease', cursor: 'pointer',
        }} onClick={skipBoot}>
          <div style={{ fontFamily: 'monospace', fontSize: 14, color: 'var(--pink)', minHeight: 140 }}>
            {bootLines.map((line, i) => <div key={i} style={{ marginBottom: 8 }}>{line}</div>)}
          </div>
          <div style={{ position: 'absolute', bottom: 40, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>
            click anywhere to skip
          </div>
        </div>
      )}

      <nav className="navbar">
        <div className="navbar-logo">
          <GhostMark />
          specter
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#access" style={{ fontSize: 13, color: 'var(--text-muted)' }}>data access</a>
          <a href="#how" style={{ fontSize: 13, color: 'var(--text-muted)' }}>how it works</a>
          <button className="btn-primary" onClick={() => navigate('/login')}>Sign in with Google</button>
        </div>
      </nav>

      <header style={{ padding: '96px 0 64px' }}>
        <div className="page" style={{ maxWidth: 1120 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--pink)',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, letterSpacing: '0.04em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pink)', boxShadow: '0 0 8px var(--pink-glow-strong)' }} />
            20+ DATA BROKERS MONITORED
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, marginBottom: 24 }}>
            Find where your data lives.<br />
            Then make it <span style={{ color: 'var(--pink)', textShadow: '0 0 24px var(--pink-glow-strong)' }}>disappear.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', maxWidth: 540, marginBottom: 40 }}>
            Specter scans your inbox for data-broker activity, shows you exactly who has your information,
            and walks you through getting it removed, automatically where possible.
          </p>
          <div style={{ display: 'flex', gap: 14, marginBottom: 72 }}>
            <button className="btn-primary" style={{ padding: '14px 26px', fontSize: 14 }} onClick={() => navigate('/login')}>
              Sign in with Google
            </button>
            <a href="#how" className="btn-ghost" style={{ padding: '14px 26px', fontSize: 14, display: 'inline-flex', alignItems: 'center' }}>
              See how it works
            </a>
          </div>

          {/* Interactive demo scan, reusing Dashboard's ring visualization */}
          <div className="card" style={{ maxWidth: 640, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--text-muted)' }}>LIVE_DEMO.EXE</span>
              <button
                onClick={runDemoScan}
                disabled={demoState === 'scanning'}
                className="btn-ghost"
                style={{ fontSize: 11, padding: '6px 14px', opacity: demoState === 'scanning' ? 0.6 : 1 }}
              >
                {demoState === 'idle' ? 'Run demo scan' : demoState === 'scanning' ? 'Scanning...' : 'Run again'}
              </button>
            </div>
            <div style={{ padding: 28, display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}>
              <svg width="120" height="120" viewBox="0 0 220 220" style={{ flexShrink: 0 }}>
                <circle cx="110" cy="110" r="95" fill="none" stroke="var(--surface-2)" strokeWidth="10" />
                <circle cx="110" cy="110" r="95" fill="none" stroke={scoreColor} strokeWidth="10"
                  strokeDasharray={`${(demoScore / 100) * 596.9} 596.9`}
                  strokeLinecap="round" transform="rotate(-90 110 110)"
                  style={{ filter: `drop-shadow(0 0 12px ${scoreColor})`, transition: 'stroke-dasharray 0.4s ease, stroke 0.4s ease' }} />
                <text x="110" y="102" textAnchor="middle" fontSize="56" fontWeight="700" fill={scoreColor} fontFamily="var(--font-body)">{demoScore}</text>
                <text x="110" y="132" textAnchor="middle" fontSize="14" fill="var(--text-muted)" fontFamily="var(--font-body)">exposure score</text>
              </svg>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 13, color: scoreColor, fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
                  {scoreLabel.toUpperCase()}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {revealedBrokers.length === 0 && demoState === 'idle' && (
                    <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Click "run demo scan" to see how Specter finds broker listings.</div>
                  )}
                  {revealedBrokers.map((b, i) => (
                    <div key={b.name} style={{
                      display: 'flex', justifyContent: 'space-between', fontSize: 13, fontFamily: 'monospace',
                      opacity: 0, animation: 'reveal 0.4s ease forwards',
                    }}>
                      <span>{b.name}</span>
                      <span className="badge-high" style={{ fontSize: 9 }}>found</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="access" style={{ borderTop: '1px solid var(--border)', padding: '88px 0' }}>
        <div className="page" style={{ maxWidth: 1120 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 18 }}>
            Data access
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', maxWidth: 560, marginBottom: 16 }}>
            What Specter can see, and what it can't.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15.5, maxWidth: 520, marginBottom: 40 }}>
            Because Specter requests Gmail access, here's a plain explanation of exactly what that means and why it's needed.
          </p>

          {/* Cursor-reactive redaction demo, ties directly to the product metaphor */}
          <div
            ref={redactRef}
            onMouseMove={handleRedactMove}
            onMouseLeave={() => setMouse({ x: -999, y: -999 })}
            className="card"
            style={{ marginBottom: 40, padding: '24px 28px', cursor: 'crosshair' }}
          >
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-display)', marginBottom: 18, letterSpacing: '0.04em' }}>
              MOVE YOUR CURSOR ACROSS THE DATA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {SAMPLE_FIELDS.map((f, i) => {
                const rowY = 24 + i * 34
                const dist = Math.hypot(mouse.x - 200, mouse.y - rowY)
                const isNear = dist < 90
                return (
                  <div key={f.label} style={{ display: 'flex', gap: 16, fontSize: 14, fontFamily: 'monospace' }}>
                    <span style={{ color: 'var(--text-dim)', width: 110, flexShrink: 0 }}>{f.label}</span>
                    <span style={{
                      color: isNear ? 'transparent' : 'var(--text)',
                      background: isNear ? 'var(--text-dim)' : 'transparent',
                      borderRadius: 3, transition: 'background 0.15s, color 0.15s',
                    }}>
                      {f.value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="perm-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36 }}>
            {PERMISSIONS.map(p => (
              <div key={p.title} style={{ display: 'flex', gap: 14 }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 5, background: 'var(--green-bg)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                  <CheckIcon />
                </span>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" style={{ borderTop: '1px solid var(--border)', padding: '88px 0' }}>
        <div className="page" style={{ maxWidth: 1120 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--pink)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 18 }}>
            Process
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', maxWidth: 560, marginBottom: 16 }}>
            Three steps to disappear.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 15.5, maxWidth: 520, marginBottom: 56 }}>
            No manual broker hunting, no juggling forty opt-out pages.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {STEPS.map(s => (
              <div key={s.num}>
                <div style={{ height: 1, background: 'linear-gradient(90deg, var(--pink), transparent)', marginBottom: 20 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--pink)', marginBottom: 18, display: 'block' }}>{s.num}</span>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="page" style={{ maxWidth: 1120 }}>
        <Footer />
      </div>
    </div>
  )
}