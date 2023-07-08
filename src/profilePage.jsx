import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Avatar from './Avatar';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Flex, IconButton, Box, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const ProfileDetails = ({ label, value, isEditing, onChange }) => {
  if (isEditing) {
    return (
      <Box my={4} textAlign="center">
        <Text fontSize="lg" fontWeight="bold">{label}</Text>
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
      <Text fontSize="lg" fontWeight="bold">{label}</Text>
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
    <Flex height="100vh" width="100vw" justifyContent="center" bg="lightblue">
      <Flex position="absolute" top={0} left={0} right={0} bottom={0} justifyContent="center" alignItems="center" bg="lightblue">
        <IconButton
          position="absolute"
          top="1rem"
          left="1rem"
          size="lg"
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        />
        <Flex direction="column" alignItems="center" justify="center">
          <form onSubmit={updateProfile} className="form-widget">
            <ProfileDetails
              label="Profile Photo"
            />
            <Avatar
              url={avatar_url}
              size={80}
              onUpload={(event, url) => {
                setAvatarUrl(url);
                updateProfile(event);
              }}
              showUploadButton={isEditing}
            />
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
              label="Course of Study"
              value={course_of_study}
              isEditing={isEditing}
              onChange={handleCourseOfStudyChange}
            />
            <Box my={4} textAlign="center">
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Year of Study
              </Text>
              {isEditing ? (
                <Select
                  id="year_of_study"
                  value={year_of_study}
                  onChange={handleYearOfStudyChange}
                  size="md"
                  maxH={200}
                  overflowY="auto"
                >
                  <option value="">Select Year of Study</option>
                  <option value="Year 1">Year 1</option>
                  <option value="Year 2">Year 2</option>
                  <option value="Year 3">Year 3</option>
                  <option value="Year 4">Year 4</option>
                  <option value="Year 5">Year 5</option>
                  <option value="Graduated">Graduated</option>
                </Select>
              ) : (
                <Text>{year_of_study}</Text>
              )}
            </Box>
            <Box my={4} textAlign="center">
              {isEditing ? (
                <Box>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Loading ...' : 'Update'}
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </Box>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit</Button>
              )}
            </Box>
            <Box my={4} textAlign="center">
              <Button onClick={() => supabase.auth.signOut()}>Log out</Button>
            </Box>
          </form>
        </Flex>
      </Flex>
    </Flex>
  );
}
