import React, {useContext, useEffect} from 'react'
import {Routes, Route } from 'react-router-dom'
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import { AuthContext } from './context/AuthContext';
import {useNavigate} from 'react-router-dom'

const Routing = () => {
  const navigate = useNavigate()
  const isLogged = sessionStorage.getItem("isLogged");
          const {Login} = useContext(AuthContext)
        useEffect(() => {
            if (isLogged) {
              // execute only if user has already loggedin and user and token is available in session
              const user = JSON.parse(sessionStorage.getItem("user"));
              const token = sessionStorage.getItem("token");
              console.log('session..')
              console.log(user,token)
              Login({ token, user });
            }
        },[])

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={isLogged ? <HomePage /> : <LoginPage />} />
      <Route path="/profile/:userId" element={<ProfilePage />} />
    </Routes>
  );
}

export default Routing