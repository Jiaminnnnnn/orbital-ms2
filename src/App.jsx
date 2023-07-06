import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './loginPage'
import Profile from './profilePage'
import { ChakraProvider } from '@chakra-ui/react'

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
    <ChakraProvider>
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!session ? <Login /> : <Profile key={session.user.id} session={session} />}
    </div>
    </ChakraProvider>
  )
}

export default App