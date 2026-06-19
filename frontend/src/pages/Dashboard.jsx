import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const USER_ID = 'demo-user'

const platforms = [
  { id: 'google',  label: 'Google activity & Gmail', desc: 'Search history, YouTube, newsletters', risk: 'high' },
  { id: 'twitter', label: 'Twitter / X posts',        desc: 'Tweets, likes, replies',              risk: 'high' },
  { id: 'reddit',  label: 'Reddit posts & comments',  desc: 'Posts and comments by subreddit',     risk: 'medium' },
  { id: 'brokers', label: 'Data brokers',             desc: 'Spokeo, Whitepages, and 8 others',    risk: 'medium' },
]

const riskColors = {
  high:   { bg: '#FCEBEB', color: '#791F1F' },
  medium: { bg: '#FAEEDA', color: '#633806' },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [score] = useState(74)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em', marginBottom: 16, color: '#888' }}>clearprint</div>
          <h1 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Your footprint</h1>
          <p style={{ fontSize: 13, color: '#6b6b67', margin: '4px 0 0' }}>Connect accounts to scan and clean</p>
        </div>
        <button
          onClick={() => navigate('/connect')}
          style={{ padding: '8px 16px', borderRadius: 8, background: '#1a1a18', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Connect accounts
        </button>
      </div>

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
          <div style={{ fontSize: 13, color: '#6b6b67', marginTop: 2 }}>High exposure — connect accounts to start cleaning</div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Risks found',     value: '—', sub: 'scan to detect' },
          { label: 'Items deleted',   value: '0', sub: 'this session' },
          { label: 'Est. time saved', value: '0h', sub: 'vs. manual' },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ fontSize: 12, color: '#6b6b67', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: '#9e9e9a', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Platform cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {platforms.map(p => (
          <div key={p.id}
            style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{p.label}</div>
              <div style={{ fontSize: 12, color: '#6b6b67', marginTop: 2 }}>{p.desc}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: riskColors[p.risk].bg, color: riskColors[p.risk].color }}>
              {p.risk === 'high' ? 'High risk' : 'Medium risk'}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}