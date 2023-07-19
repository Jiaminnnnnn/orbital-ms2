import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Link, ChakraProvider, CSSReset, extendTheme, VStack, Flex, IconButton, Text } from '@chakra-ui/react';
import { supabase } from './supabaseClient';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [senderUsernames, setSenderUsernames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const {data: { session },} = await supabase.auth.getSession();
    const uid = session ? session.user.id : null;

    if (!uid) {
      console.log('User is not logged in.');
      return;
    }

    try {
      const { data: notifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*, senderName')
        .eq('receiver_id', uid);

      if (notificationsError) {
        throw notificationsError;
      }

      const senderIds = notifications.map(n => n.sender_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', senderIds);
  
      if (profilesError) {
        throw profilesError;
      }

      const usernameMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      }, {});

      setSenderUsernames(usernameMap);
      setNotifications(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      fetchNotifications(); // Reload the notifications

    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  };

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Flex direction="column" alignItems="center" justifyContent="center" minH="100vh" width="100%" bg="lightblue">
        <IconButton
            position="absolute"
            top="1rem"
            left="1rem"
            size="lg"
            aria-label="Back"
            icon={<ArrowBackIcon />}
            onClick={() => navigate('/home')}
          />
        <Box w={["90%", "80%", "60%", "40%"]} bg="whiteAlpha.900" p="20" rounded="md">
          <VStack spacing={6} p={8} borderRadius="md" backgroundColor={'whiteAlpha.900'}>
            <Heading as="h2" size="xl" marginBottom={5} color="blue.300" fontFamily="heading">
              Notifications
            </Heading>
            <List>
              {notifications.map((notification) => (
                <ListItem key={notification.id}>
                  <Link as={RouterLink} to={`/notification/${notification.id}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Text color={notification.is_read ? "black" : "green"}>
                      {notification.senderName}
                    </Text>
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
