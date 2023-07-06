import { useState } from 'react'
import { supabase } from './supabaseClient'
import { Container, Heading, Text, Input, Button, Flex, Box, ChakraProvider, extendTheme, withDefaultColorScheme} from "@chakra-ui/react";

const customTheme = extendTheme({
  colors: {
    primary: {
      50: '#f7fafc',
      100: '#edf2f7',
      500: '#3182ce', 
      900: '#1a365d',
    },
  },
  fonts: {
    body: 'Georgia, sans-serif',
    heading: 'Georgia, serif',
  },
});


export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Check your email for the login link!')
    }
    setLoading(false)
  }

  return (
    <ChakraProvider theme={customTheme}>
      <Container>
        <Heading my="30px" p="10px" color="blue.300">Stay The Course</Heading>
        <Flex flexDirection="column" alignItems="center" justifyContent="center" minHeight="10vh">
          <Text fontWeight="bold" marginBottom="10px" fontFamily="heading">Sign in via magic link with your email below</Text>
          <Box marginBottom="20px" width="300px">
            <Input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Box>
          <Button
            className="button block"
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Send magic link</span>}
          </Button>
        </Flex>
      </Container>
    </ChakraProvider>
  )
}
