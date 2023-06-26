import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jktiyufbqkbomnsychbf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdGl5dWZicWtib21uc3ljaGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY5NzM4NDcsImV4cCI6MjAwMjU0OTg0N30.Pd6CPCGtJsRRZCnOlY9-VrVE_y6aYZP7_LNPsBqBris'
);

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <div>
          <Link to="/profile">Profile</Link>
        </div>
      ) : (
        <div>
          <h3>Sign In to Continue</h3>
          <p>You need to sign in to access the home page.</p>
          <button onClick={() => navigate('/login')}>Sign In</button>
        </div>
      )}
    </div>
  );
}

export default Home;
