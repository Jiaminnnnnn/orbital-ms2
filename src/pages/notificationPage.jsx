import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Link, ChakraProvider, CSSReset, extendTheme, VStack, Flex, IconButton } from '@chakra-ui/react';
import { supabase } from './supabaseClient';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const customTheme = extendTheme({
  styles: {
    global: {
      body: {
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

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { user, error: userError } = await supabase.auth.getUser();
        if (userError) {
          throw userError;
        }

        const { data: notifications, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('receiver_id', user.id);

        if (notificationsError) {
          throw notificationsError;
        }

        setNotifications(notifications);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <ChakraProvider theme={customTheme}>
    <CSSReset />
    <Flex alignItems="center" justifyContent="center" minH="100vh" position="fixed" width="100%" bg="lightblue">
      <Box w={["90%", "80%", "60%", "40%"]} bg="whiteAlpha.900" p="20" rounded="md">
        <VStack spacing={6} p={8} borderRadius="md" backgroundColor={'whiteAlpha.900'}>
        <Heading as="h2" size="xl" marginBottom={5} color="blue.300" fontFamily="heading">
        Notifications
      </Heading>
      <IconButton
          position="absolute"
          top="1rem"
          left="1rem"
          size="lg"
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/home')}
        />
      <List>
        {notifications.map((notification) => (
          <ListItem key={notification.id}>
            <Link as={RouterLink} to={`/notification/${notification.id}`}>
              {notification.message}
            </Link>
          </ListItem>
        ))}
      </List>
      </VStack>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Notification;
