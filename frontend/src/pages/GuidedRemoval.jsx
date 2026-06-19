import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const brokers = [
  { id: 'spokeo',                   name: 'Spokeo',                    risk: 'high',   url: 'https://www.spokeo.com/optout',                                    steps: ['Go to spokeo.com/optout', 'Search your name and state', 'Find your listing', 'Click "Remove this listing"', 'Confirm via email'] },
  { id: 'whitepages',               name: 'Whitepages',                risk: 'high',   url: 'https://www.whitepages.com/suppression-requests',                  steps: ['Visit whitepages.com/suppression-requests', 'Search your listing', 'Select your record', 'Click "Remove me"', 'Complete phone verification'] },
  { id: 'beenverified',             name: 'BeenVerified',              risk: 'high',   url: 'https://www.beenverified.com/app/optout/search',                   steps: ['Go to beenverified.com opt-out', 'Enter name and state', 'Find your record', 'Click "Opt Out"', 'Confirm via email'] },
  { id: 'intelius',                 name: 'Intelius',                  risk: 'high',   url: 'https://www.intelius.com/opt-out',                                 steps: ['Visit intelius.com/opt-out', 'Enter your information', 'Locate your listing', 'Submit removal request'] },
  { id: 'instantcheckmate',         name: 'Instant Checkmate',         risk: 'high',   url: 'https://www.instantcheckmate.com/opt-out/',                        steps: ['Go to instantcheckmate.com/opt-out', 'Search your name', 'Click "Remove My Record"', 'Verify via email'] },
  { id: 'truthfinder',              name: 'TruthFinder',               risk: 'high',   url: 'https://www.truthfinder.com/opt-out/',                             steps: ['Go to truthfinder.com/opt-out', 'Enter name, city, state', 'Locate your record', 'Submit removal request'] },
  { id: 'mylife',                   name: 'MyLife',                    risk: 'high',   url: 'https://www.mylife.com/ccpa/index.pubview',                        steps: ['Visit mylife.com privacy center', 'Submit CCPA removal request', 'Provide your email', 'Wait up to 30 days'] },
  { id: 'fastpeoplesearch',         name: 'FastPeopleSearch',          risk: 'high',   url: 'https://www.fastpeoplesearch.com/removal',                         steps: ['Visit fastpeoplesearch.com/removal', 'Find your listing', 'Click "Remove My Record"', 'Complete captcha', 'Confirm via email'] },
  { id: 'advancedbackgroundchecks', name: 'Advanced Background Checks',risk: 'high',   url: 'https://www.advancedbackgroundchecks.com/removal',                 steps: ['Visit advancedbackgroundchecks.com/removal', 'Search your name', 'Find your listing', 'Submit removal request', 'Confirm via email'] },
  { id: 'arrestfacts',              name: 'Arrest Facts',              risk: 'high',   url: 'https://arrestfacts.com/ng/control/privacy',                       steps: ['Go to arrestfacts.com privacy page', 'Search your name', 'Find your record', 'Submit opt-out request', 'Confirm via email'] },
  { id: 'peoplefinder',             name: 'PeopleFinder',              risk: 'medium', url: 'https://www.peoplefinder.com/optout.php',                          steps: ['Visit peoplefinder.com/optout.php', 'Enter your details', 'Submit opt-out form', 'Check email for confirmation'] },
  { id: 'radaris',                  name: 'Radaris',                   risk: 'medium', url: 'https://radaris.com/control/privacy',                              steps: ['Go to radaris.com/control/privacy', 'Search your profile', 'Request removal', 'Confirm via email'] },
  { id: 'usphonebook',              name: 'US Phone Book',             risk: 'medium', url: 'https://www.usphonebook.com/opt-out',                              steps: ['Go to usphonebook.com/opt-out', 'Search your name', 'Select your record', 'Submit removal form'] },
  { id: 'thatsthem',                name: 'ThatsThem',                 risk: 'medium', url: 'https://thatsthem.com/optout',                                     steps: ['Visit thatsthem.com/optout', 'Enter your email', 'Find your record', 'Submit opt-out request'] },
  { id: 'peekyou',                  name: 'PeekYou',                   risk: 'medium', url: 'https://www.peekyou.com/about/contact/optout/',                    steps: ['Go to peekyou.com opt-out page', 'Enter your PeekYou username or URL', 'Submit removal request', 'Wait up to 48 hours'] },
  { id: 'clustrmaps',               name: 'ClustrMaps',                risk: 'medium', url: 'https://clustrmaps.com/bl/opt-out',                                steps: ['Visit clustrmaps.com/bl/opt-out', 'Enter your name and location', 'Submit opt-out form', 'Confirm via email'] },
  { id: 'publicrecordsnow',         name: 'Public Records Now',        risk: 'medium', url: 'https://www.publicrecordsnow.com/static/view/optout',              steps: ['Visit publicrecordsnow.com opt-out', 'Search your name', 'Find your record', 'Submit removal request'] },
  { id: 'voterrecords',             name: 'Voter Records',             risk: 'medium', url: 'https://www.voterrecords.com/optout',                              steps: ['Go to voterrecords.com/optout', 'Search your name and state', 'Select your record', 'Submit opt-out form'] },
  { id: 'idcrawl',                  name: 'IDCrawl',                   risk: 'medium', url: 'https://www.idcrawl.com/opt-out',                                 steps: ['Visit idcrawl.com/opt-out', 'Enter your name', 'Find your profile', 'Submit removal request'] },
  { id: 'familytreenow',            name: 'FamilyTreeNow',             risk: 'low',    url: 'https://www.familytreenow.com/optout',                             steps: ['Visit familytreenow.com/optout', 'Search your record', 'Select and submit removal request'] },
]

