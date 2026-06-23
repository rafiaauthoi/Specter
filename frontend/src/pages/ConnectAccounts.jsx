import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#000">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const RedditIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF4500">
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
  </svg>
)

const icons = { google: GoogleIcon, twitter: TwitterIcon, reddit: RedditIcon }

const platforms = [
  { id: 'google',  label: 'Google',      desc: 'Gmail newsletters, Search history, YouTube activity', what: 'Scans and deletes newsletter emails and activity history' },
  { id: 'twitter', label: 'Twitter / X', desc: 'Tweets, likes, replies older than a set date',         what: 'Bulk deletes old tweets and likes' },
  { id: 'reddit',  label: 'Reddit',      desc: 'Posts and comments across all subreddits',             what: 'Deletes posts and comments by date or subreddit' },
]

export default function ConnectAccounts() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <button onClick={() => navigate('/dashboard')}
        style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
        Back to dashboard
      </button>

      <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 6px' }}>Connect accounts</h1>
      <p style={{ fontSize: 13, color: '#6b6b67', margin: '0 0 8px' }}>
        Clearprint only requests the minimum permissions needed to scan and delete your content.
      </p>
      <p style={{ fontSize: 12, color: '#9e9e9a', margin: '0 0 28px', padding: '10px 14px', background: '#f5f4f0', borderRadius: 8 }}>
        Your tokens are encrypted before being stored. They are never logged or shared.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {platforms.map(p => {
          const Icon = icons[p.id]
          return (
            <div key={p.id} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon />
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{p.label}</div>
                  <div style={{ fontSize: 12, color: '#6b6b67', marginTop: 2 }}>{p.desc}</div>
                  <div style={{ fontSize: 11, color: '#9e9e9a', marginTop: 2 }}>{p.what}</div>
                </div>
              </div>
              <button
                onClick={() => window.location.href = `http://localhost:8000/auth/${p.id}?user_id=${localStorage.getItem('user_id') || 'demo-user'}`}
                style={{ padding: '8px 18px', borderRadius: 8, background: '#1a1a18', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}>
                Connect
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: 24, padding: '16px 20px', background: '#f5f4f0', borderRadius: 12, fontSize: 13, color: '#6b6b67' }}>
        <strong style={{ color: '#1a1a18' }}>Data brokers</strong> do not have APIs, so we guide you through removing yourself manually.
        <button onClick={() => navigate('/removal')}
          style={{ marginLeft: 8, background: 'none', border: 'none', color: '#534AB7', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>
          Go to guided removal
        </button>
      </div>

      <Footer />
    </div>
  )
}