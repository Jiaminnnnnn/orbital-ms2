import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Flex,
  useColorModeValue,
  ChakraProvider,
  CSSReset,
  extendTheme,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Select,
  Textarea,
} from '@chakra-ui/react';
import { Link as RouterLink,useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

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

const Home = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [applications, setApplications] = useState([]);
  const [module, setModule] = useState(localStorage.getItem('module') || '');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [gender, setGender] = useState(localStorage.getItem('gender') || '');
  const [year, setYear] = useState(localStorage.getItem('year') || '');
  const [courseOfStudy, setCourseOfStudy] = useState(localStorage.getItem('courseOfStudy') || '');
  const [contactDetail, setContactDetail] = useState(localStorage.getItem('contactDetail') || '');
  const [senderName, setSenderName] = useState(localStorage.getItem('senderName') || '');
  const [platforms, setPlatforms] = useState(
    localStorage.getItem('platforms') ? JSON.parse(localStorage.getItem('platforms')) : []
  );
  const [user, setUser] = useState(null);
  const goToApplicationDetail = (id) => {
    navigate(`/application/${id}`);
}

  useEffect(() => {
    fetchApplications();
    fetchUser();
    fetchUnreadCount();
  }, []);

  const fetchApplications = async (module = '') => {
    try {
      let { data, error } = await supabase.from('tutor_applications').select('*');

      if (module) {
        data = data.filter((application) =>
          application.module.toLowerCase().includes(module.toLowerCase())
        );
      }

      if (error) {
        console.error('Error fetching applications', error);
      } else {
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  };

  const fetchUser = async () => {
    try {
      const { user, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
      } else {
        setUser(user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchApplications(module);
  };

  const fetchUnreadCount = async () => {
    const {data: { session },} = await supabase.auth.getSession();
    const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact'})
        .eq('receiver_id', session.user.id)
        .eq('is_read', false);
  
    if (error) {
        console.error('Error fetching unread notifications count:', error);
    } else {
        setUnreadCount(count);
    }
};

  //notification function
  const handleNotification = async (application) => {
    try {
      const { data, error } = await supabase
        .from('tutor_applications')
        .select('uuid')
        .eq('id', application.id)
        .single();
  
      const receiver_id = data.uuid;
      setSelectedApplication({ ...application, receiver_id });
      onOpen();
    } catch (error) {
      console.error('Oops! Error fetching receiver ID:', error.message);
    }
  };
  
  const sendNotification = async () => {
    try {
      if (!selectedApplication || !selectedApplication.receiver_id) {
        console.error('Receiver ID is missing');
        return;
      }
  
      const { receiver_id } = selectedApplication;
      const {data: { session },} = await supabase.auth.getSession();
      const uid = session ? session.user.id : null;
      console.log('Receiver ID:', receiver_id);
  
      const { data, error } = await supabase.from('notifications').insert([
        {
          sender_id: uid,
          receiver_id: receiver_id,
          message: 'I am interested to be your tutee',
          senderName: senderName,
          gender: gender,
          year: year,
          course_of_study: courseOfStudy,
          contact_detail: contactDetail,
          platform: platforms,
          module: selectedApplication.module,
        },
      ]);
  
      if (error) {
        throw error;
      }
  
      console.log('Notification sent');
      onClose();
    } catch (error) {
      console.error('Oops! Error triggering notification:', error.message);
    }
  };
  
  const colorScheme = useColorModeValue('blue', 'gray');

  useEffect(() => {
    localStorage.setItem('module', module);
    localStorage.setItem('gender', gender);
    localStorage.setItem('year', year);
    localStorage.setItem('courseOfStudy', courseOfStudy);
    localStorage.setItem('contactDetail', contactDetail);
    localStorage.setItem('senderName', senderName);
    localStorage.setItem('platforms', JSON.stringify(platforms));
  }, [module, gender, year, courseOfStudy, contactDetail,senderName, platforms]);

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Flex direction="column" alignItems="center" justifyContent="center" minHeight="100vh" bg="lightblue">
        <Flex width="100%" justifyContent="center" alignItems="center">
          <Box textAlign="center" flex="1">
            <Heading as="h2" size="xl" fontWeight="bold" marginBottom={3} color="blue.300" fontFamily="heading">
              Home Page
            </Heading>
          </Box>
          <Button onClick={() => supabase.auth.signOut()} mx={10} size='sm'>Log out</Button>
        </Flex>
  
        <Flex justifyContent="space-between" mx={10} width="100%">
          <Button as={RouterLink} to="/notifications" colorScheme={colorScheme} size="sm">
            Notifications
            {unreadCount > 0 && (
              <Box borderRadius="50%" bg="red.500" color="white" position="absolute" top="0" right="-10px" p="2px 6px" fontSize="xs">
                  {unreadCount}
              </Box>
            )}
          </Button>
          <Button colorScheme={colorScheme} size="sm" onClick={() => navigate('/apply')}>
            Become a Tutor
          </Button>
        </Flex>
        
        <Box w={["90%", "80%", "60%", "40%"]} boxShadow="md" bg="whiteAlpha.900" p="20" rounded="md" mt={10}>
          <form onSubmit={handleSearch}>
            <Flex alignItems="center">
              <Input
                flex="1"
                placeholder="Search a Module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
              />
              <Button type="submit" colorScheme={colorScheme} size='md'>
                Search
              </Button>
            </Flex>
          </form>
          {applications.map((application, index) => (
            <Box key={index} p={5} shadow="md" borderWidth="1px" borderRadius="md" width="100%" marginTop={2}>
              <Heading fontSize="xl">{application.name}</Heading>
              <Text mt={4}>
                <b>Module:</b> {application.module}
              </Text>
              <Text mt={4}>
                <b>Year:</b> {application.year}
              </Text>
              <Button onClick={() => goToApplicationDetail(application.id)} colorScheme={colorScheme} size='sm'>
                View More
              </Button>
              <Button onClick={() => handleNotification(application)} colorScheme={colorScheme} size='sm' marginLeft={2}>
                Send Notification
              </Button>
            </Box>
          ))}
        </Box>
        
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Send Notification</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            {selectedApplication && (
            <>
                            <Text>I am interested to be your tutee for the module {selectedApplication.module}, please contact me via:</Text>
              <Box maxH="200px" overflowY="auto">
                <Checkbox
                  value="Telegram"
                  isChecked={platforms.includes('Telegram')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPlatforms([...platforms, e.target.value]);
                    } else {
                      setPlatforms(platforms.filter((platform) => platform !== e.target.value));
                    }
                  }}
                >
                  Telegram
                </Checkbox>
                <Checkbox
                  value="WhatsApp"
                  isChecked={platforms.includes('WhatsApp')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPlatforms([...platforms, e.target.value]);
                    } else {
                      setPlatforms(platforms.filter((platform) => platform !== e.target.value));
                    }
                  }}
                >
                  WhatsApp
                </Checkbox>
                <Checkbox
                  value="Email"
                  isChecked={platforms.includes('Email')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPlatforms([...platforms, e.target.value]);
                    } else {
                      setPlatforms(platforms.filter((platform) => platform !== e.target.value));
                    }
                  }}
                >
                  Email
                </Checkbox>
                <Checkbox
                  value="Phone Number"
                  isChecked={platforms.includes('Phone Number')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setPlatforms([...platforms, e.target.value]);
                    } else {
                      setPlatforms(platforms.filter((platform) => platform !== e.target.value));
                    }
                  }}
                >
                  Phone Number
                </Checkbox>
              </Box>
              <VStack mt={4} spacing={4}>
              <Input
                placeholder="Your Name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
                <Textarea
                  placeholder="Contact Details"
                  value={contactDetail}
                  onChange={(e) => setContactDetail(e.target.value)}
                />
                <Text>About me:</Text>
                <Select
                  placeholder="Gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
                <Select
                  placeholder="Year of Study"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </Select>
                <Textarea
                  placeholder="Course of Study"
                  value={courseOfStudy}
                  onChange={(e) => setCourseOfStudy(e.target.value)}
                />
              </VStack>
            </>
            )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={sendNotification}>
                Send
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </ChakraProvider>
  );
  
};

export default Home;
