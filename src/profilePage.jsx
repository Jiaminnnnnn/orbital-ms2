import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Flex, IconButton, Box, Container, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const ProfileDetails = ({ email, username, yearOfStudy, courseOfStudy }) => {
  return (
    <Box my={4} textAlign="center">
      <Text fontSize="lg" fontWeight="bold" mb={2}>Email</Text>
      <Text>{email}</Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>Username</Text>
      <Text>{username}</Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>Year of Study</Text>
      <Text>{yearOfStudy}</Text>
      <Text fontSize="lg" fontWeight="bold" mb={2}>Course of Study</Text>
      <Text>{courseOfStudy}</Text>
    </Box>
  );
};

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
          size="lg"
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        />
        <form onSubmit={updateProfile} className="form-widget">
          <Text>Profile Photo</Text>
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(event, url) => {
              setAvatarUrl(url);
              updateProfile(event);
            }}
          />
          <ProfileDetails
            email={session.user.email}
            username={username}
            yearOfStudy={year_of_study}
            courseOfStudy={course_of_study}
          />
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
