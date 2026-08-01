import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const DATA_FRAGMENTS = [
  '123 Elm St', 'jdoe@gmail.com', 'SSN ***-**-4471', '(512) 555-0148', 'DOB 04/12',
]

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
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 4px var(--pink-glow-strong))' }}>
      <defs>
        <linearGradient id="ghostMarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff69b4" stopOpacity="1" />
          <stop offset="100%" stopColor="#c44d8a" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d="M 50 10 C 25 10 15 28 15 48 L 15 85 L 25 75 L 35 85 L 45 75 L 55 85 L 65 75 L 75 85 L 85 75 L 85 48 C 85 28 75 10 50 10 Z" fill="url(#ghostMarkGrad)" />
      <circle cx="38" cy="45" r="7" fill="#0a0a0f" />
      <circle cx="62" cy="45" r="7" fill="#0a0a0f" />
      <circle cx="41" cy="42" r="2.5" fill="#ff69b4" opacity="0.6" />
      <circle cx="65" cy="42" r="2.5" fill="#ff69b4" opacity="0.6" />
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
      <style>{`
        .hero-scene {
          position: relative; overflow: hidden; padding: 100px 0 64px;
          background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(255,105,180,0.08), transparent 70%);
        }
        .grid-floor {
          position: absolute; left: 0; right: 0; bottom: 0; height: 55%;
          background-image: linear-gradient(rgba(255,105,180,0.16) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,105,180,0.16) 1px, transparent 1px);
          background-size: 42px 42px;
          transform: perspective(320px) rotateX(62deg);
          transform-origin: bottom;
          -webkit-mask-image: linear-gradient(to top, black 0%, transparent 90%);
          mask-image: linear-gradient(to top, black 0%, transparent 90%);
          pointer-events: none;
        }
        .hud-chip {
          position: absolute; font-family: var(--font-display); font-size: 9px; color: var(--pink);
          border: 1px solid var(--border-active); border-radius: 4px; padding: 6px 10px;
          background: rgba(10,10,15,0.6); backdrop-filter: blur(4px); letter-spacing: 0.05em;
          animation: drift 7s ease-in-out infinite; pointer-events: none;
        }
        .hud-chip-1 { top: 10%; right: 8%; animation-delay: 0s; }
        .hud-chip-2 { top: 26%; right: 3%; animation-delay: 2.2s; }
        .hud-chip-3 { top: 42%; right: 9%; animation-delay: 4.4s; }
        @keyframes drift { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .hero-stage { position: relative; display: flex; align-items: center; gap: 40px; margin-bottom: 44px; flex-wrap: wrap; }
        .glitch-h1 { font-size: 50px; font-weight: 700; line-height: 1.12; letter-spacing: -0.02em; max-width: 620px; flex: 1; min-width: 280px; }
        .glitch-line { display: block; }
        .glitch-line.glitch-accent {
          color: var(--pink); position: relative; display: inline-block;
        }
        .glitch-line.glitch-accent::before, .glitch-line.glitch-accent::after {
          content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; overflow: hidden;
          background: var(--bg);
        }
        .glitch-line.glitch-accent::before { color: var(--cyan); animation: glitchTop 4.5s infinite linear; }
        .glitch-line.glitch-accent::after { color: #7a3dff; animation: glitchBottom 4.5s infinite linear; }
        @keyframes glitchTop {
          0%, 92%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
          93% { clip-path: inset(10% 0 60% 0); transform: translate(-3px, -1px); }
          95% { clip-path: inset(40% 0 20% 0); transform: translate(2px, 1px); }
          97% { clip-path: inset(0 0 100% 0); transform: translate(0); }
        }
        @keyframes glitchBottom {
          0%, 92%, 100% { clip-path: inset(100% 0 0 0); transform: translate(0); }
          93% { clip-path: inset(60% 0 5% 0); transform: translate(3px, 1px); }
          95% { clip-path: inset(15% 0 45% 0); transform: translate(-2px, -1px); }
          97% { clip-path: inset(100% 0 0 0); transform: translate(0); }
        }

        .chrome-ghost-wrap { position: relative; width: 220px; height: 240px; flex-shrink: 0; margin: 0 auto; }
        .chrome-ghost { width: 100%; height: 100%; filter: drop-shadow(0 0 28px var(--pink-glow-strong)); animation: ghostFloat 5s ease-in-out infinite; }
        @keyframes ghostFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .data-fragment {
          position: absolute; font-family: monospace; font-size: 10px; color: var(--text-muted);
          background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 3px 8px;
          white-space: nowrap; opacity: 0;
          animation: absorb 4.5s ease-in infinite;
        }
        .data-fragment:nth-child(2) { top: 6%; left: -12%; }
        .data-fragment:nth-child(3) { top: 24%; right: -18%; }
        .data-fragment:nth-child(4) { top: 60%; left: -20%; }
        .data-fragment:nth-child(5) { top: 76%; right: -14%; }
        .data-fragment:nth-child(6) { top: 46%; left: -24%; }
        @keyframes absorb {
          0% { opacity: 0; transform: translate(0, 0) scale(1); }
          15% { opacity: 1; }
          80% { opacity: 0.9; transform: translate(var(--tx, 40px), var(--ty, 10px)) scale(0.9); }
          100% { opacity: 0; transform: translate(calc(var(--tx, 40px) * 2), calc(var(--ty, 10px) * 2)) scale(0.2); }
        }
        .data-fragment:nth-child(2) { --tx: 70px; --ty: 30px; }
        .data-fragment:nth-child(3) { --tx: -70px; --ty: 20px; }
        .data-fragment:nth-child(4) { --tx: 70px; --ty: -30px; }
        .data-fragment:nth-child(5) { --tx: -60px; --ty: -40px; }
        .data-fragment:nth-child(6) { --tx: 60px; --ty: 0px; }

        .term-cta { max-width: 560px; }
        .term-cta-line {
          display: flex; align-items: center; gap: 10px; font-family: monospace; font-size: 15px;
          margin-bottom: 10px; flex-wrap: wrap;
        }
        .term-cta-prompt { color: var(--pink); font-weight: 700; }
        .term-cta-cmd {
          color: var(--text); position: relative; display: inline-block; overflow: hidden;
          white-space: nowrap; border-right: none; width: 30ch; max-width: 100%;
          animation: typeCmd 1.8s steps(30, end) 0.3s both;
        }
        @keyframes typeCmd { from { width: 0; } }
        .term-cta-caret {
          display: inline-block; width: 8px; height: 16px; background: var(--pink);
          animation: blink 1s step-end infinite; flex-shrink: 0;
        }
        .term-cta-out {
          font-family: monospace; font-size: 12.5px; color: var(--text-muted); margin-bottom: 24px;
          opacity: 0; animation: reveal 0.5s ease 2.3s forwards;
        }
        .term-cta-actions {
          display: flex; gap: 14px; opacity: 0; animation: reveal 0.5s ease 2.7s forwards;
        }
        .term-cta-actions .btn-primary, .term-cta-actions .btn-ghost { padding: 13px 24px; font-size: 14px; }

        @media (prefers-reduced-motion: reduce) {
          .hud-chip, .chrome-ghost, .data-fragment, .glitch-line.glitch-accent::before, .glitch-line.glitch-accent::after { animation: none !important; }
        }
        @media (max-width: 760px) {
          .hero-stage { flex-direction: column; }
          .glitch-h1 { font-size: 34px; }
          .hud-chip { display: none; }
        }
      `}</style>

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
        <div className="navbar-logo" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <GhostMark />
          <span>specter</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#access" style={{ fontSize: 13, color: 'var(--text-muted)' }}>data access</a>
          <a href="#how" style={{ fontSize: 13, color: 'var(--text-muted)' }}>how it works</a>
          <button className="btn-primary" onClick={() => navigate('/login')}>Sign in with Google</button>
        </div>
      </nav>

      <header className="hero-scene">
        <div className="grid-floor" />

        <div className="hud-chip hud-chip-1">// TRACKED</div>
        <div className="hud-chip hud-chip-2">// EXPOSED</div>
        <div className="hud-chip hud-chip-3">// GHOST_MODE</div>

        <div className="page" style={{ maxWidth: 1120, position: 'relative' }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--pink)',
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, letterSpacing: '0.04em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pink)', boxShadow: '0 0 8px var(--pink-glow-strong)' }} />
            20+ DATA BROKERS MONITORED
          </div>

          <div className="hero-stage">
            <h1 className="glitch-h1" data-text="MAKE IT DISAPPEAR">
              <span className="glitch-line">Find where your</span>
              <span className="glitch-line">data lives. Then</span>
              <span className="glitch-line glitch-accent" data-text="disappear.">make it disappear.</span>
            </h1>

            <div className="chrome-ghost-wrap" aria-hidden="true">
              <svg viewBox="0 0 200 220" className="chrome-ghost">
                <defs>
                  <linearGradient id="ghostBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3a2a44" />
                    <stop offset="35%" stopColor="#120a18" />
                    <stop offset="60%" stopColor="#1a0f22" />
                    <stop offset="100%" stopColor="#050307" />
                  </linearGradient>
                  <linearGradient id="ghostRim" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--pink)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#7a3dff" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <path d="M100 6C48 6 12 46 12 96v104c0 8 9 13 16 9l17-11a10 10 0 0 1 11 1l14 12a10 10 0 0 0 13 0l13-12a10 10 0 0 1 13 0l13 12a10 10 0 0 0 13 0l14-12a10 10 0 0 1 11-1l17 11c7 4 16-1 16-9V96C188 46 152 6 100 6Z"
                  fill="url(#ghostBody)" stroke="url(#ghostRim)" strokeWidth="2" />
                <circle cx="72" cy="92" r="9" fill="var(--pink)" opacity="0.9" />
                <circle cx="128" cy="92" r="9" fill="var(--pink)" opacity="0.9" />
              </svg>
              {DATA_FRAGMENTS.map((f, i) => (
                <span key={f} className="data-fragment" style={{ animationDelay: `${i * 0.9}s` }}>{f}</span>
              ))}
            </div>
          </div>

          <div className="term-cta">
            <div className="term-cta-line">
              <span className="term-cta-prompt">specter&gt;</span>
              <span className="term-cta-cmd">scan --target=inbox --brokers=20+</span>
              <span className="term-cta-caret" />
            </div>
            <div className="term-cta-out">// 20+ signatures loaded. awaiting authorization.</div>
            <div className="term-cta-actions">
              <button className="btn-primary" onClick={() => navigate('/login')}>Sign in with Google</button>
              <a href="#how" className="btn-ghost">See how it works</a>
            </div>
          </div>

          {/* Interactive demo scan, reusing Dashboard's ring visualization */}
          <div className="card" style={{ maxWidth: 640, padding: 0, overflow: 'hidden', marginTop: 56, marginLeft: 'auto', marginRight: 'auto' }}>
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
                <div style={{ fontSize: 10, color: scoreColor, fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>
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