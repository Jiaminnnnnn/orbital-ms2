import React, { useEffect, useState } from 'react';
import { Button, VStack, Heading, Text, Flex, Box, useColorModeValue } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const colorScheme = useColorModeValue('green', 'gray');

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
    <Flex alignItems="center" justifyContent="center" minH="100vh">
      <Box w={["90%", "80%", "60%", "40%"]}>
        <VStack spacing={6} p={8} boxShadow="lg" borderRadius="md" backgroundColor={useColorModeValue('gray.100', 'gray.700')}>
          <Heading as="h2" size="xl">
            Home Page
          </Heading>
          {user ? (
            <VStack spacing={4} align="stretch">
              <Link to="/profile">Profile</Link>
              <Button colorScheme={colorScheme} onClick={() => navigate('/gateway')}>
                Find/Apply Tutor
              </Button>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              <Heading as="h4" size="md">Sign In to Continue</Heading>
              <Text>You need to sign in to access the home page.</Text>
              <Button colorScheme={colorScheme} onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}

export default Home;
