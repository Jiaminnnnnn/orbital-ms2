import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
          <Route
            path="/"
            element={
              session ? (
                <Navigate to="/home" />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/home"
            element={
              session ? (
                <Home />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              session ? (
                <Profile onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

