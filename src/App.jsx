import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './loginPage';
import Profile from './profilePage';
import HomePage from './homePage';

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

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Login /> : <Profile key={session.user.id} session={session} />}
    </div>
  )
}

export default App
/*
  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <Router>
        <Routes>
          <Route path="/" element={!session ? <Login /> : <Home />} />
          <Route path="/profile" element={session ? <Profile key={session.user.id} session={session} /> : <Login />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
*/
