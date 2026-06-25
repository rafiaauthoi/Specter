import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'

const USER_ID = localStorage.getItem('user_id') || 'demo-user'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const TAGLINES = [
  'leave no trace.',
  'disappear from the internet.',
  'you were never here.',
  'erase your digital footprint.',
  'ghost mode: on.',
]

const BOOT_LINES = [
  '> initializing specter...',
  '> scanning environment...',
  '> encrypting channel...',
  '> secure connection established.',
  '> welcome back.',
]

const REDACTED = [
  { from: '████████████', subject: '████████████████████████████', count: '?' },
  { from: '███████████████████', subject: '██████████████████████', count: '?' },
  { from: '██████████████', subject: '█████████████████████████████', count: '?' },
  { from: '█████████████████████', subject: '████████████████████', count: '?' },
  { from: '████████████████', subject: '████████████████████████████', count: '?' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [booting, setBooting] = useState(() => !sessionStorage.getItem('specter_booted'))
  const [bootLines, setBootLines] = useState([])
  const [bootFading, setBootFading] = useState(false)

  const [taglineIndex, setTaglineIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [typing, setTyping] = useState(true)

  const [score, setScore] = useState(74)
  const [scanning, setScanning] = useState(false)
  const [scanResults, setScanResults] = useState(() => {
    const saved = localStorage.getItem('scan_results')
    return saved ? JSON.parse(saved) : null
  })
  const [connected, setConnected] = useState(() => {
    const saved = localStorage.getItem('connected_accounts')
    return saved ? JSON.parse(saved) : { google: false }
  })
  const [toast, setToast] = useState(null)
  const [deleting, setDeleting] = useState({})
  const [deleted, setDeleted] = useState({})
  const [totalDeleted, setTotalDeleted] = useState(0)
  const [lastScan, setLastScan] = useState(() => localStorage.getItem('last_scan_time') || null)

  // Boot sequence
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
            sessionStorage.setItem('specter_booted', '1')
          }, 700)
        }, 600)
      }
    }, 320)
    return () => clearInterval(interval)
  }, [])

  // Tagline typing
  useEffect(() => {
    const target = TAGLINES[taglineIndex]
    if (typing) {
      if (displayText.length < target.length) {
        const t = setTimeout(() => setDisplayText(target.slice(0, displayText.length + 1)), 55)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 2400)
        return () => clearTimeout(t)
      }
    } else {
      if (displayText.length > 0) {
        const t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), 25)
        return () => clearTimeout(t)
      } else {
        setTaglineIndex(i => (i + 1) % TAGLINES.length)
        setTyping(true)
      }
    }
  }, [displayText, typing, taglineIndex])

  useEffect(() => {
    if (searchParams.get('connected') === 'google') {
      const updated = { ...connected, google: true }
      setConnected(updated)
      localStorage.setItem('connected_accounts', JSON.stringify(updated))
      showToast('Google connected.')
    }
  }, [searchParams])

  useEffect(() => {
    if (scanResults) setScore(Math.min(100, 30 + scanResults.newsletters_found * 2))
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  function handleSignOut() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('cookie_consent')
    localStorage.removeItem('scan_results')
    localStorage.removeItem('connected_accounts')
    localStorage.removeItem('last_scan_time')
    sessionStorage.removeItem('specter_booted')
    window.location.href = '/login'
  }

  async function runScan() {
    if (!connected.google) { navigate('/connect'); return }
    setScanning(true)
    try {
      const resp = await fetch(`${API_URL}/google/scan?user_id=${USER_ID}`)
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Scan failed')
      if (!data.senders) throw new Error('Unexpected response')
      setScanResults(data)
      localStorage.setItem('scan_results', JSON.stringify(data))
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      localStorage.setItem('last_scan_time', now)
      setLastScan(now)
      setScore(Math.min(100, 30 + data.newsletters_found * 2))
      showToast(`Scan complete. Found ${data.newsletters_found} senders.`)
    } catch (e) {
      showToast('Scan failed. Try again.')
    } finally {
      setScanning(false)
    }
  }

  async function deleteSender(sender) {
    const senderEmail = sender.from.match(/<(.+)>/) ? sender.from.match(/<(.+)>/)[1] : sender.from
    setDeleting(p => ({ ...p, [senderEmail]: true }))
    try {
      const resp = await fetch(
        `${API_URL}/google/delete-sender?user_id=${USER_ID}&sender_email=${encodeURIComponent(senderEmail)}`,
        { method: 'DELETE' }
      )
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Delete failed')
      setDeleted(p => ({ ...p, [senderEmail]: true }))
      setTotalDeleted(n => n + (data.deleted || 0))
      setScore(s => Math.max(0, s - 3))
      showToast(`Deleted ${data.deleted} emails.`)
    } catch (e) {
      showToast('Delete failed. Try again.')
    } finally {
      setDeleting(p => ({ ...p, [senderEmail]: false }))
    }
  }

  const scoreColor = score > 60 ? 'var(--red)' : score > 30 ? 'var(--orange)' : 'var(--green)'
  const scoreLabel = score > 60 ? 'High Exposure' : score > 30 ? 'Medium Exposure' : 'Clean'
  const threatColor = score > 60 ? 'var(--red)' : score > 30 ? 'var(--orange)' : 'var(--green)'
  const threatText = score > 60
    ? 'THREAT LEVEL: HIGH — your digital footprint is exposed'
    : score > 30
    ? 'THREAT LEVEL: MEDIUM — some exposure detected'
    : 'THREAT LEVEL: LOW — footprint is minimal'

  const platforms = [
    { id: 'google',  label: 'Google / Gmail', desc: scanResults ? `${scanResults.newsletters_found} senders found` : connected.google ? 'Connected. Run a scan.' : 'Connect to scan.', risk: 'high',   isConnected: connected.google },
    { id: 'twitter', label: 'Twitter / X',    desc: 'Tweets, likes, replies',            risk: 'high',   isConnected: false },
    { id: 'reddit',  label: 'Reddit',         desc: 'Posts and comments',                risk: 'medium', isConnected: false },
    { id: 'brokers', label: 'Data Brokers',   desc: 'Spokeo, Whitepages, and 18 others', risk: 'medium', isConnected: false },
  ]

  if (booting) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        opacity: bootFading ? 0 : 1, transition: 'opacity 0.7s ease'
      }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--pink)', marginBottom: 36, letterSpacing: '0.05em' }}>
            specter
          </div>
          {bootLines.map((line, i) => (
            <div key={i} style={{
              fontSize: 14, color: i === bootLines.length - 1 ? 'var(--pink)' : 'var(--text-muted)',
              marginBottom: 12, fontFamily: 'monospace', animation: 'fadeIn 0.25s ease'
            }}>
              {line}
            </div>
          ))}
          {bootLines.length > 0 && (
            <span style={{ fontSize: 14, color: 'var(--pink)', fontFamily: 'monospace', animation: 'blink 1s infinite' }}>█</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Threat level bar */}
      <div style={{
        background: `${threatColor}12`,
        borderBottom: `1px solid ${threatColor}30`,
        padding: '8px 24px', textAlign: 'center',
        position: 'relative', zIndex: 101
      }}>
        <span style={{ fontSize: 9, color: threatColor, fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>
          {threatText}
        </span>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 998,
          background: 'var(--surface)', border: '1px solid var(--border-active)',
          color: 'var(--pink)', padding: '12px 20px', borderRadius: 'var(--radius)',
          fontSize: 13, boxShadow: '0 0 20px var(--pink-glow)', animation: 'fadeIn 0.2s ease'
        }}>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span className="navbar-logo">specter</span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', letterSpacing: '0.02em', minHeight: 15 }}>
            {displayText}<span style={{ animation: 'blink 1s infinite', color: 'var(--pink)' }}>_</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-ghost" onClick={runScan} disabled={scanning} style={{ opacity: scanning ? 0.6 : 1, fontSize: 12 }}>
            {scanning ? 'Scanning...' : 'Scan now'}
          </button>
          <button className="btn-primary" onClick={() => navigate('/connect')} style={{ fontSize: 12 }}>Connect</button>
          <button onClick={handleSignOut} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="page">

        {/* Hero */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '52px 0 56px', borderBottom: '1px solid var(--border)', marginBottom: 44
        }}>

          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <filter id="noise-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" result="noise"/>
                <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
                <feBlend in="SourceGraphic" in2="gray" mode="overlay" result="blend"/>
                <feComposite in="blend" in2="SourceGraphic" operator="in"/>
              </filter>
            </defs>
          </svg>

          <div style={{ position: 'relative', marginBottom: 32, filter: score > 60 ? 'url(#noise-filter)' : 'none', transition: 'filter 1.2s ease' }}>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="95" fill="none" stroke="var(--surface-2)" strokeWidth="8"/>
              <circle cx="110" cy="110" r="95" fill="none" stroke={scoreColor} strokeWidth="8"
                strokeDasharray={`${(score/100)*596.9} 596.9`}
                strokeLinecap="round" transform="rotate(-90 110 110)"
                style={{
                  filter: `drop-shadow(0 0 16px ${scoreColor}) drop-shadow(0 0 32px ${scoreColor}60)`,
                  transition: 'stroke-dasharray 0.9s ease, stroke 0.9s ease'
                }}/>
              <text x="110" y="100" textAnchor="middle" fontSize="52" fontWeight="700" fill={scoreColor} fontFamily="var(--font-body)">{score}</text>
              <text x="110" y="124" textAnchor="middle" fontSize="13" fill="var(--text-muted)" fontFamily="var(--font-body)">exposure score</text>
              <text x="110" y="144" textAnchor="middle" fontSize="11" fill={scoreColor} fontFamily="var(--font-body)" fontWeight="600">{scoreLabel.toUpperCase()}</text>
            </svg>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Your Footprint</div>
            <div style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 420, lineHeight: 1.6 }}>
              {connected.google
                ? `Specter has scanned your connected accounts. ${scanResults ? `${scanResults.newsletters_found} newsletter senders identified.` : 'Run a scan to detect exposure.'}`
                : 'Connect your accounts to let Specter scan and quantify your digital exposure across platforms.'
              }
            </div>
          </div>

          {/* Status row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: connected.google ? 'var(--green)' : 'var(--text-dim)', boxShadow: connected.google ? '0 0 6px var(--green)' : 'none' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {connected.google ? 'Google connected' : 'No accounts connected'}
              </span>
            </div>
            {lastScan && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--pink)', boxShadow: '0 0 6px var(--pink-glow)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>last scan: {lastScan}</span>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 6px var(--green)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>channel encrypted</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 44 }}>
          {[
            { label: 'Newsletters Found', value: scanResults?.newsletters_found ?? '--', sub: 'from Gmail scan' },
            { label: 'Emails Deleted',    value: totalDeleted,                           sub: 'this session' },
            { label: 'Time Saved',        value: totalDeleted > 0 ? `${Math.round(totalDeleted * 0.1)}m` : '0m', sub: 'vs. manual cleanup' },
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: '22px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: 'var(--pink)', marginBottom: 6, lineHeight: 1 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="divider" style={{ marginBottom: 18 }}>
          <span className="divider-label">Connected Platforms</span>
          <div className="divider-line" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 44 }}>
          {platforms.map(p => (
            <div key={p.id}
              onClick={() => p.id === 'brokers' ? navigate('/removal') : p.id === 'google' && !p.isConnected ? navigate('/connect') : null}
              style={{
                background: 'var(--surface)',
                border: `1px solid ${p.isConnected ? 'rgba(57,255,138,0.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--pink)'
                e.currentTarget.style.boxShadow = '0 0 32px var(--pink-glow-strong), 0 0 64px var(--pink-glow), inset 0 0 32px rgba(255,105,180,0.03)'
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.background = 'rgba(255,105,180,0.04)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = p.isConnected ? 'rgba(57,255,138,0.3)' : 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.background = 'var(--surface)'
              }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 5 }}>{p.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                {p.isConnected && (
                  <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em' }}>CONNECTED</span>
                )}
                <span className={`badge-${p.risk}`}>{p.risk}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scan results */}
        <div className="divider" style={{ marginBottom: 18 }}>
          <span className="divider-label">{scanResults ? `${scanResults.newsletters_found} Senders Identified` : 'Awaiting Scan'}</span>
          <div className="divider-line" />
        </div>

        {!scanResults && (
          <div style={{ marginBottom: 12, fontSize: 12, color: 'var(--text-dim)', fontFamily: 'monospace' }}>
            // run a scan to identify newsletter senders
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!scanResults ? (
            REDACTED.map((r, i) => (
              <div key={i} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '16px 20px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: 0.35
              }}>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--pink)', fontFamily: 'monospace', marginBottom: 5, letterSpacing: '0.05em' }}>{r.from}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'monospace' }}>{r.subject}</div>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-dim)', flexShrink: 0, marginLeft: 16 }}>? emails</span>
              </div>
            ))
          ) : (
            scanResults.senders.map((s, i) => {
              const senderEmail = s.from.match(/<(.+)>/) ? s.from.match(/<(.+)>/)[1] : s.from
              const isDone = deleted[senderEmail]
              const isDeleting = deleting[senderEmail]
              return (
                <div key={i}
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${isDone ? 'rgba(57,255,138,0.3)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)', padding: '14px 20px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: isDone ? 0.45 : 1, transition: 'all 0.3s ease',
                    animation: `reveal 0.3s ease ${i * 0.04}s both`
                  }}
                  onMouseEnter={e => {
                    if (!isDone) {
                      e.currentTarget.style.borderColor = 'var(--border-active)'
                      e.currentTarget.style.boxShadow = '0 0 20px var(--pink-glow), 0 0 40px rgba(255,105,180,0.08)'
                      e.currentTarget.style.transform = 'translateX(2px)'
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = isDone ? 'rgba(57,255,138,0.3)' : 'var(--border)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', textDecoration: isDone ? 'line-through' : 'none', marginBottom: 4 }}>
                      {s.from.replace(/<.*>/, '').trim()}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.subject?.slice(0, 64)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginLeft: 16 }}>
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{s.count} emails</span>
                    {isDone ? (
                      <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700, letterSpacing: '0.06em' }}>DELETED</span>
                    ) : (
                      <button onClick={() => deleteSender(s)} disabled={isDeleting}
                        style={{
                          padding: '7px 18px', borderRadius: 6,
                          background: 'var(--red-bg)', color: 'var(--red)',
                          border: '1px solid rgba(255,68,102,0.3)',
                          fontSize: 11, fontWeight: 700, cursor: 'pointer',
                          fontFamily: 'var(--font-body)', letterSpacing: '0.06em',
                          opacity: isDeleting ? 0.6 : 1, transition: 'box-shadow 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 12px rgba(255,68,102,0.5)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                        {isDeleting ? '...' : 'DELETE'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <Footer />
      </div>
    </div>
  )
}