import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5000/health')
      .then(res => res.json())
      .then(data => setApiStatus(data.status))
      .catch(err => console.error('API not running:', err))
  }, [])

  return (
    <div className="App">
      <h1>🎵 Playlist</h1>
      <p>Music Streaming App</p>
      <p>API Status: {apiStatus ? '✅ Connected' : '❌ Not running'}</p>
      <div className="placeholder">
        <h2>Coming Soon</h2>
        <p>Home Dashboard • Playlists • Upload • Player</p>
      </div>
    </div>
  )
}

export default App
