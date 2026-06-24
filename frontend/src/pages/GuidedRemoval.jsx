import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const brokers = [
  { id: 'spokeo',                   name: 'Spokeo',                    risk: 'high',   url: 'https://www.spokeo.com/optout',                        steps: ['Go to spokeo.com/optout', 'Search your name and state', 'Find your listing', 'Click "Remove this listing"', 'Confirm via email'] },
  { id: 'whitepages',               name: 'Whitepages',                risk: 'high',   url: 'https://www.whitepages.com/suppression-requests',       steps: ['Visit whitepages.com/suppression-requests', 'Search your listing', 'Select your record', 'Click "Remove me"', 'Complete phone verification'] },
  { id: 'beenverified',             name: 'BeenVerified',              risk: 'high',   url: 'https://www.beenverified.com/app/optout/search',        steps: ['Go to beenverified.com opt-out', 'Enter name and state', 'Find your record', 'Click "Opt Out"', 'Confirm via email'] },
  { id: 'intelius',                 name: 'Intelius',                  risk: 'high',   url: 'https://www.intelius.com/opt-out',                      steps: ['Visit intelius.com/opt-out', 'Enter your information', 'Locate your listing', 'Submit removal request'] },
  { id: 'instantcheckmate',         name: 'Instant Checkmate',         risk: 'high',   url: 'https://www.instantcheckmate.com/opt-out/',             steps: ['Go to instantcheckmate.com/opt-out', 'Search your name', 'Click "Remove My Record"', 'Verify via email'] },
  { id: 'truthfinder',              name: 'TruthFinder',               risk: 'high',   url: 'https://www.truthfinder.com/opt-out/',                  steps: ['Go to truthfinder.com/opt-out', 'Enter name, city, state', 'Locate your record', 'Submit removal request'] },
  { id: 'mylife',                   name: 'MyLife',                    risk: 'high',   url: 'https://www.mylife.com/ccpa/index.pubview',             steps: ['Visit mylife.com privacy center', 'Submit CCPA removal request', 'Provide your email', 'Wait up to 30 days'] },
  { id: 'fastpeoplesearch',         name: 'FastPeopleSearch',          risk: 'high',   url: 'https://www.fastpeoplesearch.com/removal',              steps: ['Visit fastpeoplesearch.com/removal', 'Find your listing', 'Click "Remove My Record"', 'Complete captcha', 'Confirm via email'] },
  { id: 'advancedbackgroundchecks', name: 'Advanced Background Checks',risk: 'high',   url: 'https://www.advancedbackgroundchecks.com/removal',      steps: ['Visit advancedbackgroundchecks.com/removal', 'Search your name', 'Find your listing', 'Submit removal request', 'Confirm via email'] },
  { id: 'arrestfacts',              name: 'Arrest Facts',              risk: 'high',   url: 'https://arrestfacts.com/ng/control/privacy',            steps: ['Go to arrestfacts.com privacy page', 'Search your name', 'Find your record', 'Submit opt-out request', 'Confirm via email'] },
  { id: 'peoplefinder',             name: 'PeopleFinder',              risk: 'medium', url: 'https://www.peoplefinder.com/optout.php',               steps: ['Visit peoplefinder.com/optout.php', 'Enter your details', 'Submit opt-out form', 'Check email for confirmation'] },
  { id: 'radaris',                  name: 'Radaris',                   risk: 'medium', url: 'https://radaris.com/control/privacy',                   steps: ['Go to radaris.com/control/privacy', 'Search your profile', 'Request removal', 'Confirm via email'] },
  { id: 'usphonebook',              name: 'US Phone Book',             risk: 'medium', url: 'https://www.usphonebook.com/opt-out',                   steps: ['Go to usphonebook.com/opt-out', 'Search your name', 'Select your record', 'Submit removal form'] },
  { id: 'thatsthem',                name: 'ThatsThem',                 risk: 'medium', url: 'https://thatsthem.com/optout',                          steps: ['Visit thatsthem.com/optout', 'Enter your email', 'Find your record', 'Submit opt-out request'] },
  { id: 'peekyou',                  name: 'PeekYou',                   risk: 'medium', url: 'https://www.peekyou.com/about/contact/optout/',         steps: ['Go to peekyou.com opt-out page', 'Enter your PeekYou username or URL', 'Submit removal request', 'Wait up to 48 hours'] },
  { id: 'clustrmaps',               name: 'ClustrMaps',                risk: 'medium', url: 'https://clustrmaps.com/bl/opt-out',                     steps: ['Visit clustrmaps.com/bl/opt-out', 'Enter your name and location', 'Submit opt-out form', 'Confirm via email'] },
  { id: 'publicrecordsnow',         name: 'Public Records Now',        risk: 'medium', url: 'https://www.publicrecordsnow.com/static/view/optout',   steps: ['Visit publicrecordsnow.com opt-out', 'Search your name', 'Find your record', 'Submit removal request'] },
  { id: 'voterrecords',             name: 'Voter Records',             risk: 'medium', url: 'https://www.voterrecords.com/optout',                   steps: ['Go to voterrecords.com/optout', 'Search your name and state', 'Select your record', 'Submit opt-out form'] },
  { id: 'idcrawl',                  name: 'IDCrawl',                   risk: 'medium', url: 'https://www.idcrawl.com/opt-out',                       steps: ['Visit idcrawl.com/opt-out', 'Enter your name', 'Find your profile', 'Submit removal request'] },
  { id: 'familytreenow',            name: 'FamilyTreeNow',             risk: 'low',    url: 'https://www.familytreenow.com/optout',                  steps: ['Visit familytreenow.com/optout', 'Search your record', 'Select and submit removal request'] },
]

