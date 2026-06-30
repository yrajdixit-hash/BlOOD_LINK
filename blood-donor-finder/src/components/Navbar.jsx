import { Link, useLocation } from 'react-router-dom'
import PulseLine from './PulseLine'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header style={{ padding: '20px 20px 0' }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ fontSize: 22 }}>BloodLink</h1>
      </Link>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, margin: '4px 0 12px' }}>
        Find a compatible donor, fast.
      </p>
      {pathname === '/' && <PulseLine />}
    </header>
  )
}
