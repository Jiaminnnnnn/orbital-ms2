import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Select, Button, Flex, IconButton, Box, Container, Text } from '@chakra-ui/react';
import { ArrowBackIcon, AttachmentIcon } from '@chakra-ui/icons';

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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      setLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(fileName, file);

        if (error) {
          throw error;
        }

        const avatarUrl = data?.Key;

        setAvatarUrl(avatarUrl);
      } catch (error) {
        console.error('Error uploading avatar:', error.message);
        alert('Error uploading avatar. Please try again.');
      }

      setLoading(false);
    }
  };

  return (
    <Container centerContent minHeight="100vh">
      <Flex direction="column" alignItems="center" justify="center">
        <IconButton
          position="absolute"
          top="1rem"
          left="1rem"
          aria-label="Back"
          size='25px'
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        />
        <form onSubmit={updateProfile} className="form-widget">
          <Box my={4} textAlign="center">
            <label htmlFor="avatar-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box
                as="span"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                width="150px"
                height="150px"
                borderRadius="50%"
                bg="gray.200"
                overflow="hidden"
                cursor="pointer"
              >
                {avatar_url ? (
                  <img src={avatar_url} alt="Avatar" width="100%" height="100%" />
                ) : (
                  <Box as={AttachmentIcon} boxSize={10} color="gray.400" />
                )}
              </Box>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
          </Box>
          <Box my={4} textAlign="center">
            <Text fontSize="lg" fontWeight="bold" mb={2}>Email</Text>
            <input id="email" type="text" value={session.user.email} disabled />
          </Box>
          <Box my={4} textAlign="center">
            <Text fontSize="lg" fontWeight="bold" mb={2}>User Name</Text>
            <input
              id="username"
              type="text"
              required
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>
          <Box my={4} textAlign="center">
            <Text fontSize="lg" fontWeight="bold" mb={2}>Year Of Study</Text>
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
            <Text fontSize="lg" fontWeight="bold" mb={2}>Course Of Study</Text>
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
