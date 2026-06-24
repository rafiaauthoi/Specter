import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'

const USER_ID = localStorage.getItem('user_id') || 'demo-user'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Dashboard() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
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

  useEffect(() => {
    if (searchParams.get('connected') === 'google') {
      const updated = { ...connected, google: true }
      setConnected(updated)
      localStorage.setItem('connected_accounts', JSON.stringify(updated))
      showToast('Google connected.')
    }
  }, [searchParams])

  useEffect(() => {
    if (scanResults) {
      setScore(Math.min(100, 30 + scanResults.newsletters_found * 2))
    }
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  function handleSignOut() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('cookie_consent')
    localStorage.removeItem('scan_results')
    localStorage.removeItem('connected_accounts')
    window.location.href = '/login'
  }

  async function runScan() {
    if (!connected.google) {
      navigate('/connect')
      return
    }
    setScanning(true)
    try {
      const resp = await fetch(`${API_URL}/google/scan?user_id=${USER_ID}`)
      const data = await resp.json()
      if (!resp.ok) throw new Error(data.detail || 'Scan failed')
      if (!data.senders) throw new Error('Unexpected response from server')
      setScanResults(data)
      localStorage.setItem('scan_results', JSON.stringify(data))
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
      showToast(`Deleted ${data.deleted} emails from ${senderEmail}.`)
    } catch (e) {
      showToast('Delete failed. Try again.')
    } finally {
      setDeleting(p => ({ ...p, [senderEmail]: false }))
    }
  }

  const scoreColor = score > 60 ? 'var(--red)' : score > 30 ? 'var(--orange)' : 'var(--green)'
  const scoreLabel = score > 60 ? 'High exposure' : score > 30 ? 'Medium exposure' : 'Looking good'

  const platforms = [
    {
      id: 'google', label: 'Google / Gmail',
      desc: scanResults ? `${scanResults.newsletters_found} senders found` : connected.google ? 'Connected. Run a scan.' : 'Connect to scan.',
      risk: 'high', isConnected: connected.google
    },
    { id: 'twitter', label: 'Twitter / X', desc: 'Tweets, likes, replies', risk: 'high', isConnected: false },
    { id: 'reddit', label: 'Reddit', desc: 'Posts and comments', risk: 'medium', isConnected: false },
    { id: 'brokers', label: 'Data brokers', desc: 'Spokeo, Whitepages, and 18 others', risk: 'medium', isConnected: false },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {toast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 998,
          background: 'var(--surface)', border: '1px solid var(--border-active)',
          color: 'var(--pink)', padding: '10px 18px', borderRadius: 'var(--radius)',
          fontSize: 12, fontFamily: 'var(--font-body)',
          boxShadow: '0 0 16px var(--pink-glow)'
        }}>
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <span className="navbar-logo">clearprint</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-ghost" onClick={runScan} disabled={scanning}
            style={{ opacity: scanning ? 0.6 : 1, fontSize: 11 }}>
            {scanning ? 'Scanning...' : 'Scan now'}
          </button>
          <button className="btn-primary" onClick={() => navigate('/connect')}
            style={{ fontSize: 11 }}>
            Connect
          </button>
          <button onClick={handleSignOut}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            Sign out
          </button>
        </div>
      </nav>

      <div className="page">

        <div style={{ marginBottom: 28 }}>
          <h1 className="section-title">Your Footprint</h1>
          <p className="section-sub">Connect accounts to scan and clean your digital trail</p>
        </div>

        {/* Exposure score */}
        <div className="card" style={{
          display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16,
          animation: 'glow-pulse 4s ease-in-out infinite'
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface-2)" strokeWidth="6"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke={scoreColor} strokeWidth="6"
                strokeDasharray={`${(score/100)*213.6} 213.6`}
                strokeLinecap="round" transform="rotate(-90 40 40)"
                style={{ filter: `drop-shadow(0 0 6px ${scoreColor})`, transition: 'stroke-dasharray 0.6s ease' }}/>
              <text x="40" y="45" textAnchor="middle" fontSize="16" fontWeight="600" fill={scoreColor}
                fontFamily="var(--font-body)">{score}</text>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              Exposure Score
            </div>
            <div style={{ fontSize: 12, color: scoreColor, fontWeight: 500, marginBottom: 4 }}>
              {scoreLabel}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {connected.google ? 'Run a scan to update' : 'Connect an account to get started'}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Newsletters found', value: scanResults?.newsletters_found ?? '--', sub: 'from Gmail' },
            { label: 'Emails deleted',    value: totalDeleted,                           sub: 'this session' },
            { label: 'Time saved',        value: totalDeleted > 0 ? `${Math.round(totalDeleted * 0.1)}m` : '0m', sub: 'vs. manual' },
          ].map(m => (
            <div key={m.label} className="card" style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{m.label}</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--pink)', marginBottom: 2 }}>{m.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Platform cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {platforms.map(p => (
            <div key={p.id}
              onClick={() => p.id === 'brokers' ? navigate('/removal') : p.id === 'google' && !p.isConnected ? navigate('/connect') : null}
              style={{
                background: 'var(--surface)', border: `1px solid ${p.isConnected ? 'rgba(57,255,138,0.3)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', padding: '14px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = p.isConnected ? 'rgba(57,255,138,0.6)' : 'var(--border-active)'
                e.currentTarget.style.boxShadow = '0 0 12px var(--pink-glow)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = p.isConnected ? 'rgba(57,255,138,0.3)' : 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                {p.isConnected && (
                  <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600, letterSpacing: '0.05em' }}>CONNECTED</span>
                )}
                <span className={`badge-${p.risk}`}>{p.risk}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Scan results */}
        {scanResults && scanResults.senders.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: 'var(--pink)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              Newsletter Senders Found
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {scanResults.senders.map((s, i) => {
                const senderEmail = s.from.match(/<(.+)>/) ? s.from.match(/<(.+)>/)[1] : s.from
                const isDone = deleted[senderEmail]
                const isDeleting = deleting[senderEmail]
                return (
                  <div key={i} style={{
                    background: 'var(--surface)',
                    border: `1px solid ${isDone ? 'rgba(57,255,138,0.3)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)', padding: '11px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    opacity: isDone ? 0.5 : 1, transition: 'opacity 0.3s'
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', textDecoration: isDone ? 'line-through' : 'none' }}>
                        {s.from.replace(/<.*>/, '').trim()}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                        {s.subject?.slice(0, 60)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{s.count} emails</span>
                      {isDone ? (
                        <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600, letterSpacing: '0.05em' }}>DELETED</span>
                      ) : (
                        <button onClick={() => deleteSender(s)} disabled={isDeleting}
                          style={{
                            padding: '5px 12px', borderRadius: 6,
                            background: 'var(--red-bg)', color: 'var(--red)',
                            border: '1px solid rgba(255,68,102,0.3)',
                            fontSize: 10, fontWeight: 600, cursor: 'pointer',
                            fontFamily: 'var(--font-body)', letterSpacing: '0.05em',
                            opacity: isDeleting ? 0.6 : 1
                          }}>
                          {isDeleting ? '...' : 'DELETE'}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  )
}