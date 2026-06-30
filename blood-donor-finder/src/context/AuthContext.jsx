import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { auth } from '../firebase'

// Anonymous auth gives every donor/requester a stable uid with zero login
// friction — good enough for a hackathon demo. Swap for phone/email auth
// later if you need donors to be verifiable across sessions/devices.
const AuthContext = createContext({ uid: null, loading: true })

export function AuthProvider({ children }) {
  const [uid, setUid] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid)
        setLoading(false)
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error('Anonymous sign-in failed', err)
          setLoading(false)
        })
      }
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ uid, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
