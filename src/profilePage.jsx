import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Flex, IconButton, Box, Container } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

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
    <Container centerContent minHeight="100vh">
      <Flex direction="column" alignItems="center" justify="center">
        <IconButton
          position="absolute"
          top="1rem"
          left="1rem"
          aria-label="Back"
          size='lg'
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        />
        <form onSubmit={updateProfile} className="form-widget">
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(event, url) => {
              setAvatarUrl(url);
              updateProfile(event);
            }}
          />
          <Box my={4} textAlign="center">
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
          </Box>
          <Box my={4} textAlign="center">
            <label htmlFor="username">Name</label>
            <input
              id="username"
              type="text"
              required
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>
          <Box my={4} textAlign="center">
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
          </Box>
          <Box my={4} textAlign="center">
            <label htmlFor="course_of_study">Course Of Study</label>
            <input
              id="course_of_study"
              type="text"
              required
              value={course_of_study || ''}
              onChange={(e) => setCourseOfStudy(e.target.value)}
            />
          </Box>
          <Box my={4} textAlign="center">
            <Button type="submit" disabled={loading}>
              {loading ? 'Loading ...' : 'Update'}
            </Button>
          </Box>
          <Box my={4} textAlign="center">
            <Button onClick={() => supabase.auth.signOut()}>Log out</Button>
          </Box>
        </form>
      </Flex>
    </Container>
  );
}
