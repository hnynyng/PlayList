import { useContext } from 'react'
import { AuthContext, AuthProvider } from './AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function AppContent() {
  const { token } = useContext(AuthContext)

  return (
    <>
      {token ? (
        <Dashboard />
      ) : (
        <Login onLoginSuccess={() => {}} />
      )}
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
