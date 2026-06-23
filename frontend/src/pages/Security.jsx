import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Security() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px', fontFamily: 'system-ui, sans-serif' }}>
      <button onClick={() => navigate(-1)}
        style={{ background: 'none', border: 'none', color: '#6b6b67', fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: 0 }}>
        Back
      </button>

      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 4 }}>Security</h1>
      <p style={{ fontSize: 12, color: '#9e9e9a', marginBottom: 8 }}>Last updated: June 2026</p>
      <p style={{ fontSize: 13, color: '#6b6b67', marginBottom: 32, lineHeight: 1.7 }}>
        Clearprint was built with security as a core requirement, not an afterthought. This page documents the specific technical controls in place.
      </p>

      {[
        {
          title: 'Authentication',
          body: 'User authentication is handled by Supabase Auth, which uses bcrypt for password hashing. Passwords are never stored by Clearprint directly. Sessions are managed using short-lived JWTs issued by Supabase. Email confirmation is required for all new accounts, enforced via SMTP through Resend.'
        },
        {
          title: 'OAuth token handling',
          body: 'When you connect a third-party account such as Google, Clearprint receives an OAuth access token and refresh token. Both tokens are encrypted using AES-256 (via the Fernet symmetric encryption scheme) before being written to the database. The encryption key is derived from a server-side secret that is never committed to version control or exposed in any API response.'
        },
        {
          title: 'Minimum OAuth scopes',
          body: 'Clearprint requests only the minimum OAuth scopes necessary to perform each function. For Google, we request gmail.modify (required to read and label emails) and userinfo.email (required to identify the account). We do not request access to Google Drive, Contacts, Calendar, or any other Google service.'
        },
        {
          title: 'Token logging policy',
          body: 'OAuth tokens, session tokens, and API keys are never written to application logs, error messages, or any monitoring output. All log statements are reviewed to ensure no credential values are included. Errors returned to the frontend contain only safe, generic messages.'
        },
        {
          title: 'Data in transit',
          body: 'All communication between the frontend and backend uses HTTPS in production. The backend enforces CORS, allowing requests only from the registered frontend origin. HTTP is only permitted on localhost during local development.'
        },
        {
          title: 'Data at rest',
          body: 'The database is hosted on Supabase Postgres, which encrypts data at rest by default. OAuth tokens stored in the connected_accounts table receive an additional layer of application-level encryption before being written, so even a database-level breach would not expose usable tokens.'
        },
        {
          title: 'Secret management',
          body: 'All secrets including database credentials, OAuth client secrets, and API keys are stored in environment variables and never committed to version control. The repository includes a .gitignore that explicitly excludes all .env files. Secrets are rotated immediately if accidental exposure occurs.'
        },
        {
          title: 'Dependency management',
          body: 'Backend Python dependencies are pinned in requirements and installed into an isolated virtual environment. Frontend dependencies are managed via npm. Neither the frontend nor backend loads third-party scripts at runtime that could introduce supply chain risk.'
        },
        {
          title: 'Responsible disclosure',
          body: 'If you discover a security vulnerability in Clearprint, please report it responsibly by emailing security@clearprint.app. Note that until a custom domain is configured, this address may not be active. We will acknowledge reports within 72 hours and aim to remediate confirmed issues promptly.'
        },
      ].map(s => (
        <div key={s.title} style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{s.title}</h2>
          <p style={{ fontSize: 13, color: '#4a4a47', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
        </div>
      ))}

      <Footer />
    </div>
  )
}