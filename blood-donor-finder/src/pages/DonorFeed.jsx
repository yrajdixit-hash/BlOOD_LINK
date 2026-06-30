import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { distanceKm } from '../utils/distance'

const MAX_RADIUS_KM = 25

export default function DonorFeed() {
  const { uid } = useAuth()
  const [donor, setDonor] = useState(null)
  const [checkedProfile, setCheckedProfile] = useState(false)
  const [requests, setRequests] = useState([])
  const [respondedTo, setRespondedTo] = useState({})

  useEffect(() => {
    if (!uid) return
    getDoc(doc(db, 'users', uid)).then((snap) => {
      setDonor(snap.exists() ? snap.data() : null)
      setCheckedProfile(true)
    })
  }, [uid])

  useEffect(() => {
    if (!donor) return
    const q = query(
      collection(db, 'requests'),
      where('status', '==', 'active'),
      where('bloodType', '==', donor.bloodType)
    )
    const unsubscribe = onSnapshot(q, (snap) => {
      const nearby = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((r) => r.requesterId !== uid)
        .map((r) => ({
          ...r,
          distance: r.location
            ? distanceKm(donor.location.lat, donor.location.lng, r.location.lat, r.location.lng)
            : null,
        }))
        .filter((r) => r.distance === null || r.distance <= MAX_RADIUS_KM)
        .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0))
      setRequests(nearby)
    })
    return unsubscribe
  }, [donor, uid])

  async function respond(request, status) {
    await addDoc(collection(db, 'responses'), {
      requestId: request.id,
      donorId: uid,
      donorName: donor.name,
      donorPhone: donor.phone,
      distanceKm: request.distance,
      status,
      respondedAt: serverTimestamp(),
    })
    setRespondedTo((prev) => ({ ...prev, [request.id]: status }))
  }

  if (!checkedProfile) {
    return <p style={{ color: 'var(--color-text-muted)' }}>Loading…</p>
  }

  if (!donor) {
    return (
      <div>
        <p style={{ marginBottom: 14 }}>You'll need a donor profile to see nearby requests.</p>
        <Link to="/donor-signup" style={{ textDecoration: 'none' }}>
          <button className="btn-trust">Create donor profile</button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Nearby requests</h2>

      {requests.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)' }}>
          No active requests for {donor.bloodType} nearby right now.
        </p>
      )}

      {requests.map((r) => (
        <div className="card" key={r.id}>
          <div className="status-row">
            <strong>{r.bloodType} needed</strong>
            <span className="badge">{r.distance != null ? `${r.distance.toFixed(1)} km` : '—'}</span>
          </div>
          <p style={{ margin: '6px 0', color: 'var(--color-text-muted)', fontSize: 14 }}>
            {r.hospital} • {r.urgency}
          </p>
          {respondedTo[r.id] ? (
            <p style={{ fontSize: 13, fontWeight: 700 }}>
              You {respondedTo[r.id] === 'accepted' ? 'accepted' : 'declined'} this request.
            </p>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-urgent" onClick={() => respond(r, 'accepted')}>
                I can help
              </button>
              <button className="btn-ghost" onClick={() => respond(r, 'declined')}>
                Not now
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
