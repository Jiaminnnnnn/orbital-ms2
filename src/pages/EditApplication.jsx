import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Heading, VStack, Button, IconButton, Input, useColorModeValue, ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
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

const EditApplication = () => {
    const [application, setApplication] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const fetchApplication = async () => {
        const { data, error } = await supabase
            .from('tutor_applications')
            .select('*')
            .eq('id', id)
            .single();

        if (error) console.error('Error fetching application:', error);
        else setApplication(data);
    }

    const handleSave = async (event) => {
        event.preventDefault();

        const { data, error } = await supabase
            .from('tutor_applications')
            .update({
                name: event.target.name.value,
                module: event.target.module.value,
                year: event.target.year.value,
                bio: event.target.bio.value,
                contact_email: event.target.contact_email.value,
                cost: event.target.cost.value

                // Add fields as necessary ...
            })
            .eq('id', id);

        if (error) console.error('Error saving application:', error);
        else navigate(`/application/${id}`);
    }

    const colorScheme = useColorModeValue('blue', 'gray');

    return (
        <ChakraProvider theme={customTheme}>
            <CSSReset />
            {application && (
                <VStack spacing={8} padding={10} boxShadow="lg" borderRadius="md" backgroundColor={useColorModeValue('whiteAlpha.900', 'gray.700')}>
                 <IconButton
                  position="absolute"
                  top="1rem"
                  left="1rem"
                  size="lg"
                  aria-label="Back"
                  icon={<ArrowBackIcon />}
                  onClick={() => navigate('/applications')}
                  />
                    <Heading as="h2" size="xl" color="blue.300" fontFamily="heading">
                        Edit Application
                    </Heading>

                    <form onSubmit={handleSave}>
                        <Box>
                            <label htmlFor="name">Name</label>
                            <Input id="name" defaultValue={application.name} />
                            {/* Add fields as necessary */}
                        </Box>
                        <Box>
                            <label htmlFor="module">Module</label>
                            <Input id="module" defaultValue={application.module} />
                            {/* Add fields as necessary */}
                        </Box>
                        <Box>
                            <label htmlFor="year">Year</label>
                            <Input id="year" defaultValue={application.year} />
                            {/* Add fields as necessary */}
                        </Box>
                        <Box>
                            <label htmlFor="bio">Bio</label>
                            <Input id="bio" defaultValue={application.bio} />
                            {/* Add fields as necessary */}
                        </Box>
                        <Box>
                            <label htmlFor="contact_email">Contact Email</label>
                            <Input id="contact_email" defaultValue={application.contact_email} />
                            {/* Add fields as necessary */}
                        </Box>
                        <Box>
                            <label htmlFor="cost">Cost</label>
                            <Input id="cost" defaultValue={application.cost} />
                            {/* Add fields as necessary */}
                        </Box>

                        <Button type="submit" colorScheme={colorScheme}>
                            Save
                        </Button>
                    </form>
                </VStack>
            )}
        </ChakraProvider>
    );
};

export default EditApplication;
