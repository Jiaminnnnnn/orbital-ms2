import React, { useState } from 'react';
import { VStack, Input, Textarea, Button, IconButton, Box, Flex, Heading, useToast, ChakraProvider, extendTheme, CSSReset, useColorModeValue } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "lightblue",
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

const ApplicationForm = () => {
    const [name, setName] = useState('');
    const [module, setModule] = useState('');
    const [bio, setBio] = useState('');
    const [year, setYear] = useState('');
    const [contact_email, setContact_email] = useState('');
    const [cost, setCost] = useState('');
    const colorScheme = useColorModeValue('blue', 'gray');
    const navigate = useNavigate(); // hook for navigation
    const toast = useToast(); // hook for showing toast notifications
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const {data: { session },} = await supabase.auth.getSession();
        
    
        const { data, error } = await supabase
            .from('tutor_applications')
            .insert([
                { 
                    uuid: session ? session.user.id : null,
                    name: name, 
                    module: module, 
                    bio: bio, 
                    year: year,
                    contact_email: contact_email,
                    cost: cost,
                },
            ]);
    
        if (error) {
            console.error('Error submitting application', error);
        } else {
            console.log('Successfully submitted application', data);
            toast({
                title: "Application submitted.",
                description: "We've received your application.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            navigate('/home'); // after successful submission, redirect to homepage
        }
    }

// ... rest of your code ...

return (
    <ChakraProvider theme={customTheme}>
        <CSSReset />
        <Flex alignItems="center" justifyContent="center" height="100vh"  width="100%" bg="lightblue">
            <IconButton
                position="absolute"
                top="1rem"
                left="1rem"
                size="lg"
                aria-label="Back"
                icon={<ArrowBackIcon />}
                onClick={() => navigate('/home')}
            />
            <Box w={["90%", "80%", "60%", "40%"]} boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md">
                <Heading as="h2" size="xl" marginBottom={5} color="blue.300" fontFamily="heading" textAlign='center'>
                    Application Form
                </Heading>
                <form onSubmit={handleSubmit}>
                    <Input
                        placeholder="Name"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Module"
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
                    />
                    <Textarea 
                        placeholder="Other details"
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                    />
                    <Input
                        placeholder="Year of Study"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                    <Input
                        placeholder="Contact Email"
                        value={contact_email}
                        onChange={(e) => setContact_email(e.target.value)}
                    />
                    <Input
                        placeholder="Hourly Rate"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                    <Button 
                        colorScheme={colorScheme} 
                        type="button"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </Flex>
    </ChakraProvider>
);

}

export default ApplicationForm;


