import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast } from 'react-toastify';

let logoutTimer;

// Function to handle auto-logout
const autoLogout = () => {
  toast.error("Session expired. Please log in again.");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Function to track inactivity (15-minute timeout)
const trackInactivity = () => {
  clearTimeout(logoutTimer);
  
  // Set the logout timer to 15 minutes (900,000 milliseconds)
  const timeRemaining = 15 * 60 * 1000; // 15 minutes in milliseconds

  logoutTimer = setTimeout(autoLogout, timeRemaining);
};

// Axios interceptor for token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      autoLogout();
    }
    return Promise.reject(error);
  }
);

const App = () => {
  useEffect(() => {
    // Attach listeners for activity
    ["mousemove", "keydown", "click"].forEach((event) =>
      window.addEventListener(event, trackInactivity)
    );

    // Clean up event listeners on component unmount
    return () => {
      ["mousemove", "keydown", "click"].forEach((event) =>
        window.removeEventListener(event, trackInactivity)
      );
    };
  }, []);

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
