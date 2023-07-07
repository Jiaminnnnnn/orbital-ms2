import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { Select, Button, FormControl, FormLabel, Input, Flex, Box } from '@chakra-ui/react';

export default function Profile({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [course_of_study, setCourseOfStudy] = useState(null);
  const [year_of_study, setYearOfStudy] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      let { data, error } = await supabase
        .from('profiles')
        .select(`username, course_of_study, year_of_study, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn(error);
      } else if (data) {
        setUsername(data.username);
        setCourseOfStudy(data.course_of_study);
        setYearOfStudy(data.year_of_study);
        setAvatarUrl(data.avatar_url);
      }

      setLoading(false);
    }

    getProfile();
  }, [session]);

  async function updateProfile(event) {
    event.preventDefault();

    setLoading(true);
    const { user } = session;

    const updates = {
      id: user.id,
      username,
      course_of_study,
      year_of_study,
      avatar_url,
      updated_at: new Date(),
    };

    let { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={updateProfile} className="form-widget"> 
     <Avatar
      url={avatar_url}
      size={150}
      onUpload={(event, url) => {
        setAvatarUrl(url)
        updateProfile(event)
      }}
    />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Name</label>
        <input
          id="username"
          type="text"
          required
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="year_of_study">Year Of Study</label>
        <Select
          id="year_of_study"
          type="text"
          required
          value={year_of_study || ''}
          onChange={(e) => setYearOfStudy(e.target.value)}
        >
          <option value="">Select Year of Study</option>
          <option value="Year 1">Year 1</option>
          <option value="Year 2">Year 2</option>
          <option value="Year 3">Year 3</option>
        </Select>
      </div>
      <div>
        <label htmlFor="course_of_study">Course Of Study</label>
        <input
          id="course_of_study"
          type="text"
          required
          value={course_of_study || ''}
          onChange={(e) => setCourseOfStudy(e.target.value)}
        />
      </div>
      <div>
        <Button className="button block primary" type="submit" disabled={loading}>
          {loading ? 'Loading ...' : 'Update'}
        </Button>
      </div>
      <div>
        <Button className="button block" onClick={() => supabase.auth.signOut()}>
          Log out
        </Button>
      </div>
      <div>
        <Button className="button block" onClick={() => navigate('/home')}>
          Back
        </Button>
      </div>
    </form>
  );
}
