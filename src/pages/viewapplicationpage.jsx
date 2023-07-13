import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Input, Button, IconButton, Flex, useColorModeValue, ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
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

const ViewApplications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [module, setModule] = useState('');

    const goToApplicationDetail = (id) => {
        navigate(`/application/${id}`);
    }


    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async (module = '') => {
        let { data, error } = await supabase
            .from('tutor_applications')
            .select('*');

        if (module) {
            data = data.filter((application) => application.module.toLowerCase().includes(module.toLowerCase()));
        }

        console.log('data:', data);
        console.log('error:', error);

        if (error) {
            console.error('Error fetching applications', error);
        } else {
            setApplications(data);
        }
    }


    const handleSearch = (event) => {
        event.preventDefault();
        fetchApplications(module);
    }

    //notification function
    const handleNotification = async (applicationId, userId) => {
        try {
          const { data: applicationData, error: applicationError } = await supabase
            .from('tutor_applications')
            .select('module')
            .eq('id', applicationId)
            .single();
      
          if (applicationError) {
            throw applicationError;
          }
      
          const { module } = applicationData;
      
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('contact_number')
            .eq('user_id', userId)
            .single();
      
          if (profileError) {
            throw profileError;
          }
      
          const { contact_number } = profileData;
      
          const { data, error } = await supabase.from('notifications').insert([
            { message: 'I am interested to be your tutee', userId, module, contact_number }
          ]);
      
          if (error) {
            throw error;
          }
      
          console.log('Notification sent');
        } catch (error) {
          console.error('Oops! Error triggering notification:', error.message);
        }
      };      
      
        const colorScheme = useColorModeValue('blue', 'gray');
    
    return (
        <ChakraProvider theme={customTheme}>
            <CSSReset />
            <Flex direction="column" alignItems="center" justifyContent="center" paddingTop="10vh" width="100%" bg="lightblue">
                <Box w={["90%", "80%", "60%", "40%"]} boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md">
                    <VStack spacing={6} p={8} boxShadow="lg" borderRadius="md" backgroundColor={useColorModeValue('whiteAlpha.900', 'gray.700')}>
                    <IconButton
                       position="absolute"
                       top="1rem"
                       left="1rem"
                       size="lg"
                       aria-label="Back"
                       icon={<ArrowBackIcon />}
                       onClick={() => navigate('/home')}
                     />
                        <Heading as="h2" size="xl" marginBottom={5} color="blue.300" fontFamily="heading">
                            View Applications
                        </Heading>

                        <form onSubmit={handleSearch}>
                            <Input 
                                placeholder="Module" 
                                value={module} 
                                onChange={(e) => setModule(e.target.value)}
                            />
                            <Button type="submit" colorScheme={colorScheme}>Search</Button>
                        </form>
                        {applications.map((application, index) => (
                            <Box key={index} p={5} shadow="md" borderWidth="1px" borderRadius="md" width="100%">
                                <Heading fontSize="xl">{application.name}</Heading>
                                <Text mt={4}><b>Module:</b> {application.module}</Text>
                                <Text mt={4}><b>Bio:</b> {application.bio}</Text>
                                <Text mt={4}><b>Year:</b> {application.year}</Text>
                                <Button onClick={() => goToApplicationDetail(application.id)} colorScheme={colorScheme}>
                                    View More
                                </Button>
                                <Button onClick={() => handleNotification(application.id, userId)} colorScheme="blue">
  Send Notification
</Button>

                            </Box>
                        ))}
                    </VStack>
                </Box>
            </Flex>
        </ChakraProvider>
    );
}

export default ViewApplications;
