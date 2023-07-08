import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/loginPage';
import Home from './pages/homePage';
import Profile from './pages/profilePage';
import ApplicationForm from './pages/applicationform';
import ViewApplications from './pages/viewapplicationpage';
import TutorGateway from './pages/TutorGateway';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/apply" element={<ApplicationForm />} />
        <Route path="/applications" element={<ViewApplications />} />
        <Route path="/gateway" element={<TutorGateway />} />
      </Routes>
    </Router>
  );
}

export default App;
