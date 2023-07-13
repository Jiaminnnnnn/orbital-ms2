import React, { useEffect, useState } from 'react';
import { Box, Heading, List, ListItem, Link, ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import { supabase } from '../supabaseClient';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

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
});

const UserBNotification = () => {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase.from('notifications').select('*');

        if (error) {
          throw error;
        }
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();
  }, []);

  const navigate = useNavigate();

  const handleNotificationClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <Box mt={4}>
      <Heading as="h2" size="md" mb={2}>
        User B's Notifications:
      </Heading>
      <List spacing={2}>
        {notifications.map((notification) => (
          <ListItem key={notification.id}>
            <Link as={RouterLink} to={`/profile/${notification.userId}`} onClick={() => handleNotificationClick(notification.userId)}>
              {notification.message}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const NotificationPage = () => {
  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Box p={4}>
        <Heading as="h1" size="xl" mb={4}>
          Notifications
        </Heading>
        <UserBNotification />
      </Box>
    </ChakraProvider>
  );
};

export default NotificationPage;
