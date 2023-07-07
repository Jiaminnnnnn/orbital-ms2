import React, { useState } from 'react';
import { VStack, Input, Textarea, Button, useColorModeValue, Box, Flex, Heading, Alert, AlertIcon, useToast } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const ApplicationForm = () => {
    const [name, setName] = useState('');
    const [module, setModule] = useState('');
    const [bio, setBio] = useState('');
    const [year, setYear] = useState('');
    const [contact_email, setContact_email] = useState('');
    const [cost, setCost] = useState('');
    const colorScheme = useColorModeValue('green', 'gray');
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

    return (
        <Flex alignItems="center" justifyContent="center" minH="100vh">
            <Box w={["90%", "80%", "60%", "40%"]}>
                <VStack 
                    as="form"
                    spacing={4} 
                    padding={8} 
                    onSubmit={handleSubmit} 
                    backgroundColor={useColorModeValue('gray.100', 'gray.700')}
                    borderRadius="md"
                    boxShadow="lg"
                >
                    <Heading as="h2" size="xl" marginBottom={5}>
                        Tutor Application Form
                    </Heading>
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
                        placeholder="Bio"
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                    />
                    <Input
                        placeholder="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                    <Input
                        placeholder="Contact Email"
                        value={contact_email}
                        onChange={(e) => setContact_email(e.target.value)}
                    />
                    <Input
                        placeholder="Cost"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                    />
                    <Button 
                        colorScheme={colorScheme} 
                        type="submit"
                    >
                        Submit
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}

export default ApplicationForm;
