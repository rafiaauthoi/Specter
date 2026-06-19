import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ConnectAccounts from './pages/ConnectAccounts'
import GuidedRemoval from './pages/GuidedRemoval'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/connect" element={<ConnectAccounts />} />
      <Route path="/removal" element={<GuidedRemoval />} />
    </Routes>
  )
}