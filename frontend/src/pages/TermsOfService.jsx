import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function TermsOfService() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <nav className="navbar">
        <span className="navbar-logo">clearprint</span>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Back
        </button>
      </nav>

      <div className="page">
        <h1 className="section-title">Terms of Service</h1>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 32 }}>Last updated: June 2026</p>

        {[
          {
            title: '1. Acceptance of terms',
            body: 'By creating an account or using Clearprint, you agree to these Terms of Service. If you do not agree, do not use the service. These terms apply to all users of Clearprint.'
          },
          {
            title: '2. Description of service',
            body: 'Clearprint is a tool that helps you identify and remove your digital footprint across connected platforms and data broker websites. The service includes Gmail scanning, guided data broker removal, and account connection management. Some features require connecting third-party accounts via OAuth.'
          },
          {
            title: '3. Your account',
            body: 'You are responsible for maintaining the security of your account credentials. You must provide a valid email address to create an account. You may not share your account with others or use the service on behalf of another person without their explicit consent. You must be at least 13 years old to use Clearprint.'
          },
          {
            title: '4. Acceptable use',
            body: 'You agree to use Clearprint only for its intended purpose of managing your own digital footprint. You may not use the service to access, scan, or delete data belonging to another person. You may not attempt to reverse engineer, scrape, or abuse the service or its underlying APIs.'
          },
          {
            title: '5. Third-party platforms',
            body: 'When you connect a third-party account such as Google, you authorize Clearprint to act on your behalf within the scope of the permissions you grant. Clearprint is not responsible for changes to third-party APIs, rate limits imposed by those platforms, or any data that cannot be deleted due to platform restrictions.'
          },
          {
            title: '6. Data broker removal',
            body: 'The guided removal feature provides instructions and direct links to opt-out pages for data broker websites. Clearprint does not guarantee that any data broker will honor your removal request, process it within a specific timeframe, or refrain from re-adding your information in the future. Results vary by broker and by jurisdiction.'
          },
          {
            title: '7. Limitation of liability',
            body: 'Clearprint is provided as-is for educational and personal use. We make no warranties about the completeness or accuracy of scan results. We are not liable for any data loss, failed deletions, or consequences arising from the use of this service. Use Clearprint at your own discretion.'
          },
          {
            title: '8. Service availability',
            body: 'Clearprint is a student project hosted on free-tier infrastructure. We do not guarantee uptime, availability, or uninterrupted access. The service may be paused, updated, or discontinued at any time without notice.'
          },
          {
            title: '9. Changes to these terms',
            body: 'We may update these terms at any time. Continued use of the service after changes are posted constitutes acceptance of the updated terms. The date at the top of this page reflects when the terms were last revised.'
          },
          {
            title: '10. Contact',
            body: 'For questions about these terms, contact us at legal@clearprint.app. Note that until a custom domain is configured, this address may not be active. Please check the site for current contact information.'
          },
        ].map(s => (
          <div key={s.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--pink)', marginBottom: 8 }}>{s.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
          </div>
        ))}

        <Footer />
      </div>
    </div>
  )
}