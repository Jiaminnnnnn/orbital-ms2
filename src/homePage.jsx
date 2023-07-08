import { Link } from 'react-router-dom';
import { Text, Button } from '@chakra-ui/react';

export default function Home() {
  return (
    <div>
      <Text>Dashboard</Text>
      <Link to="/profile">Profile</Link>
    </div>
  );
}
