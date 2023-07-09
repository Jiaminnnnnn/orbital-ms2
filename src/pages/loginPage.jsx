import { useState } from 'react';
import { Container, Heading, Text, Input, Button, Flex, Box, ChakraProvider, extendTheme, Stack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const customTheme = extendTheme({
  fonts: {
    body: 'Georgia, sans-serif',
    heading: 'Comic Sans MS, Comic Sans MS',
  },
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert('Check your email for the login link!');
      navigate('/home');
    }
    setLoading(false);
  };

  return (
    <ChakraProvider theme={customTheme}>
      <Flex height="100%" width="100%" position="fixed" alignItems="center" justifyContent="center" bg="lightblue">
        <Stack
          boxShadow="md"
          bg="whiteAlpha.900"
          p="20"
          rounded="md"
          justifyContent="center"
          alignItems="center"
        >
          <Container maxW="sm">
            <Heading my="30px" color="blue.300" fontFamily="heading">
              Stay The Course
            </Heading>
            <Flex flexDirection="column" alignItems="center">
              <Text marginBottom="10px" fontFamily="body">
                Sign in via magic link with your email below
              </Text>
            </Flex>
            <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
              <Box marginBottom="20px" borderColor="blue.300">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <Button type="submit" disabled={loading} fontWeight="light" fontSize='15px' colorScheme="blue">
                {loading ? 'Loading' : 'Send magic link'}
              </Button>
            </form>
          </Container>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}
