import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './loginPage';
import Profile from './profilePage';
import Home from './homePage';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const handleLoginSuccess = () => {
    setSession(true);
  };

  const handleLogout = () => {
    setSession(null);
  };

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/home" element={<HomePage session={session} />} />
          <Route path="/profile" element={<Profile session={session} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App
