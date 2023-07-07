import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './loginPage';
import Home from './homePage';
import Profile from './profilePage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/profile">
          <Profile />
        </Route>
      </Routes>
    </Router>
  );
}
