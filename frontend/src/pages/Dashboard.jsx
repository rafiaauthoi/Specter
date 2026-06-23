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
  const [scanResults, setScanResults] = useState(null)
  const [connected, setConnected] = useState({ google: false })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (searchParams.get('connected') === 'google') {
      setConnected(p => ({ ...p, google: true }))
      showToast('Google connected successfully!')
    }
  }, [searchParams])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
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
      setScanResults(data)
      setScore(Math.min(100, 30 + data.newsletters_found * 2))
      showToast(`Scan complete. Found ${data.newsletters_found} newsletter senders.`)
    } catch (e) {
      showToast('Scan failed. Try again.')
    } finally {
      setScanning(false)
    }
  }

  const platforms = [
    { id: 'google',  label: 'Google activity & Gmail', desc: scanResults ? `${scanResults.newsletters_found} newsletter senders found` : connected.google ? 'Connected. Click Scan now.' : 'Connect to scan', risk: 'high', isConnected: connected.google },
    { id: 'twitter', label: 'Twitter / X posts',        desc: 'Tweets, likes, replies',            risk: 'high',   isConnected: false },
    { id: 'reddit',  label: 'Reddit posts & comments',  desc: 'Posts and comments by subreddit',   risk: 'medium', isConnected: false },
    { id: 'brokers', label: 'Data brokers',             desc: 'Spokeo, Whitepages, and 18 others', risk: 'medium', isConnected: false },
  ]

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, background: '#1a1a18', color: '#fff', padding: '10px 18px', borderRadius: 10, fontSize: 13, zIndex: 999 }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 16, color: '#888' }}>clearprint</div>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Your footprint</h1>
          <p style={{ fontSize: 13, color: '#6b6b67', margin: '4px 0 0' }}>Connect accounts to scan and clean</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={runScan} disabled={scanning}
            style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', color: '#1a1a18', border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, fontWeight: 500, cursor: 'pointer', opacity: scanning ? 0.6 : 1 }}>
            {scanning ? 'Scanning...' : 'Scan now'}
          </button>
          <button onClick={() => navigate('/connect')}
            style={{ padding: '8px 16px', borderRadius: 8, background: '#1a1a18', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            Connect accounts
          </button>
        </div>
      </div>

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Newsletters found', value: scanResults?.newsletters_found ?? '--', sub: 'from Gmail scan' },
          { label: 'Items deleted',     value: '0',                                    sub: 'this session' },
          { label: 'Est. time saved',   value: scanResults ? `${Math.round(scanResults.newsletters_found * 0.5)}m` : '0m', sub: 'vs. manual' },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: '#6b6b67', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#9e9e9a', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

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

      {scanResults && scanResults.senders.length > 0 && (
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 500, marginBottom: 12 }}>Newsletter senders found</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {scanResults.senders.map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 10, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a18' }}>{s.from.replace(/<.*>/, '').trim()}</div>
                  <div style={{ fontSize: 11, color: '#9e9e9a', marginTop: 2 }}>{s.subject?.slice(0, 60)}</div>
                </div>
                <span style={{ fontSize: 11, color: '#6b6b67', flexShrink: 0, marginLeft: 12 }}>{s.count} emails</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}