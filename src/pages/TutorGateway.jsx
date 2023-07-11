import React from 'react';
import { VStack, Button, IconButton, Heading, Box, Flex, useColorModeValue, ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

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

function TutorGateway() {
  const navigate = useNavigate();
  const colorScheme = useColorModeValue('blue', 'gray');

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Flex alignItems="center" justifyContent="center" minH="100vh" position="fixed" width="100%" bg="lightblue">
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
    </ChakraProvider>
  );
}

export default TutorGateway;
