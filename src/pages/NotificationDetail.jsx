import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Box, Button, IconButton, Text, VStack, Heading, useColorModeValue, Flex, ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "lightblue",
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      },
    },
  },
  colors: {
    blue: {
      300: '#3B82F6',
    },
  },
  fonts: {
    body: 'Georgia, sans-serif',
    heading: 'Comic Sans MS, Comic Sans MS',
  },
});

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [senderUsername, setSenderUsername] = useState('');
  

  useEffect(() => {
    fetchNotification();
  }, []);

  const fetchNotification = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching notification', error);
      } else {
        setNotification(data);
      }
    } catch (error) {
      console.error('Error fetching notification', error);
    }
  };


  const deleteNotification = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .match({ id: notification.id });
        
      if (error) {
        console.error('Error deleting notification:', error);
      } else {
        alert('Notification deleted successfully!');
        setNotification(null); // remove notification from state
        navigate('/notifications');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const colorScheme = useColorModeValue('blue', 'gray');

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Flex direction="column" alignItems="center" justifyContent="center" minHeight="100vh" bg="lightblue">
        <IconButton
          position="absolute"
          top="1rem"
          left="1rem"
          size="lg"
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/notifications')}
        />
        <Box w={["90%", "80%", "60%", "40%"]} boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md">
          {notification ? (
            <>
              <Heading as="h2" size="xl" fontWeight="bold" color="blue.300" fontFamily="heading">
                Notification Detail
              </Heading>
              <Text><b>From:</b> {notification.senderName}</Text>
              <Text><b>Message:</b> {notification.message}</Text>
              <Text><b>Gender:</b> {notification.gender}</Text>
              <Text><b>Year:</b> {notification.year}</Text>
              <Text><b>Course of Study:</b> {notification.course_of_study}</Text>
              <Text><b>Contact Detail:</b> {notification.contact_detail}</Text>
              <Text><b>Platform:</b> {notification.platform.join(', ')}</Text>
              <Text><b>Module:</b> {notification.module}</Text>
              <Button colorScheme="red" onClick={deleteNotification}>Delete</Button>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default NotificationDetail;
