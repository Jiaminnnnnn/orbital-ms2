import { useState } from 'react'
import { supabase } from './supabaseClient'
import { Container, Heading, Text } from "@chakra-ui/react";

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
      <Heading my="30px" p="10px">Stay The Course</Heading>
      <Text marginLeft="30px" color="blue.300" fontweight="bold">Sign in via magic link with your email below</Text>
    /*
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Stay The Course</h1>
        <p className="description">Sign in via magic link with your email below</p>
        */
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button className={'button block'} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
    </Container>
  )
}