import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './loginPage'
import Profile from './profilePage'

function App() {
  const [session, setSession] = useState(null)

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