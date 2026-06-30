import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="home-stack">
      <Link to="/request" style={{ textDecoration: 'none' }}>
        <button className="btn-urgent">I need blood urgently</button>
      </Link>
      <Link to="/donor-signup" style={{ textDecoration: 'none' }}>
        <button className="btn-trust">I want to be a donor</button>
      </Link>
      <Link to="/donor-feed" style={{ textDecoration: 'none' }}>
        <button className="btn-ghost">View nearby requests</button>
      </Link>
    </div>
  )
}
