import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Flex, IconButton, Box, Container, Text } from '@chakra-ui/react';
import { ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';

const ProfileDetails = ({ label, value, isEditing, onChange }) => {
  if (isEditing) {
    return (
      <Box my={4} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" mb={2}>{label}</Text>
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </Box>
    );
  }

  return (
    <Box my={4} textAlign="center">
      <Text fontSize="lg" fontWeight="bold" mb={2}>{label}</Text>
      <Text>{value}</Text>
    </Box>
  );
};

export default function Profile({ session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [course_of_study, setCourseOfStudy] = useState(null);
  const [year_of_study, setYearOfStudy] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
    } else {
      setIsEditing(false);
    }
    setLoading(false);
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleCourseOfStudyChange = (event) => {
    setCourseOfStudy(event.target.value);
  };

  const handleYearOfStudyChange = (event) => {
    setYearOfStudy(event.target.value);
  };

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
          <Box my={4} textAlign="center">
            <Text fontSize="lg" fontWeight="bold" mb={2}>Profile Photo</Text>
            <Avatar
              url={avatar_url}
              size={150}
              onUpload={(event, url) => {
                setAvatarUrl(url);
                updateProfile(event);
              }}
            />
          </Box>
          <ProfileDetails
            label="Email"
            value={session.user.email}
            isEditing={false}
          />
          <ProfileDetails
            label="Username"
            value={username}
            isEditing={isEditing}
            onChange={handleUsernameChange}
          />
          <ProfileDetails
            label="Year of Study"
            value={year_of_study}
            isEditing={isEditing}
            onChange={handleYearOfStudyChange}
          />
          <ProfileDetails
            label="Course of Study"
            value={course_of_study}
            isEditing={isEditing}
            onChange={handleCourseOfStudyChange}
          />
          <Box my={4} textAlign="center">
            {isEditing ? (
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading ...' : 'Update'}
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
            {isEditing && (
              <IconButton
                aria-label="Save"
                icon={<CheckIcon />}
                onClick={() => setIsEditing(false)}
              />
            )}
          </Box>
          <Box my={4} textAlign="center">
            <Button onClick={() => supabase.auth.signOut()}>Log out</Button>
          </Box>
        </form>
      </Flex>
    </Container>
  );
}