export default function GuidedRemoval() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null)
  const [completed, setCompleted] = useState({})
  const [emailModal, setEmailModal] = useState(null)
  const [userInfo, setUserInfo] = useState({ name: '', email: '' })
  const [showEmailForm, setShowEmailForm] = useState(false)

  const done = Object.values(completed).filter(Boolean).length
  const pct = Math.round((done / brokers.length) * 100)

  function generateEmail(broker) {
    return `To Whom It May Concern,

I am writing to request the immediate removal of my personal information from ${broker.name}'s database, in accordance with applicable privacy laws including the CCPA and similar state regulations.

Full Name: ${userInfo.name}
Email: ${userInfo.email}

Please remove all records associated with my name, address, phone number, and any other personally identifiable information from your database and opt me out of future data collection.

I request written confirmation that my information has been removed within 30 days of this request.

Thank you,
${userInfo.name}`
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-logo">Specter</span>
        <button onClick={() => navigate('/dashboard')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Back to dashboard
        </button>
      </nav>

      <div className="page">
        <h1 className="section-title">Data Broker Removal</h1>
        <p className="section-sub">These sites collect and sell your personal information. Remove yourself from each one.</p>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-active)', borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 20, fontSize: 11, color: 'var(--pink)' }}>
          Set a reminder. Data brokers re-add your info every 3 to 6 months. Repeat this process twice a year.
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>Removal Email Generator</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Generate a ready-to-send opt-out email for any broker</div>
            </div>
            <button onClick={() => setShowEmailForm(!showEmailForm)} className="btn-primary" style={{ fontSize: 11 }}>
              {showEmailForm ? 'Hide' : 'Generate'}
            </button>
          </div>

          {showEmailForm && (
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input placeholder="Your full name" value={userInfo.name} onChange={e => setUserInfo(p => ({ ...p, name: e.target.value }))} />
              <input placeholder="Your email address" value={userInfo.email} onChange={e => setUserInfo(p => ({ ...p, email: e.target.value }))} />
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>This info stays in your browser only. It is never sent to our servers.</div>
              {userInfo.name && userInfo.email && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {brokers.map(b => (
                    <button key={b.id} onClick={() => setEmailModal(b)}
                      style={{ padding: '4px 10px', borderRadius: 6, background: 'var(--surface-2)', border: '1px solid var(--border)', fontSize: 11, cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {emailModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}
            onClick={() => setEmailModal(null)}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border-active)', borderRadius: 'var(--radius-lg)', padding: 24, maxWidth: 540, width: '90%', boxShadow: '0 0 40px var(--pink-glow)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Removal email for {emailModal.name}</div>
                <button onClick={() => setEmailModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 16, cursor: 'pointer' }}>x</button>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>Subject: Personal Data Removal Request — {userInfo.name}</div>
              <textarea readOnly value={generateEmail(emailModal)}
                style={{ width: '100%', height: 220, padding: 12, borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: 11, fontFamily: 'monospace', resize: 'none', background: 'var(--surface-2)', color: 'var(--text)', boxSizing: 'border-box' }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => navigator.clipboard.writeText(generateEmail(emailModal))} className="btn-primary" style={{ flex: 1 }}>
                  Copy email
                </button>
                <button onClick={() => setEmailModal(null)} className="btn-ghost">Close</button>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
            <span style={{ color: 'var(--text)', fontWeight: 500 }}>{done} of {brokers.length} complete</span>
            <span style={{ color: 'var(--pink)', fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 3, background: 'var(--surface-2)', borderRadius: 2 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--pink)', borderRadius: 2, transition: 'width .4s', boxShadow: '0 0 8px var(--pink-glow)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {brokers.map(b => (
            <div key={b.id} style={{ background: 'var(--surface)', border: `1px solid ${completed[b.id] ? 'rgba(57,255,138,0.3)' : 'var(--border)'}`, borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
                <input type="checkbox" checked={!!completed[b.id]}
                  onChange={e => { e.stopPropagation(); setCompleted(p => ({ ...p, [b.id]: e.target.checked })) }}
                  onClick={e => e.stopPropagation()}
                  style={{ width: 14, height: 14, flexShrink: 0, cursor: 'pointer', accentColor: 'var(--pink)' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: completed[b.id] ? 'var(--text-dim)' : 'var(--text)', textDecoration: completed[b.id] ? 'line-through' : 'none' }}>
                    {b.name}
                  </span>
                </div>
                <span className={`badge-${b.risk}`}>{b.risk}</span>
                <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{expanded === b.id ? '▲' : '▼'}</span>
              </div>

              {expanded === b.id && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '12px 14px 14px', background: 'var(--surface-2)' }}>
                  <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                    {b.steps.map((step, i) => (
                      <li key={i} style={{ fontSize: 11, color: 'var(--text-muted)' }}>{step}</li>
                    ))}
                  </ol>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => window.open(b.url, '_blank')} className="btn-primary" style={{ fontSize: 11 }}>
                      Open opt-out page
                    </button>
                    {userInfo.name && userInfo.email && (
                      <button onClick={() => setEmailModal(b)} className="btn-ghost" style={{ fontSize: 11 }}>
                        Generate email
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Footer />
      </div>
    </div>
  )
}