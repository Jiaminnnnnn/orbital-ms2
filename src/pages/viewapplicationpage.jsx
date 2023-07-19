import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  IconButton,
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
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

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

const ViewApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [module, setModule] = useState(localStorage.getItem('module') || '');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [gender, setGender] = useState(localStorage.getItem('gender') || '');
  const [year, setYear] = useState(localStorage.getItem('year') || '');
  const [courseOfStudy, setCourseOfStudy] = useState(localStorage.getItem('courseOfStudy') || '');
  const [contactDetail, setContactDetail] = useState(localStorage.getItem('contactDetail') || '');
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
      console.log('Receiver ID:', receiver_id);
  
      const { data, error } = await supabase.from('notifications').insert([
        {
          receiver_id: receiver_id,
          message: 'I am interested to be your tutee',
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
    localStorage.setItem('platforms', JSON.stringify(platforms));
  }, [module, gender, year, courseOfStudy, contactDetail, platforms]);

  return (
    <ChakraProvider theme={customTheme}>
      <CSSReset />
      <Flex direction="column" alignItems="center" justifyContent="center" paddingTop="10vh" width="100%" bg="lightblue">
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
              View Applications
            </Heading>

            <form onSubmit={handleSearch}>
              <Input
                placeholder="Module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
              />
              <Button type="submit" colorScheme={colorScheme}>
                Search
              </Button>
            </form>
            {applications.map((application, index) => (
              <Box key={index} p={5} shadow="md" borderWidth="1px" borderRadius="md" width="100%">
                <Heading fontSize="xl">{application.name}</Heading>
                <Text mt={4}>
                  <b>Module:</b> {application.module}
                </Text>
                <Text mt={4}>
                  <b>Year:</b> {application.year}
                </Text>
                <Button onClick={() => goToApplicationDetail(application.id)} colorScheme={colorScheme}>
                  View More
                </Button>
                <Button onClick={() => handleNotification(application)} colorScheme={colorScheme}>
                  Send Notification
                </Button>
              </Box>
            ))}
          </VStack>
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

export default ViewApplications;
