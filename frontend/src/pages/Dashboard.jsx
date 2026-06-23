import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'

const USER_ID = localStorage.getItem('user_id') || 'demo-user'
const API_URL = 'http://localhost:8000'

const riskColors = {
  high:   { bg: '#FCEBEB', color: '#791F1F' },
  medium: { bg: '#FAEEDA', color: '#633806' },
}

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
      showToast('Google connected successfully!')
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
      showToast(`Scan complete. Found ${data.newsletters_found} newsletter senders.`)
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

  const platforms = [
    { id: 'google',  label: 'Google activity & Gmail', desc: scanResults ? `${scanResults.newsletters_found} newsletter senders found` : connected.google ? 'Connected. Click Scan now.' : 'Connect to scan', risk: 'high', isConnected: connected.google },
    { id: 'twitter', label: 'Twitter / X posts',        desc: 'Tweets, likes, replies',            risk: 'high',   isConnected: false },
    { id: 'reddit',  label: 'Reddit posts & comments',  desc: 'Posts and comments by subreddit',   risk: 'medium', isConnected: false },
    { id: 'brokers', label: 'Data brokers',             desc: 'Spokeo, Whitepages, and 18 others', risk: 'medium', isConnected: false },
  ]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#fafaf9' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1a1a18', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}

      {/* Top nav */}
      <div style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '0 24px', height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em', color: '#1a1a18' }}>clearprint</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={runScan} disabled={scanning}
            style={{ padding: '6px 14px', borderRadius: 7, background: 'transparent', color: '#1a1a18', border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 12, fontWeight: 500, cursor: 'pointer', opacity: scanning ? 0.6 : 1 }}>
            {scanning ? 'Scanning...' : 'Scan now'}
          </button>
          <button onClick={() => navigate('/connect')}
            style={{ padding: '6px 14px', borderRadius: 7, background: '#1a1a18', color: '#fff', border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
            Connect accounts
          </button>
          <button onClick={handleSignOut}
            style={{ background: 'none', border: 'none', color: '#9e9e9a', fontSize: 12, cursor: 'pointer', padding: '6px 0' }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>

        <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 4px' }}>Your footprint</h1>
        <p style={{ fontSize: 13, color: '#6b6b67', margin: '0 0 24px' }}>Connect accounts to scan and clean</p>

        {/* Exposure score */}
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#f0efeb" strokeWidth="6"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#E24B4A" strokeWidth="6"
              strokeDasharray={`${(score/100)*175.9} 175.9`}
              strokeLinecap="round" transform="rotate(-90 32 32)"/>
            <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="500" fill="#E24B4A">{score}</text>
          </svg>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Exposure score</div>
            <div style={{ fontSize: 13, color: '#6b6b67', marginTop: 2 }}>
              {score > 60 ? 'High exposure.' : score > 30 ? 'Medium exposure.' : 'Looking good.'} {connected.google ? 'Scan to update.' : 'Connect accounts to start cleaning.'}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Newsletters found', value: scanResults?.newsletters_found ?? '--', sub: 'from Gmail scan' },
            { label: 'Items deleted',     value: totalDeleted,                           sub: 'this session' },
            { label: 'Est. time saved',   value: totalDeleted > 0 ? `${Math.round(totalDeleted * 0.1)}m` : '0m', sub: 'vs. manual' },
          ].map(m => (
            <div key={m.label} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: '#6b6b67', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>{m.value}</div>
              <div style={{ fontSize: 11, color: '#9e9e9a', marginTop: 2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Platform cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {platforms.map(p => (
            <div key={p.id}
              onClick={() => p.id === 'brokers' ? navigate('/removal') : p.id === 'google' && !p.isConnected ? navigate('/connect') : null}
              style={{ background: '#fff', border: `0.5px solid ${p.isConnected ? '#97C459' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color .15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = p.isConnected ? '#7aad3d' : 'rgba(0,0,0,0.25)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = p.isConnected ? '#97C459' : 'rgba(0,0,0,0.1)'}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: '#6b6b67', marginTop: 2 }}>{p.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {p.isConnected && <span style={{ fontSize: 11, color: '#639922' }}>Connected</span>}
                <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: riskColors[p.risk].bg, color: riskColors[p.risk].color }}>
                  {p.risk === 'high' ? 'High risk' : 'Medium risk'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Scan results */}
        {scanResults && scanResults.senders.length > 0 && (
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Newsletter senders found</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {scanResults.senders.map((s, i) => {
                const senderEmail = s.from.match(/<(.+)>/) ? s.from.match(/<(.+)>/)[1] : s.from
                const isDone = deleted[senderEmail]
                const isDeleting = deleting[senderEmail]
                return (
                  <div key={i} style={{ background: '#fff', border: `0.5px solid ${isDone ? '#97C459' : 'rgba(0,0,0,0.08)'}`, borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isDone ? 0.6 : 1 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18', textDecoration: isDone ? 'line-through' : 'none' }}>{s.from.replace(/<.*>/, '').trim()}</div>
                      <div style={{ fontSize: 11, color: '#9e9e9a', marginTop: 2 }}>{s.subject?.slice(0, 60)}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
                      <span style={{ fontSize: 11, color: '#6b6b67' }}>{s.count} emails</span>
                      {isDone ? (
                        <span style={{ fontSize: 11, color: '#639922', fontWeight: 500 }}>Deleted</span>
                      ) : (
                        <button
                          onClick={() => deleteSender(s)}
                          disabled={isDeleting}
                          style={{ padding: '5px 12px', borderRadius: 7, background: '#FCEBEB', color: '#791F1F', border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer', opacity: isDeleting ? 0.6 : 1 }}>
                          {isDeleting ? 'Deleting...' : 'Delete all'}
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