import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, CSSReset, extendTheme } from '@chakra-ui/react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Define your theme here
const theme = extendTheme({
  colors: {
    brand: {
      500: '#3D9970', // This is the green you want to use
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <CSSReset />
      <App />
    </ChakraProvider>
  </React.StrictMode>
);

reportWebVitals();







