import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function RequesterDashboard() {
  const { requestId } = useParams()
  const [responses, setResponses] = useState([])

  useEffect(() => {
    const q = query(
      collection(db, 'responses'),
      where('requestId', '==', requestId),
      where('status', '==', 'accepted')
    )
    const unsubscribe = onSnapshot(q, (snap) => {
      setResponses(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return unsubscribe
  }, [requestId])

  return (
    <div>
      <h2 style={{ marginBottom: 8 }}>Donors responding</h2>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 16 }}>
        This list updates live as donors accept.
      </p>

      {responses.length === 0 && (
        <div className="card status-row">
          <span style={{ fontSize: 14 }}>Waiting for donors</span>
          <span
            className="pulse-dot"
            style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-trust)' }}
          />
        </div>
      )}

      {responses.map((r) => (
        <div className="card" key={r.id}>
          <div className="status-row">
            <strong>{r.donorName}</strong>
            <span className="badge">{r.distanceKm != null ? `${r.distanceKm.toFixed(1)} km` : 'Nearby'}</span>
          </div>
          <a href={`tel:${r.donorPhone}`} style={{ textDecoration: 'none' }}>
            <button className="btn-trust" style={{ marginTop: 10 }}>
              Call {r.donorName}
            </button>
          </a>
        </div>
      ))}
    </div>
  )
}
