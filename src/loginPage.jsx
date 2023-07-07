import { useState } from 'react';
import { Container, Heading, Text, Input, Button, Flex, Box, ChakraProvider, extendTheme, Stack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
 

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: 'blue.300'
      },
    },
  },
  fonts: {
    body: 'Georgia, sans-serif',
    heading: 'Georgia, serif',
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
      <Flex height="100vh" alignItems="center" justifyContent="center">
        <Stack boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md">
          <Container maxW="sm">
            <Heading my="30px" color="blue.300">
              Stay The Course
            </Heading>
            <Flex flexDirection="column" alignItems="center">
              <Text color='gray' marginBottom="10px" fontFamily="heading">
                Sign in via magic link with your email below
              </Text>
            </Flex>
            <form onSubmit={handleLogin} style={{ textAlign: 'center' }}>
              <Box marginBottom="20px">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <Button type="submit" disabled={loading}>
                {loading ? 'Loading' : 'Send magic link'}
              </Button>
            </form>
          </Container>
        </Stack>
      </Flex>
    </ChakraProvider>
  );
}
