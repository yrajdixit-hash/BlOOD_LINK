import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { getCurrentLocation } from '../utils/distance'
import { BLOOD_TYPES } from '../utils/bloodTypes'

const URGENCY_LEVELS = ['Critical — within the hour', 'Urgent — today', 'Soon — this week']

export default function RequestForm() {
  const { uid } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ bloodType: 'O+', hospital: '', urgency: URGENCY_LEVELS[0] })
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleUseLocation() {
    setLocating(true)
    setError('')
    try {
      setLocation(await getCurrentLocation())
    } catch {
      setError('Could not get your location. Check permissions and try again.')
    } finally {
      setLocating(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!uid) return
    if (!location) {
      setError('Share the location so donors know where to come.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const ref = await addDoc(collection(db, 'requests'), {
        requesterId: uid,
        bloodType: form.bloodType,
        hospital: form.hospital,
        urgency: form.urgency,
        location,
        status: 'active',
        createdAt: serverTimestamp(),
      })
      navigate(`/dashboard/${ref.id}`)
    } catch {
      setError('Could not post the request. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 16 }}>Request blood</h2>

      <div className="field">
        <label htmlFor="bloodType">Blood type needed</label>
        <select
          id="bloodType"
          value={form.bloodType}
          onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
        >
          {BLOOD_TYPES.map((bt) => (
            <option key={bt} value={bt}>
              {bt}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="hospital">Hospital or location name</label>
        <input
          id="hospital"
          required
          value={form.hospital}
          onChange={(e) => setForm({ ...form, hospital: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="urgency">Urgency</label>
        <select
          id="urgency"
          value={form.urgency}
          onChange={(e) => setForm({ ...form, urgency: e.target.value })}
        >
          {URGENCY_LEVELS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Location</label>
        <button type="button" className="btn-ghost" onClick={handleUseLocation} disabled={locating}>
          {location ? 'Location captured' : locating ? 'Locating…' : 'Use my current location'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--color-urgent)', fontSize: 13 }}>{error}</p>}

      <button className="btn-urgent" type="submit" disabled={submitting}>
        {submitting ? 'Posting…' : 'Post request and find donors'}
      </button>
    </form>
  )
}
