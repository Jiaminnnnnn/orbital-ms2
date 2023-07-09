import React, { useEffect, useState } from 'react';
import { Button, VStack, Heading, Text, Flex, Box, useColorModeValue, ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      },
    },
  },
  colors: {
    blue: {
      300: '#3B82F6',
    }
  },
  fonts: {
    body: 'Georgia, sans-serif',
    heading: 'Comic Sans MS, Comic Sans MS',
  },
});

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const colorScheme = useColorModeValue('blue', 'gray');

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
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Flex alignItems="center" justifyContent="center" minH="100vh" position="fixed" width="100%" bg="lightblue">
        <Box w={["90%", "80%", "60%", "40%"]} boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md">
          <VStack spacing={6} p={8} boxShadow="lg" borderRadius="md" backgroundColor={useColorModeValue('whiteAlpha.900', 'gray.700')}>
          <Heading as="h2" size="xl" marginBottom={5} color="blue.300" fontFamily="heading" textAlign="center">
              Home Page
            </Heading>
            {user ? (
              <VStack spacing={4} align="stretch">
                <Button as={RouterLink} to="/profile" colorScheme={colorScheme}>
                  Profile
                </Button>
                <Button colorScheme={colorScheme} onClick={() => navigate('/gateway')}>
                  Find/Apply Tutor
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Heading as="h4" size="md" color="blue.300" fontFamily="heading">Sign In to Continue</Heading>
                <Text fontFamily="body">You need to sign in to access the home page.</Text>
                <Button colorScheme={colorScheme} onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </VStack>
            )}
          </VStack>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default Home;
