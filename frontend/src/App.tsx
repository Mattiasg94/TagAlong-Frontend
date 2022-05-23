import React from 'react';
import './index.css';
import HeaderTop from './components/HeaderTop';
import './styles/fontawesome';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExplorePage from './pages/ExplorePage';
import NewEventPage from './pages/NewEventPage';
import './styles/css/mybtn.css';
import GStyles from './styles/css/Global.module.scss';
import FriendsPage from './pages/FriendsPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './routes';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from './pages/Register';
import HeaderBottom from './components/HeaderBottom';
import FriendProfile from './components/FriendProfile';
import MyEventsPage from './pages/MyEventsPage';


function App() {
  return (
    <Router>
      <div className={GStyles.bajs}>
        <Routes>
          <Route path="/" element={<HeaderBottom />}>
            <Route path="/" element={<HeaderTop />}>
              <Route path='/' element={<ProtectedRoute />}>
                <Route index element={<MyEventsPage />} />
                <Route path="explore" element={< ExplorePage />} />
                <Route path="new-event" element={<NewEventPage />} />
                <Route path="users" element={<FriendsPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="friendprofile" element={<FriendProfile />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router >
  );
}

export default App;
