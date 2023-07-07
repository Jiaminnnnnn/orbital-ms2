import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './loginPage';
import Profile from './profilePage';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <ChakraProvider>
      <div className="container" style={{ padding: '50px 0 100px 0' }}>
        <Router>
          <Routes>
            <Route exact path="/">
              {!session ? <Login /> : <Profile key={session.user.id} session={session} />}
            </Route>
            <Route path="/profile">
              <Profile key={session?.user.id} session={session} />
            </Route>
          </Routes>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
