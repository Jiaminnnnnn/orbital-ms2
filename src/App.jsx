import './App.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './loginPage';
import Profile from './profilePage';
import Home from './homePage';

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
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <Router>
        <Routes>
          <Route exact path="/">
            {!session ? <Login /> : <Home />}
          </Route>
          <Route path="/profile">
            {session ? <Profile key={session.user.id} session={session} /> : <Login />}
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
