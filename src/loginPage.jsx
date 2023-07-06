import { useState } from 'react'
import { supabase } from './supabaseClient'
import { Container, Heading, Text, Input, Button, Flex, Box } from "@chakra-ui/react";

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
    <Container>
      <Heading my="30px" p="10px" color="blue.300">Stay The Course</Heading>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" minHeight="10vh">
        <Text fontWeight="bold" marginBottom="10px">Sign in via magic link with your email below</Text>
        <Box marginBottom="20px" width="30px">
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
  )
}
