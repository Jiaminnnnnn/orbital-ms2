import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, Text, VStack, Heading, useColorModeValue, Flex, ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';


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

function ApplicationDetail() {
  const [application, setApplication] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchApplication = async () => {
      const { data: application, error } = await supabase
        .from('tutor_applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching application', error);
      else setApplication(application);
    };

    fetchApplication();

  }, [id]);

  const handleEdit = async () => {
    const {data: { session },} = await supabase.auth.getSession();
    const uid = session ? session.user.id : null;
    if(uid === application?.uuid) {
      navigate(`/application/edit/${application.id}`);
    } else {
      alert('You are not authorized to edit this application');
    }
  };

  const handleDelete = async () => {
    const {data: { session },} = await supabase.auth.getSession();
    const uid = session ? session.user.id : null;
    if(uid === application?.uuid) {
      const { error } = await supabase
        .from('tutor_applications')
        .delete()
        .eq('id', application.id);

      if (error) console.error('Error deleting application', error);
      else navigate('/home');
    } else {
      alert('You are not authorized to delete this application');
    }
  };


  const colorScheme = useColorModeValue('blue', 'gray');
    
  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Flex alignItems="center" justifyContent="center" minH="100vh" position="fixed" width="100%" bg="lightblue">
        <Box w={["90%", "80%", "60%", "40%"]} bg="whiteAlpha.900" p="20" rounded="md">
          <VStack spacing={6} p={8} borderRadius="md" backgroundColor={'whiteAlpha.900'}>
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
              Application Detail
            </Heading>
            {application && (
              <>
                <Text><strong>Name:</strong> {application.name}</Text>
                <Text><strong>Module:</strong> {application.module}</Text>
                <Text><strong>Other Details:</strong> {application.bio}</Text>
                <Text><strong>Year of Study:</strong> {application.year}</Text>
                <Text><strong>Contact Email:</strong> {application.contact_email}</Text>
                <Text><strong>Hourly Rate: </strong> ${application.cost}</Text>
                <Box>
                  <Button colorScheme={colorScheme} mr={3} onClick={handleEdit}>Edit</Button>
                  <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
                </Box>
              </>
            )}
          </VStack>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default ApplicationDetail;
