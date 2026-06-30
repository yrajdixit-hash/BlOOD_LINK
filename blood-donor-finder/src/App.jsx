import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DonorSignup from './pages/DonorSignup'
import RequestForm from './pages/RequestForm'
import DonorFeed from './pages/DonorFeed'
import RequesterDashboard from './pages/RequesterDashboard'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <div className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/donor-signup" element={<DonorSignup />} />
              <Route path="/request" element={<RequestForm />} />
              <Route path="/donor-feed" element={<DonorFeed />} />
              <Route path="/dashboard/:requestId" element={<RequesterDashboard />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
