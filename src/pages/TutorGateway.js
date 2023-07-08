import React from 'react';
import { VStack, Button, Heading, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function TutorGateway() {
    const navigate = useNavigate();
    const colorScheme = useColorModeValue('green', 'gray');

    return (
        <Flex alignItems="center" justifyContent="center" minH="100vh">
            <Box w={["90%", "80%", "60%", "40%"]}>
                <VStack spacing={6} p={8} boxShadow="lg" borderRadius="md" backgroundColor={useColorModeValue('gray.100', 'gray.700')}>
                    <Heading as="h2" size="xl" marginBottom={5}>
                        Welcome to the Tutor Gateway
                    </Heading>
                    <Button colorScheme={colorScheme} onClick={() => navigate('/apply')}>
                        Apply as a Tutor
                    </Button>
                    <Button colorScheme={colorScheme} onClick={() => navigate('/applications')}>
                        Find a Tutor
                    </Button>
                </VStack>
            </Box>
        </Flex>
    );
}

export default TutorGateway;

