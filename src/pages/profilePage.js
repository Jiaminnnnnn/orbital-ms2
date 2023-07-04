import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://jktiyufbqkbomnsychbf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdGl5dWZicWtib21uc3ljaGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY5NzM4NDcsImV4cCI6MjAwMjU0OTg0N30.Pd6CPCGtJsRRZCnOlY9-VrVE_y6aYZP7_LNPsBqBris'
);

async function createAccessPolicy() {
  const user = supabase.auth.getUser();
  if (!user) {
    console.error('User not authenticated');
    return;
  }

  const { data, error } = await supabase.rpc('create_access_policy', {
    table_name: 'users',
    role_name: 'authenticated',
    using_expression: `auth.email() = '${user.email}'`,
    check_expression: 'true',
    set_expression: 'username, gender, course_of_study, year_of_study',
    update_expression: 'username, gender, course_of_study, year_of_study',
  });

  if (error) {
    console.error('Error creating access policy:', error.message);
    return;
  }

  console.log('Access policy created successfully:', data);
}

const genderOptions = ['Male', 'Female'];
const yearOfStudyOptions = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Graduated'];

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');
  const [courseOfStudy, setCourseOfStudy] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [isEditing, setIsEditing] = useState(true);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResponse = await supabase.auth.getUser();
        const user = userResponse.data.user
        if (user) {
          const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', user.email);

          if (error) {
            throw new Error(error.message);
          }

          if (profile.length > 0) {
            setUsername(profile[0].username);
            setGender(profile[0].gender || '');
            setCourseOfStudy(profile[0]['course_of_study'] || '');
            setYearOfStudy(profile[0].year_of_study || '');
          } else {
            // No profile found, set default values
            setUsername(user.email);
            setYearOfStudy(yearOfStudyOptions[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const userResponse = await supabase.auth.getUser();
      const user = userResponse.data.user
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      console.log(user)

      const { data, error } = await supabase
        .from('users')
        .insert({
          username,
          gender,
          email: user.email,
          course_of_study: courseOfStudy,
          year_of_study: yearOfStudy,
        })
        .eq('email', user.email);

      if (error) {
        throw new Error(error.message);
      }

      console.log('User information updated successfully:', data);
      setIsEditing(false); // Disable editing mode after saving user information
    } catch (error) {
      console.error('Failed to update user information:', error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/'); // Redirect to the login page
    } catch (error) {
      console.error('Failed to logout:', error.message);
    }
  };

  useEffect(() => {
    const user = supabase.auth.getUser();
    if (!user) {
      navigate('/'); // Redirect to the login page if the user is not authenticated
    } else {
      // Call createAccessPolicy to create the access policy when the component mounts
      // createAccessPolicy();
    }
  }, [navigate]);

  return (
    <div>
      <h1>Profile Page</h1>
      <button onClick={handleLogout}>Logout</button>
      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="username">User Name:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            {genderOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <label htmlFor="courseOfStudy">Course of Study:</label>
          <input
            type="text"
            id="courseOfStudy"
            value={courseOfStudy || ''}
            onChange={(e) => setCourseOfStudy(e.target.value)}
          />

          <label htmlFor="year_of_study">Year of Study:</label>
          <select
            type="text"
            id="year_of_study"
            value={yearOfStudy || ''}
            onChange={(e) => {
              const selectedYearOfStudy = yearOfStudyOptions.find(
                (option) => option === e.target.value
              );
              setYearOfStudy(selectedYearOfStudy || '');
            }}
          >
            {yearOfStudyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button type="submit">Save</button>
        </form>
      ) : (
        <div>
          <h2>Profile Information</h2>
          <p>User Name: {username}</p>
          <p>Gender: {gender}</p>
          <p>Course of Study: {courseOfStudy}</p>
          <p>Year of Study: {yearOfStudy}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