const riskColors = {
  high:   { bg: '#FCEBEB', color: '#791F1F' },
  medium: { bg: '#FAEEDA', color: '#633806' },
  low:    { bg: '#EAF3DE', color: '#27500A' },
}

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
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>

      <button onClick={() => navigate('/dashboard')}
        style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
        ← Back to dashboard
      </button>

      <h1 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 6px' }}>Data broker removal</h1>
      <p style={{ fontSize: 13, color: '#6b6b67', margin: '0 0 20px' }}>
        These sites collect and sell your personal information. Remove yourself from each one.
      </p>

      {/* Reminder banner */}
      <div style={{ background: '#EEEDFE', border: '0.5px solid #AFA9EC', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#3C3489' }}>
        <strong>Set a reminder</strong> : data brokers re-add your info every 3-6 months. Come back and repeat this process twice a year.
      </div>

      {/* Email generator */}
      <div style={{ background: '#f5f4f0', borderRadius: 12, padding: '14px 18px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Removal email generator</div>
            <div style={{ fontSize: 12, color: '#6b6b67', marginTop: 2 }}>Generate a ready-to-send opt-out email for any broker</div>
          </div>
          <button onClick={() => setShowEmailForm(!showEmailForm)}
            style={{ padding: '7px 14px', borderRadius: 8, background: '#534AB7', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
            {showEmailForm ? 'Hide' : 'Generate email'}
          </button>
        </div>
        {showEmailForm && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              placeholder="Your full name"
              value={userInfo.name}
              onChange={e => setUserInfo(p => ({ ...p, name: e.target.value }))}
              style={{ padding: '8px 12px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none' }}
            />
            <input
              placeholder="Your email address"
              value={userInfo.email}
              onChange={e => setUserInfo(p => ({ ...p, email: e.target.value }))}
              style={{ padding: '8px 12px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none' }}
            />
            <p style={{ fontSize: 11, color: '#9e9e9a', margin: 0 }}>
              This info stays in your browser only — it is never sent to our servers.
            </p>
            {userInfo.name && userInfo.email && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {brokers.map(b => (
                  <button key={b.id} onClick={() => setEmailModal(b)}
                    style={{ padding: '5px 10px', borderRadius: 6, background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 12, cursor: 'pointer' }}>
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email modal */}
      {emailModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}
          onClick={() => setEmailModal(null)}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 24, maxWidth: 540, width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 500, fontSize: 15 }}>Removal email — {emailModal.name}</div>
              <button onClick={() => setEmailModal(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#6b6b67' }}>✕</button>
            </div>
            <div style={{ fontSize: 12, color: '#6b6b67', marginBottom: 6 }}>Subject: Personal Data Removal Request — {userInfo.name}</div>
            <textarea readOnly value={generateEmail(emailModal)}
              style={{ width: '100%', height: 220, padding: 12, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 12, fontFamily: 'monospace', resize: 'none', color: '#1a1a18' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => navigator.clipboard.writeText(generateEmail(emailModal))}
                style={{ flex: 1, padding: '9px', borderRadius: 8, background: '#1a1a18', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                Copy email
              </button>
              <button onClick={() => setEmailModal(null)}
                style={{ padding: '9px 16px', borderRadius: 8, background: 'transparent', color: '#6b6b67', border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 13, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
          <span style={{ fontWeight: 500 }}>{done} of {brokers.length} complete</span>
          <span style={{ color: '#6b6b67' }}>{pct}%</span>
        </div>
        <div style={{ height: 4, background: '#f0efeb', borderRadius: 2 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: '#534AB7', borderRadius: 2, transition: 'width .4s' }} />
        </div>
      </div>

      {/* Broker list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {brokers.map(b => (
          <div key={b.id} style={{ background: '#fff', border: `0.5px solid ${completed[b.id] ? '#97C459' : 'rgba(0,0,0,0.1)'}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
              <input type="checkbox" checked={!!completed[b.id]}
                onChange={e => { e.stopPropagation(); setCompleted(p => ({ ...p, [b.id]: e.target.checked })) }}
                onClick={e => e.stopPropagation()}
                style={{ width: 16, height: 16, flexShrink: 0, cursor: 'pointer' }} />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, fontSize: 14, textDecoration: completed[b.id] ? 'line-through' : 'none', color: completed[b.id] ? '#9e9e9a' : '#1a1a18' }}>
                  {b.name}
                </span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 9px', borderRadius: 20, background: riskColors[b.risk].bg, color: riskColors[b.risk].color }}>
                {b.risk}
              </span>
              <span style={{ fontSize: 12, color: '#9e9e9a' }}>{expanded === b.id ? '▲' : '▼'}</span>
            </div>

            {expanded === b.id && (
              <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '14px 16px 16px' }}>
                <ol style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                  {b.steps.map((step, i) => (
                    <li key={i} style={{ fontSize: 13, color: '#6b6b67' }}>{step}</li>
                  ))}
                </ol>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => window.open(b.url, '_blank')}
                    style={{ padding: '8px 16px', borderRadius: 8, background: '#1a1a18', color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                    Open opt-out page ↗
                  </button>
                  {userInfo.name && userInfo.email && (
                    <button onClick={() => setEmailModal(b)}
                      style={{ padding: '8px 16px', borderRadius: 8, background: 'transparent', color: '#534AB7', border: '0.5px solid #534AB7', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                      Generate email
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}