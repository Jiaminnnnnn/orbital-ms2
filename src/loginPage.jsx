  import { useState } from 'react'
  import { supabase } from './supabaseClient'
  import { Container, Heading, Text, Input, Button, Flex, Box, ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";

  const customTheme = extendTheme({
    fonts: {
      body: 'Georgia, sans-serif',
      heading: 'Georgia, serif',
    },
  });

  export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')

    const handleLogin = async (event) => {
      event.preventDefault()

      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email,
        options: {
          emailRedirectTo: 'https://example.com/welcome',
        },
      })

      if (error) {
        alert(error.error_description || error.message)
      } else {
        alert('Check your email for the login link!')
      }
      setLoading(false)
    }

    return (
      <ChakraProvider theme={customTheme}>
      <CSSReset />
        <Flex justifyContent="center" alignItems="center" height="100%">
            <Container>
              <Heading my="30px" color="blue.300">Stay The Course</Heading>
              <Flex flexDirection="column" alignItems="center">
                  <Text fontWeight="bold" marginBottom="10px" fontFamily="heading">Sign in via magic link with your email below</Text>
                </Flex>  
          <form className="form-widget" onSubmit={handleLogin}>
          <Box marginBottom="20px" width="100%">
            <div>
              <Input
                className="inputField"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            </Box>
            <div>
              <Button className={'button block'} disabled={loading}>
                {loading ? <span>Loading</span> : <span>Send magic link</span>}
              </Button>
            </div>
          </form>
          </Container>
          </Flex>
      </ChakraProvider>
    )
  }