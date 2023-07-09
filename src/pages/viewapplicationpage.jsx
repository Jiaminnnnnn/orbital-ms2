import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';

const ViewApplications = () => {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            const { data, error } = await supabase
                .from('tutor_applications')
                .select('*');
    
            console.log('data:', data);
            console.log('error:', error);
    
            if (error) {
                console.error('Error fetching applications', error);
            } else {
                setApplications(data);
            }
        }
    
        fetchApplications();
    }, []);
    
    
    return (
        <VStack spacing={5}>
            {applications.map((application, index) => (
                <Box key={index} p={5} shadow="md" borderWidth="1px" borderRadius="md" width="100%">
                    <Heading fontSize="xl">{application.name}</Heading>
                    <Text mt={4}><b>Module:</b> {application.module}</Text>
                    <Text mt={4}><b>Bio:</b> {application.bio}</Text>
                    <Text mt={4}><b>Year:</b> {application.year}</Text>
                    <Text mt={4}><b>Contact Email::</b> {application.contact_email}</Text>
                    <Text mt={4}><b>Cost:</b> {application.cost}</Text>
                </Box>
            ))}
        </VStack>
    );
}

export default ViewApplications;
