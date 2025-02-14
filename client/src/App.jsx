import React, { useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AppContext } from "./context/AppContext";

let logoutTimer; // Global variable to track logout timeout

const App = () => {
  const { setIsLoggedIn } = useContext(AppContext); // Access global state from context

  // Function to handle auto-logout
  const autoLogout = () => {
    setIsLoggedIn(true);
    toast.error("Session expired. Please log in again.");
    window.location.href = "/login";
  };

  // Function to track user inactivity
  const trackInactivity = () => {
    clearTimeout(logoutTimer); // Clear any existing timers
    const timeoutDuration = 15 * 60 * 1000; // 15 minutes
    logoutTimer = setTimeout(autoLogout, timeoutDuration); // Start a new timer
  };

  // Axios interceptor to handle token expiration globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          autoLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor); // Remove interceptor on component unmount
    };
  }, []);

  // Set up activity tracking and clean up listeners
  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, trackInactivity));

    return () => {
      events.forEach((event) => window.removeEventListener(event, trackInactivity));
    };
  }, []);

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;
