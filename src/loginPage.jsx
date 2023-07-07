import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { Container, Heading, Text, Input, Button, Flex, Box, ChakraProvider, extendTheme, CSSReset } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

      const customTheme = extendTheme({
        fonts: {
          body: 'Georgia, sans-serif',
          heading: 'Georgia, serif',
        },
      });

      export default function Login() {
        const [loading, setLoading] = useState(false)
        const [email, setEmail] = useState('')
        const navigate = useNavigate();
        const [isSent, setIsSent] = useState(false);

        const handleLogin = async (event) => {
          event.preventDefault()

          setLoading(true)
          const { error } = await supabase.auth.signInWithOtp({ email })

          if (error) {
            alert(error.error_description || error.message)
          } else {
            alert('Check your email for the login link!')
            navigate('/home')
          }
          setLoading(false)
        }
        
        return (
          <ChakraProvider theme={customTheme}>
          <CSSReset />
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Container>
                <Flex flexDirection="column" alignItems="center">
                  <Heading my="30px" color="blue.300">Stay The Course</Heading>
                      <Text fontWeight="bold" marginBottom="10px" fontFamily="heading">Sign in via magic link with your email below</Text> 
              <form className="form-widget" onSubmit={handleLogin} style={{ textAlign: 'center' }}>
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
              </Flex>
              </Container>
              </Flex>
          </ChakraProvider>
        )
      }