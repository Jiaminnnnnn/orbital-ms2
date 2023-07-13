import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/loginPage';
import Home from './pages/homePage';
import Profile from './pages/profilePage';
import ApplicationForm from './pages/applicationform';
import ViewApplications from './pages/viewapplicationpage';
import TutorGateway from './pages/TutorGateway';
import ApplicationDetail from './pages/ApplicationDetail';
import EditApplication from './pages/EditApplication';
import NotificationPage from './pages/notificationPage';
import { supabase } from './supabaseClient';

function App() {
  const [session, setSession] = useState(supabase.auth.getSession());
  const [user, setUser] = useState(supabase.auth.getUser());

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(supabase.auth.getUser());
    });
    
    return () => {
      if (authListener) authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={session ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/home"
            element={session ? <Home /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={session ? <Profile session={session} /> : <Navigate to="/" />}
          />
          <Route
            path="/apply"
            element={session ? <ApplicationForm /> : <Navigate to="/" />}
          />
          <Route
            path="/applications"
            element={session ? <ViewApplications /> : <Navigate to="/" />}
          />
          <Route
            path="/gateway"
            element={session ? <TutorGateway /> : <Navigate to="/" />}
          />
          <Route
            path="/application/:id"
            element={session ? <ApplicationDetail user={user} /> : <Navigate to="/" />}
          />
          <Route
            path="/application/edit/:id"
            element={session ? <EditApplication /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={session ? <NotificationPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
