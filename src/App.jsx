import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './LoginPage';
import Profile from './ProfilePage';
import HomePage from './HomePage';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Your session initialization code
  }, []);

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <Router>
        <Routes>
          <Route path="/" element={!session ? <Login /> : <HomePage />} />
          <Route path="/profile" element={session ? <Profile key={session.user.id} session={session} /> : <Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
