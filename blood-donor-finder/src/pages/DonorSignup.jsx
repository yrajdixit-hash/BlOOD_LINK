import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { getCurrentLocation } from '../utils/distance'
import { BLOOD_TYPES } from '../utils/bloodTypes'

export default function DonorSignup() {
  const { uid } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', bloodType: 'O+' })
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [saving, setSaving] = useState(false)
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
      setError('Share your location so nearby requests can find you.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await setDoc(doc(db, 'users', uid), {
        name: form.name,
        phone: form.phone,
        bloodType: form.bloodType,
        location,
        isAvailable: true,
        updatedAt: serverTimestamp(),
      })
      navigate('/donor-feed')
    } catch {
      setError('Something went wrong saving your profile. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: 16 }}>Become a donor</h2>

      <div className="field">
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input
          id="phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="bloodType">Blood type</label>
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
        <label>Location</label>
        <button type="button" className="btn-ghost" onClick={handleUseLocation} disabled={locating}>
          {location ? 'Location captured' : locating ? 'Locating…' : 'Use my current location'}
        </button>
      </div>

      {error && <p style={{ color: 'var(--color-urgent)', fontSize: 13 }}>{error}</p>}

      <button className="btn-trust" type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save and start receiving requests'}
      </button>
    </form>
  )
}
